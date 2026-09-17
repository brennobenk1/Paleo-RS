# Changelog — Paleo-RS

Versionamento `ANO.MÊS.N`.

## 2026.09.3 — 2026-09-17

Revisão visual. A folha de estilo foi reescrita depois de olhar o site
renderizado num navegador de verdade, em vez de só no papel.

### Defeito corrigido
- **A faixa colorida de período não aparecia em nenhum cartão.** O `<button>`
  do cartão herda `align-items: center` do estilo do navegador, o que achatava
  a faixa para altura zero. Era o elemento central do design — leitura imediata
  da idade sem ler texto — e estava invisível desde a primeira versão. Nenhum
  teste de DOM pega isso; só a captura de tela pegou.
- Botões que são `<a>` apareciam sublinhados e em vermelho de link.
- Selects com o rótulo cortado ("todas as instituiçõe").

### Mudanças de design
- Fundo passou de bege esverdeado para branco quente neutro. A cor forte fica
  nas faixas de período e no cabeçalho escuro; o resto é papel.
- A logo virou elemento gráfico do herói, em 148 px, no lugar de um placar
  flutuante que deixava metade da faixa vazia.
- Placar de números em linha, sob as ações.
- Cartões: metadados em coluna única com rótulo alinhado, tombo discreto em
  monoespaçada no rodapé do cartão em vez de etiqueta vermelha saliente, e
  rodapé fixado na base para todos terminarem na mesma linha.
- Linha do tempo compactada; períodos vazios em linha mais baixa.
- "Unidades com registro" agora lista a unidade litoestratigráfica base, sem
  repetir a mesma formação com e sem membro.
- Pluralização correta: "1 registro", "3 registros", no lugar de "registro(s)".

### Ferramenta nova
- `scripts/tirar-telas.js` renderiza as seis abas em desktop e celular e salva
  as capturas. Defeito visual não aparece em teste de DOM.

## 2026.09.2 — 2026-09-17

Reestruturação em abas e primeira ampliação do catálogo.

### Estrutura
- Seis abas no padrão do Paleo-SC: Início, Catálogo, Mapa, Períodos Geológicos,
  Instituições, Sobre & Fontes. Roteamento por hash, então cada aba tem link próprio.
- **Mapa** com a malha dos 496 municípios do RS, zoom, deslocamento, municípios com
  registro destacados, painel lateral por sítio e por município. Sítios coincidentes
  distribuídos em anel com haste até o ponto real — nenhum fica coberto por vizinho.
- **Períodos** em acordeão, com barra proporcional e as zonas de assembleia do
  Triássico como subnível.
- **Instituições** com ficha e contagem de registros que citam cada uma.
- **Como citar** em ABNT, APA e BibTeX, com autoria de Brenno Alef Benk, versão do
  banco e data de acesso preenchida automaticamente.
- Bloco de viés amostral retirado da página a pedido do compilador.

### Dados — 7 para 15 registros
- Permiano estreia com a fauna da Fazenda Boqueirão, São Gabriel (Fm. Rio do Rasto):
  *Pampaphoneus biccai*, *Rastodon procurvidens* e *Konzhukovia sangabrielensis*.
- Zona de Assembleia de Riograndia ampliada: *Riograndia guaibensis* (Candelária),
  *Brasilodon quadrangularis*, *Guaibasaurus candelariensis*, *Soturnia caliodon* e
  *Clevosaurus brasiliensis* (Faxinal do Soturno).
- 8 sítios em 6 municípios; 12 instituições.
- Quatro registros entram marcados como `Citação em revisão`, com a ressalva escrita
  na ficha: existem na literatura, mas tombo, guarda ou coordenada seguem em aberto.

### Validação
- Regra 11: ponto-em-polígono do município declarado, substituindo o envelope
  retangular. Os 8 sítios passam.
- Regra de DOI deixou de cobrar DOI de registro apoiado só em revisão.

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
