#!/usr/bin/env python3
"""
Paleo-RS — scripts/validar.py

Roda a cada alteração de js/dados.js e no GitHub Action.
Sai com código 1 se houver ERRO. AVISO não derruba o build: marca o que
precisa de olho humano sem travar o trabalho.

Uso:  python3 scripts/validar.py
"""

import json
import re
import sys
from collections import Counter
from pathlib import Path

from ler_dados import carregar, RAIZ

ERROS, AVISOS = [], []


def erro(regra, msg):
    ERROS.append(f"[{regra}] {msg}")


def aviso(regra, msg):
    AVISOS.append(f"[{regra}] {msg}")


# --------------------------------------------------------------------
# 1. Coordenadas dentro do Rio Grande do Sul
# --------------------------------------------------------------------
# Envelope do estado. Enquanto data/rs-municipios.json não existir, a
# checagem é por retângulo; assim que a malha entrar, troque por
# ponto-em-polígono do município declarado (ver rodapé deste arquivo).
RS_LAT = (-33.752, -27.077)
RS_LON = (-57.646, -49.691)


def valida_coordenadas(d):
    for r in d["registros"]:
        lat, lon = r.get("lat"), r.get("lon")
        if lat is None or lon is None:
            erro(1, f"registro {r['id']}: sem coordenada")
            continue
        if not (RS_LAT[0] <= lat <= RS_LAT[1] and RS_LON[0] <= lon <= RS_LON[1]):
            erro(1, f"registro {r['id']} ({r['taxon']}): "
                    f"coordenada {lat}, {lon} fora do envelope do RS")
        if r.get("coord_precisao") not in {"publicada", "aproximada", "regional"}:
            erro(1, f"registro {r['id']}: coord_precisao ausente ou inválida")


# --------------------------------------------------------------------
# 2. Coerência entre formação e bacia
# --------------------------------------------------------------------
FORMACAO_BACIA = {
    "Fm. Sanga do Cabral": "Bacia do Paraná — Supersequência Santa Maria",
    "Fm. Santa Maria": "Bacia do Paraná — Supersequência Santa Maria",
    "Fm. Caturrita": "Bacia do Paraná — Supersequência Santa Maria",
    "Grupo Itararé": "Bacia do Paraná — Supersequência Gondwana I",
    "Fm. Rio Bonito": "Bacia do Paraná — Supersequência Gondwana I",
    "Fm. Irati": "Bacia do Paraná — Supersequência Gondwana I",
    "Fm. Rio do Rasto": "Bacia do Paraná — Supersequência Gondwana I",
    "Fm. Botucatu": "Bacia do Paraná — Supersequência Gondwana III",
    "Fm. Serra Geral": "Bacia do Paraná — Supersequência Gondwana III",
    "Fm. Touro Passo": "Bacia de Pelotas e planície costeira",
}


def valida_estratigrafia(d):
    for r in d["registros"]:
        base = r["formacao"].split("/")[0].strip()
        esperada = FORMACAO_BACIA.get(base)
        if esperada is None:
            aviso(2, f"registro {r['id']}: formação '{base}' não está na tabela "
                     f"formação→bacia; acrescente-a ao validador")
        elif esperada != r["bacia"]:
            erro(2, f"registro {r['id']}: '{base}' declarada em '{r['bacia']}', "
                    f"mas pertence a '{esperada}'")


