[# Paleo-RS — Banco de Dados Paleontológico do Rio Grande do Sul](https://brennobenk1.github.io/Paleo-RS/)

Catálogo aberto de ocorrências fossilíferas **coletadas no Rio Grande do Sul**.
Aplicação estática: HTML5, CSS3 e JavaScript ES6+, sem framework, sem build,
sem servidor. Abre direto do disco ou no GitHub Pages.

## Arquivos

```
index.html            página do catálogo
css/estilo.css        tokens e estilo; paleta amostrada da logo
js/dados.js           FONTE ÚNICA DE DADOS — o único arquivo editável à mão
js/app.js             só código: filtros, ficha, permalink, exportações
imgs/logo-vet.svg     marca; origem das cores da interface
scripts/ler_dados.py  ponte que lê dados.js via Node
scripts/validar.py    10 regras de validação
scripts/exportar-dados.py     → data/*.json
scripts/exportar-planilha.py  → planilha.xlsx
scripts/gerar-previa.py       → previa.html (arquivo único, sem servidor)
data/*.json           ARTEFATO GERADO
planilha.xlsx         ARTEFATO GERADO
previa.html           ARTEFATO GERADO
```

## Escopo

O critério é **procedência, não guarda**. Um fóssil coletado em Candelária e
depositado em Harvard entra. Um fóssil uruguaio guardado em Porto Alegre, não.

Só entram registros com publicação rastreável. Notícia de jornal pode entrar,
obrigatoriamente marcada como `Divulgação ou imprensa` no campo `tipo_fonte`.

Dado que não existe na fonte fica escrito "Não informado na fonte consultada".
Um registro honesto e incompleto vale mais que um completo e inventado.

## Fonte única de dados

```
js/dados.js  →  scripts/exportar-dados.py     →  data/*.json
             →  scripts/exportar-planilha.py  →  planilha.xlsx
```

`js/dados.js` é o **único** arquivo de dados editável. `data/*.json` e
`planilha.xlsx` são artefatos gerados. Editá-los à mão é trabalho perdido: a
próxima exportação sobrescreve e o validador acusa a divergência antes disso.

## Rodando

```bash
pip install openpyxl

python3 scripts/validar.py            # sai com 1 se houver erro
python3 scripts/exportar-dados.py     # regenera data/*.json
python3 scripts/exportar-planilha.py  # regenera planilha.xlsx
```

Rode os três a cada alteração de `js/dados.js`. O GitHub Action roda os três a
cada push e barra commit com artefato desatualizado.

## O que o validador confere

| # | Regra |
|---|---|
| 1 | Coordenada dentro do RS e `coord_precisao` declarada |
| 2 | Coerência entre `formacao` e `bacia` |
| 3 | Soma dos `count` dos sítios igual ao total de registros |
| 4 | `total_registros` de cada período e biozona igual à contagem real |
| 5 | `id` único; táxon + tombo não repetidos no mesmo sítio |
| 6 | Campos obrigatórios preenchidos; DOI com forma de DOI |
| 7 | Todo período usado existe e tem cor; ordem crescente da base ao topo |
| 8 | Todo registro tem `tipo_fonte` da lista fechada |
| 9 | `data/*.json` em dia com `dados.js`, e sem BOM |
| 10 | Tokens de texto do CSS com contraste ≥ 4,5:1 (WCAG AA) |

## Licenças

Dados sob [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.pt-br),
código sob MIT. Material de terceiros fora do escopo.

**Citar este banco não substitui citar a fonte primária de cada registro.** O
banco é um índice para a literatura, não um substituto dela.
