#!/usr/bin/env python3
"""
Paleo-RS — scripts/exportar-dados.py

js/dados.js  ->  data/*.json

Os arquivos em data/ são ARTEFATOS. Editar um deles à mão é trabalho
perdido: o próximo comando sobrescreve, e o validador acusa a divergência
antes disso. Edite js/dados.js.

Sem BOM. UTF-8 puro: BOM aqui faz json.load recusar o arquivo.
"""

import json
from pathlib import Path

from ler_dados import carregar, RAIZ

SAIDA = RAIZ / "data"


def escrever(nome, conteudo):
    caminho = SAIDA / nome
    caminho.write_text(
        json.dumps(conteudo, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",   # sem BOM, de propósito
    )
    print(f"  {caminho.relative_to(RAIZ)}")


def main():
    d = carregar()
    SAIDA.mkdir(exist_ok=True)
    cabecalho = {"versao": d["VERSAO_BANCO"], "data": d["DATA_VERSAO"],
                 "licenca": "CC BY 4.0",
                 "aviso": "Artefato gerado por scripts/exportar-dados.py. "
                          "Não edite: a fonte é js/dados.js."}

    print(f"Paleo-RS {d['VERSAO_BANCO']} — gerando artefatos")
    escrever("registros.json", {**cabecalho, "registros": d["registros"]})
    escrever("sitios.json", {**cabecalho, "sitios": d["sitios"]})
    escrever("periodos.json", {**cabecalho, "periodos": d["periodos"],
                               "biozonas": d["biozonas"]})
    escrever("instituicoes.json", {**cabecalho, "instituicoes": d["instituicoes"]})
    escrever("bacias.json", {**cabecalho, "bacias": d["bacias"]})
    print(f"\n{len(d['registros'])} registros exportados.")


if __name__ == "__main__":
    main()
