#!/usr/bin/env python3
"""
Paleo-RS — scripts/sincronizar-sitios.py

Reescreve o bloco DB_SITIOS de js/dados.js a partir de DB_REGISTROS.

Por que existe: a cada lote novo de registros era preciso acrescentar os
sítios à mão e recontar os `count`. Errar isso é fácil e o validador
sempre pegava — mas depois do trabalho feito. Aqui o erro deixa de ser
possível: o nome, o município, a coordenada e a precisão vêm do próprio
registro, e o `count` é contado.

Regra de coordenada do sítio: a dos registros daquele sítio. Se houver
divergência entre registros do mesmo sítio, o script AVISA e usa a
coordenada de melhor precisão (publicada > aproximada > regional),
porque uma coordenada publicada nunca deve ser rebaixada por uma
estimativa.

Uso:  python3 scripts/sincronizar-sitios.py
"""

import json
import re
import sys
from collections import Counter, defaultdict

from ler_dados import carregar, DADOS_JS

ORDEM_PRECISAO = {"publicada": 0, "aproximada": 1, "regional": 2}


def main():
    d = carregar()
    regs = d["registros"]

    por_sitio = defaultdict(list)
    for r in regs:
        por_sitio[r["site"]].append(r)

    # ordem de aparição no banco, para o arquivo ficar legível e estável
    vistos, ordem = set(), []
    for r in regs:
        if r["site"] not in vistos:
            vistos.add(r["site"])
            ordem.append(r["site"])

    avisos, linhas = [], []
    for nome in ordem:
        grupo = por_sitio[nome]
        municipios = Counter(r["municipio"] for r in grupo)
        if len(municipios) > 1:
            avisos.append(f"sítio '{nome}' aparece em mais de um município: "
                          f"{', '.join(municipios)}")
        coords = {(r["lat"], r["lon"], r["coord_precisao"]) for r in grupo}
        if len(coords) > 1:
            avisos.append(f"sítio '{nome}' tem {len(coords)} coordenadas "
                          f"diferentes entre seus registros; usada a de melhor precisão")
        lat, lon, prec = sorted(coords, key=lambda c: ORDEM_PRECISAO.get(c[2], 9))[0]
        linhas.append(
            f'  {{ nome: {json.dumps(nome, ensure_ascii=False)}, '
            f'municipio: {json.dumps(municipios.most_common(1)[0][0], ensure_ascii=False)}, '
            f'lat: {lat}, lon: {lon}, count: {len(grupo)}, '
            f'coord_precisao: "{prec}" }}'
        )

    fonte = DADOS_JS.read_text(encoding="utf-8")
    novo = "const DB_SITIOS = [\n" + ",\n".join(linhas) + "\n];"
    fonte, n = re.subn(r"const DB_SITIOS = \[.*?\n\];", lambda _: novo, fonte, count=1, flags=re.S)
    if n != 1:
        sys.exit("Não encontrei o bloco DB_SITIOS em js/dados.js")
    DADOS_JS.write_text(fonte, encoding="utf-8")

    for a in avisos:
        print(f"AVISO  {a}")
    print(f"DB_SITIOS reescrito: {len(linhas)} sítios, {len(regs)} registros.")


if __name__ == "__main__":
    main()
