# Changelog — Paleo-RS

Versionamento `ANO.MÊS.N`.

## 2026.09.1 — 2026-09-16

Primeira versão. Esqueleto completo e semente de dados.

### Dados
- 7 registros, todos do Triássico Superior da Supersequência Santa Maria,
  cada um conferido na publicação original ou em redescrição de acesso aberto:
  *Staurikosaurus pricei*, *Saturnalia tupiniquim*, *Buriolestes schultzi*,
  *Ixalerpeton polesinensis*, *Gnathovorax cabreirai* e dois espécimes de
  *Unaysaurus tolentinoi*.
- 5 sítios em 3 municípios: Santa Maria, São João do Polêsine, São Martinho da Serra.
- Coluna estratigráfica completa do estado, do Devoniano ao Quaternário,
  com os períodos ainda vazios visíveis em vez de omitidos.
- 5 zonas de assembleia do Triássico como eixo cronoestratigráfico fino.

### Modelo de dados
- Campo `coord_precisao` acrescentado ao modelo (`publicada` / `aproximada` /
  `regional`). Sem ele, uma sede municipal e um afloramento medido por GPS
  ficam indistinguíveis no mapa.
- Campo `periodo_chave` e `biozona_chave` em vez de casar strings de período.

### Arquitetura
- Fluxo `js/dados.js` → `scripts/exportar-dados.py` → `data/*.json` e
  `scripts/exportar-planilha.py` → `planilha.xlsx`, na direção correta desde
  o primeiro commit.
- `scripts/validar.py` com as nove regras do escopo mais contraste WCAG.
- GitHub Action barra commit com artefato desatualizado.

### Achados do validador nesta versão
- Siglas de instituição divergentes entre `unidade_pesquisa` e
  `DB_INSTITUICOES` em 6 dos 7 registros. Corrigido na fonte.

### Pendente
- Malha dos 497 municípios e o mapa (Fase 2).
- Permiano, Quaternário e plataforma continental: sem registros ainda.
