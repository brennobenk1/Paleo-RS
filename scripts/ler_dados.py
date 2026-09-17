"""
Paleo-RS — scripts/ler_dados.py

Lê js/dados.js, a fonte única, e devolve as estruturas em Python.
Usa o próprio Node para avaliar o arquivo: assim não existe um segundo
parser capaz de discordar do navegador sobre o que o arquivo contém.
"""

import json
import subprocess
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
DADOS_JS = RAIZ / "js" / "dados.js"

_PONTE = """
const d = require({caminho});
process.stdout.write(JSON.stringify({{
  VERSAO_BANCO: d.VERSAO_BANCO,
  DATA_VERSAO: d.DATA_VERSAO,
  periodos: d.DB_PERIODOS,
  biozonas: d.DB_BIOZONAS,
  registros: d.DB_REGISTROS,
  sitios: d.DB_SITIOS,
  instituicoes: d.DB_INSTITUICOES,
  bacias: d.DB_BACIAS
}}));
"""


def carregar():
    if not DADOS_JS.exists():
        sys.exit(f"Não encontrei {DADOS_JS}")
    script = _PONTE.format(caminho=json.dumps(str(DADOS_JS)))
    try:
        saida = subprocess.run(
            ["node", "-e", script],
            capture_output=True, text=True, check=True,
        ).stdout
    except FileNotFoundError:
        sys.exit("Node não encontrado. Instale Node.js para rodar os scripts.")
    except subprocess.CalledProcessError as erro:
        sys.exit(f"js/dados.js não avaliou:\n{erro.stderr}")
    return json.loads(saida)


if __name__ == "__main__":
    dados = carregar()
    print(f"{len(dados['registros'])} registros, {len(dados['sitios'])} sítios, "
          f"versão {dados['VERSAO_BANCO']}")