# --------------------------------------------------------------------
# 3. Soma dos count dos sítios == total de registros
# 4. total_registros de cada período == contagem real
# --------------------------------------------------------------------
def valida_contagens(d):
    registros = d["registros"]

    soma = sum(s["count"] for s in d["sitios"])
    if soma != len(registros):
        erro(3, f"soma dos count dos sítios = {soma}, registros = {len(registros)}")

    por_sitio = Counter(r["site"] for r in registros)
    for s in d["sitios"]:
        real = por_sitio.get(s["nome"], 0)
        if real != s["count"]:
            erro(3, f"sítio '{s['nome']}': count={s['count']}, real={real}")
    for nome in por_sitio:
        if nome not in {s["nome"] for s in d["sitios"]}:
            erro(3, f"sítio '{nome}' usado em registro mas ausente de DB_SITIOS")

    por_periodo = Counter(r["periodo_chave"] for r in registros)
    for p in d["periodos"]:
        real = por_periodo.get(p["chave"], 0)
        if real != p["total_registros"]:
            erro(4, f"período '{p['nome']}': total_registros={p['total_registros']}, real={real}")

    por_bio = Counter(r.get("biozona_chave") for r in registros)
    for z in d["biozonas"]:
        real = por_bio.get(z["chave"], 0)
        if real != z["total_registros"]:
            erro(4, f"biozona '{z['nome']}': total_registros={z['total_registros']}, real={real}")


# --------------------------------------------------------------------
# 5. id único; táxon duplicado no mesmo sítio
# --------------------------------------------------------------------
def valida_unicidade(d):
    ids = [r["id"] for r in d["registros"]]
    for i, n in Counter(ids).items():
        if n > 1:
            erro(5, f"id {i} aparece {n} vezes")

    chaves = Counter((r["site"], r["taxon"], r["numero_catalogo"]) for r in d["registros"])
    for (site, taxon, tombo), n in chaves.items():
        if n > 1:
            erro(5, f"'{taxon}' com tombo '{tombo}' repetido {n}x em '{site}'")

    pares = Counter((r["site"], r["taxon"]) for r in d["registros"])
    for (site, taxon), n in pares.items():
        if n > 1:
            aviso(5, f"'{taxon}' aparece {n}x no sítio '{site}' com tombos distintos — "
                     f"confirme que são espécimes diferentes, não duplicata")


# --------------------------------------------------------------------
# 6. Campos obrigatórios / 8. tipo_fonte
# --------------------------------------------------------------------
OBRIGATORIOS = ["id", "taxon", "categoria", "periodo", "periodo_chave", "era",
                "periodo_ordem", "idade_ma", "formacao", "bacia", "municipio",
                "local_coleta", "site", "lat", "lon", "coord_precisao",
                "numero_catalogo", "armazenamento", "unidade_pesquisa",
                "descritor", "tipo_fonte", "observacoes", "fontes"]

TIPOS_FONTE = {"Artigo em periódico", "Capítulo de sítio (SIGEP)", "Tese ou dissertação",
               "Anais ou resumo de evento", "Divulgação ou imprensa", "Citação em revisão"}


def valida_campos(d):
    for r in d["registros"]:
        for campo in OBRIGATORIOS:
            if campo not in r or r[campo] in (None, "", []):
                erro(6, f"registro {r.get('id', '?')}: campo obrigatório '{campo}' vazio")
        if r.get("tipo_fonte") not in TIPOS_FONTE:
            erro(8, f"registro {r['id']}: tipo_fonte '{r.get('tipo_fonte')}' fora da lista")
        if not r.get("fontes"):
            erro(6, f"registro {r['id']}: sem URL em 'fontes'")
        doi = r.get("doi", "")
        if doi and not re.match(r"^10\.\d{4,9}/\S+$", doi):
            erro(6, f"registro {r['id']}: DOI '{doi}' não tem forma de DOI")
        # Registro apoiado só em revisão já se declara frágil pelo tipo_fonte;
        # cobrar DOI dele seria ruído. Para os demais, a ausência tem de
        # estar explicada por escrito.
        if not doi and r.get("tipo_fonte") != "Citação em revisão" \
                and "Não informado" not in r.get("observacoes", "") \
                and "DOI" not in r.get("observacoes", ""):
            aviso(6, f"registro {r['id']}: sem DOI e sem explicação nas observações")


