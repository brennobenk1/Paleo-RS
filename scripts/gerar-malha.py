#!/usr/bin/env python3
"""
Paleo-RS — scripts/gerar-malha.py

geojs-43-mun.json (IBGE via tbrugz/geodata-br)  ->  js/malha.js

Projeta lat/lon em x/y com a MESMA transformação linear usada pelo resto
do mapa, simplifica por Douglas-Peucker e escreve caminhos SVG prontos.

A malha é um ARTEFATO GERADO. Rode de novo só quando a fonte mudar.

Uso:
    curl -o /tmp/geojs-43-mun.json \\
      https://raw.githubusercontent.com/tbrugz/geodata-br/master/geojson/geojs-43-mun.json
    python3 scripts/gerar-malha.py /tmp/geojs-43-mun.json
"""

import json
import sys as _s
_s.setrecursionlimit(50000)
import math
import sys
import unicodedata
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent

# Caixa do estado e tela do mapa. Projeção equiretangular com correção de
# cosseno na latitude média: o RS fica entre 27° e 34° S, onde um grau de
# longitude vale cerca de 0,86 grau de latitude em distância real. Sem a
# correção o estado sai esticado no sentido leste-oeste.
LON0, LON1 = -57.65, -49.69
LAT0, LAT1 = -33.76, -27.07
LAT_MEDIA = (LAT0 + LAT1) / 2
LARGURA, ALTURA = 1000.0, 760.0
TOLERANCIA = 0.008          # graus; ~800 m, cerca de 1 px na tela. Peso vs. forma


def projetar(lon, lat):
    k = math.cos(math.radians(LAT_MEDIA))
    x = (lon - LON0) * k
    y = (LAT1 - lat)
    ex = (LON1 - LON0) * k
    ey = (LAT1 - LAT0)
    escala = min(LARGURA / ex, ALTURA / ey)
    dx = (LARGURA - ex * escala) / 2
    dy = (ALTURA - ey * escala) / 2
    return x * escala + dx, y * escala + dy


def douglas_peucker(pontos, tol):
    if len(pontos) < 3:
        return pontos
    ini, fim = pontos[0], pontos[-1]
    dmax, idx = 0.0, 0
    for i in range(1, len(pontos) - 1):
        d = _dist_perp(pontos[i], ini, fim)
        if d > dmax:
            dmax, idx = d, i
    if dmax > tol:
        esq = douglas_peucker(pontos[:idx + 1], tol)
        dir_ = douglas_peucker(pontos[idx:], tol)
        return esq[:-1] + dir_
    return [ini, fim]


def _dist_perp(p, a, b):
    if a == b:
        return math.hypot(p[0] - a[0], p[1] - a[1])
    num = abs((b[0] - a[0]) * (a[1] - p[1]) - (a[0] - p[0]) * (b[1] - a[1]))
    return num / math.hypot(b[0] - a[0], b[1] - a[1])


def chave(nome):
    s = unicodedata.normalize("NFD", nome)
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    return s.lower().replace("'", "").replace(" ", "-")


def aneis(geom):
    if geom["type"] == "Polygon":
        return geom["coordinates"]
    saida = []
    for parte in geom["coordinates"]:
        saida.extend(parte)
    return saida


def main():
    origem = Path(sys.argv[1] if len(sys.argv) > 1 else "/tmp/geojs-43-mun.json")
    if not origem.exists():
        sys.exit(f"Não encontrei {origem}. Veja o cabeçalho deste arquivo.")
    gj = json.loads(origem.read_text(encoding="utf-8"))

    municipios, descartados = [], 0
    for f in gj["features"]:
        nome = f["properties"]["name"]
        codigo = f["properties"].get("id", "")
        partes = []
        for anel in aneis(f["geometry"]):
            pontos = [(lon, lat) for lon, lat, *_ in anel]
            simples = douglas_peucker(pontos, TOLERANCIA)
            if len(simples) < 4:
                descartados += 1
                continue
            proj = [projetar(lon, lat) for lon, lat in simples]
            d = "M" + "L".join(f"{x:.1f} {y:.1f}" for x, y in proj) + "Z"
            partes.append(d)
        if partes:
            municipios.append({"n": nome, "c": codigo, "k": chave(nome),
                               "d": "".join(partes)})

    municipios.sort(key=lambda m: m["k"])
    corpo = json.dumps(municipios, ensure_ascii=False, separators=(",", ":"))
    destino = RAIZ / "js" / "malha.js"
    destino.write_text(
        "/* Paleo-RS — js/malha.js\n"
        "   ARTEFATO GERADO por scripts/gerar-malha.py. Não edite.\n"
        "   Fonte: IBGE, malha municipal do RS, via tbrugz/geodata-br\n"
        f"   {len(municipios)} municípios · projeção equiretangular\n"
        f"   viewBox 0 0 {int(LARGURA)} {int(ALTURA)} · simplificação Douglas-Peucker {TOLERANCIA}° */\n"
        f"const MAPA_LARGURA = {int(LARGURA)}, MAPA_ALTURA = {int(ALTURA)};\n"
        f"const MAPA_CAIXA = {{ lon0: {LON0}, lon1: {LON1}, lat0: {LAT0}, lat1: {LAT1} }};\n"
        f"const DB_MUNICIPIOS = {corpo};\n"
        "if (typeof module !== 'undefined' && module.exports) "
        "{ module.exports = { MAPA_LARGURA, MAPA_ALTURA, MAPA_CAIXA, DB_MUNICIPIOS }; }\n",
        encoding="utf-8")
    kb = destino.stat().st_size / 1024
    print(f"js/malha.js — {len(municipios)} municípios, {kb:.0f} KB "
          f"({descartados} anéis muito pequenos descartados)")


if __name__ == "__main__":
    main()