# --------------------------------------------------------------------
# 7. Todo período usado tem cor definida
# --------------------------------------------------------------------
def valida_periodos(d):
    chaves = {p["chave"] for p in d["periodos"]}
    for r in d["registros"]:
        if r["periodo_chave"] not in chaves:
            erro(7, f"registro {r['id']}: periodo_chave '{r['periodo_chave']}' não existe")
    for p in d["periodos"]:
        if not re.match(r"^#[0-9A-Fa-f]{6}$", p.get("cor", "")):
            erro(7, f"período '{p['nome']}': cor ausente ou malformada")
    ordens = [p["ordem"] for p in d["periodos"]]
    if ordens != sorted(ordens) or len(set(ordens)) != len(ordens):
        erro(7, "DB_PERIODOS: 'ordem' não é estritamente crescente da base ao topo")

    bio = {z["chave"] for z in d["biozonas"]}
    for r in d["registros"]:
        if r.get("biozona_chave") and r["biozona_chave"] not in bio:
            erro(7, f"registro {r['id']}: biozona '{r['biozona_chave']}' não existe")


# --------------------------------------------------------------------
# Instituições citadas precisam de ficha
# --------------------------------------------------------------------
def valida_instituicoes(d):
    siglas = {i["sigla"] for i in d["instituicoes"]}
    for r in d["registros"]:
        for sigla in [s.strip() for s in r["unidade_pesquisa"].split(";") if s.strip()]:
            if sigla not in siglas:
                aviso(0, f"registro {r['id']}: instituição '{sigla}' sem ficha em "
                         f"DB_INSTITUICOES")


# --------------------------------------------------------------------
# 9. data/*.json em dia com dados.js
# --------------------------------------------------------------------
def valida_artefatos(d):
    caminho = RAIZ / "data" / "registros.json"
    if not caminho.exists():
        aviso(9, "data/registros.json ainda não gerado — rode scripts/exportar-dados.py")
        return
    bruto = caminho.read_bytes()
    if bruto.startswith(b"\xef\xbb\xbf"):
        erro(9, "data/registros.json começa com BOM; BOM só no CSV")
        return
    gerado = json.loads(bruto.decode("utf-8"))
    if gerado.get("versao") != d["VERSAO_BANCO"]:
        erro(9, f"data/registros.json na versão {gerado.get('versao')}, "
                f"dados.js em {d['VERSAO_BANCO']}")
    if len(gerado.get("registros", [])) != len(d["registros"]):
        erro(9, f"data/registros.json tem {len(gerado.get('registros', []))} registros, "
                f"dados.js tem {len(d['registros'])} — artefato desatualizado")


# --------------------------------------------------------------------
# Todo sítio cai dentro do polígono do município que declara
# --------------------------------------------------------------------
def _malha():
    import subprocess, json as _j
    caminho = RAIZ / "js" / "malha.js"
    if not caminho.exists():
        return None
    script = ("const m=require(%s);process.stdout.write(JSON.stringify("
              "{lar:m.MAPA_LARGURA,alt:m.MAPA_ALTURA,cx:m.MAPA_CAIXA,"
              "mun:m.DB_MUNICIPIOS.map(x=>({n:x.n,d:x.d}))}));" % _j.dumps(str(caminho)))
    return _j.loads(subprocess.run(["node", "-e", script], capture_output=True,
                                   text=True, check=True).stdout)


def _aneis_do_path(d):
    import re as _re
    for trecho in d.split("M")[1:]:
        pts = []
        for par in trecho.rstrip("Z").split("L"):
            par = par.strip()
            if not par:
                continue
            x, y = par.split()
            pts.append((float(x), float(y)))
        if len(pts) >= 3:
            yield pts


def _dentro(p, anel):
    x, y = p
    dentro = False
    j = len(anel) - 1
    for i in range(len(anel)):
        xi, yi = anel[i]
        xj, yj = anel[j]
        if (yi > y) != (yj > y) and x < (xj - xi) * (y - yi) / (yj - yi) + xi:
            dentro = not dentro
        j = i
    return dentro


def valida_sitios_na_malha(d):
    import math
    malha = _malha()
    if malha is None:
        aviso(11, "js/malha.js ainda não gerado — rode scripts/gerar-malha.py")
        return
    cx = malha["cx"]
    k = math.cos(math.radians((cx["lat0"] + cx["lat1"]) / 2))
    ex, ey = (cx["lon1"] - cx["lon0"]) * k, (cx["lat1"] - cx["lat0"])
    esc = min(malha["lar"] / ex, malha["alt"] / ey)
    offx, offy = (malha["lar"] - ex * esc) / 2, (malha["alt"] - ey * esc) / 2

    por_nome = {}
    for m in malha["mun"]:
        por_nome.setdefault(m["n"], []).extend(_aneis_do_path(m["d"]))

    nomes_reg = {r["municipio"] for r in d["registros"]}
    for nome in sorted(nomes_reg):
        if nome not in por_nome:
            erro(11, f"município '{nome}' não existe na malha do RS")

    for s_ in d["sitios"]:
        if s_["municipio"] not in por_nome:
            continue
        px = (s_["lon"] - cx["lon0"]) * k * esc + offx
        py = (cx["lat1"] - s_["lat"]) * esc + offy
        if not any(_dentro((px, py), anel) for anel in por_nome[s_["municipio"]]):
            msg = (f"sítio '{s_['nome']}' cai fora do polígono de "
                   f"{s_['municipio']}")
            if s_.get("coord_precisao") == "publicada":
                erro(11, msg + " — coordenada publicada, então é erro de dado")
            else:
                aviso(11, msg + f" — coordenada {s_.get('coord_precisao')}, confira")


# --------------------------------------------------------------------
# Contraste dos tokens de texto (WCAG AA = 4,5:1)
# --------------------------------------------------------------------
def _lum(hexa):
    def canal(v):
        v /= 255
        return v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4
    r, g, b = (int(hexa[i:i + 2], 16) for i in (1, 3, 5))
    return 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b)


def razao(a, b):
    la, lb = _lum(a), _lum(b)
    claro, escuro = max(la, lb), min(la, lb)
    return (claro + 0.05) / (escuro + 0.05)


def valida_contraste():
    css = (RAIZ / "css" / "estilo.css").read_text(encoding="utf-8")
    tokens = dict(re.findall(r"--([\w-]+):\s*(#[0-9A-Fa-f]{6})", css))
    pares = [("tinta", "fundo"), ("tinta-2", "fundo"),
             ("tinta", "papel"), ("tinta-2", "papel"),
             ("alemoa", "papel"), ("pampa", "papel"),
             ("sobre-carvao", "carvao"), ("osso", "carvao")]
    for frente, fundo in pares:
        if frente not in tokens or fundo not in tokens:
            aviso(10, f"token --{frente} ou --{fundo} não encontrado no CSS")
            continue
        r = razao(tokens[frente], tokens[fundo])
        if r < 4.5:
            erro(10, f"--{frente} sobre --{fundo}: {r:.2f}:1, abaixo de 4,5:1 (WCAG AA)")
        else:
            print(f"  contraste --{frente} / --{fundo}: {r:.2f}:1")


# --------------------------------------------------------------------
def main():
    dados = carregar()
    print(f"Paleo-RS {dados['VERSAO_BANCO']} — {len(dados['registros'])} registros\n")

    valida_coordenadas(dados)
    valida_estratigrafia(dados)
    valida_contagens(dados)
    valida_unicidade(dados)
    valida_campos(dados)
    valida_periodos(dados)
    valida_instituicoes(dados)
    valida_artefatos(dados)
    valida_sitios_na_malha(dados)
    valida_contraste()

    print()
    for a in AVISOS:
        print(f"AVISO  {a}")
    for e in ERROS:
        print(f"ERRO   {e}")

    print(f"\n{len(ERROS)} erro(s), {len(AVISOS)} aviso(s).")
    sys.exit(1 if ERROS else 0)


# Pendente para a Fase 2, quando data/rs-municipios.json existir:
#   - trocar o envelope retangular por ponto-em-polígono do município
#     declarado em cada registro (exceto coord_precisao == "regional"
#     e plataforma continental);
#   - conferir que todo município citado existe entre os 497 do RS.

if __name__ == "__main__":
    main()
