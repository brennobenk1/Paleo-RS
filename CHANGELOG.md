# Changelog — Paleo-RS

Versionamento `ANO.MÊS.N`.

## 2026.09.15 — 2026-09-18

Auditoria de procedência, e a regra que faltava.

### A pergunta
"Todos são mesmo do Rio Grande do Sul?" A resposta estava espalhada em 154
fichas e na minha palavra. Agora é uma regra do validador.

### Regra 12 — Procedência
Para cada registro, confere três coisas:
1. o município existe entre os 496 da malha do IBGE;
2. a coordenada cai dentro do polígono desse município;
3. o texto de local de coleta declara o estado.

Resultado na 2026.09.15: **154 de 154 aprovados**, zero exceções.

### O que a regra NÃO pode conferir
Se a fonte mentiu ou errou a procedência, o validador não tem como saber — por
isso o campo `fontes` existe e por isso o `tipo_fonte` é obrigatório. A regra 12
pega erro de digitação, município trocado e coordenada fora do lugar; não pega
erro de campo cometido em 1936.

### Dois pontos que parecem violação e não são
- **Material gaúcho guardado fora**: o holótipo de *Staurikosaurus pricei* está em
  Harvard e o de *Prestosuchus chiniquensis* em Munique. Os dois continuam
  elegíveis — o critério é procedência, não guarda.
- **Táxons descritos fora do RS**: 79 registros são de gêneros ou espécies cujo
  material-tipo veio de outro lugar — *Menadon* de Madagascar, *Procolophon* do
  Karoo, *Konzhukovia* da Rússia, *Glyptodon* e *Toxodon* da Argentina,
  *Aetosauroides* da Argentina. Em todos, o material CATALOGADO AQUI é gaúcho, e
  o município está declarado. É o inverso do erro que a regra procura.

## 2026.09.14 — 2026-09-18

Os geossítios da Quarta Colônia, e navegação para um catálogo longo. 154 registros.

### Vinte registros, oito sítios novos, um município novo
Fonte: dossiê e fichas de geossítio do Geoparque Quarta Colônia (UNESCO), que
compila a literatura sítio a sítio. Marcados como `Divulgação ou imprensa`, com
a ressalva no topo de cada ficha.

- **São João do Polêsine** — *Polesinesuchus aurelioi* e *Hyperodapedon* no
  Buriol; *Compsocerops* no **Pivetta** (sítio novo, no limite com Restinga
  Sêca); *Prozostrodon brasiliensis* no Marchezan; aetossauros no **Piche**;
  tronco fóssil *in situ* na **Estrada de Vale Vêneto**.
- **Dona Francisca** (município novo) — *Dinodontosaurus*, *Massetognathus*,
  *Decuriasuchus quartacolonia* e *Prestosuchus chiniquensis* no
  **Fogliarini/Posto**.
- **Agudo** — *Siriusgnathus niemeyerorum* e *Agudotherium gassenae* no
  **Niemeyer**; *Siriusgnathus* e coprólitos no **Aserma**.
- **Faxinal do Soturno** — *Lanceirosphenodon ferigoloi*, *Cargninia
  enigmatica*, *Faxinalipterus minima*, *Irajatherium hernandezi* e pegadas de
  dinossauro em Linha São Luiz.

### Três ressalvas que a fonte obrigou a escrever
- ***Faxinalipterus minima*** foi descrito em 2010 como um dos pterossauros mais
  antigos do mundo. Kellner et al. (2022) reavaliaram o material: **não é
  pterossauro**. O registro fica, porque o material é real e gaúcho; o rótulo cai.
- A concentração de dezenas de *Siriusgnathus* no sítio Niemeyer está em níveis
  interpretados como depósitos residuais, com **mistura temporal** — concentração
  não é prova de vida em grupo, e a ficha diz isso.
- O sítio Aserma **não tem fósseis-guia**, então sua posição bioestratigráfica é
  incerta e a atribuição à Zona de Hyperodapedon é provisória.
- Em Linha São Luiz há níveis que, segundo Barboni & Dutra (2013), **poderiam ser
  jurássicos**. Seria o primeiro registro jurássico do banco. Por ora é hipótese,
  e o registro fica no Triássico com a ressalva escrita.

### Navegação: o catálogo passou de 13 000 px
Sem paginação, filtrar exigia rolar de volta ao topo, e voltar do fim era
impraticável. Três peças novas:
- **Fitas de período** acima dos filtros: um toque corta o catálogo para o
  intervalo, com a cor da coluna estratigráfica e a contagem ao lado. Clicar de
  novo limpa.
- **Barra de filtros grudada** logo abaixo do cabeçalho assim que sai da vista.
  Em tela estreita ela volta a ser estática, para não comer altura útil.
- **Botão de voltar ao topo**, que aparece depois de uma tela de rolagem.

### Um teste que estava medindo a coisa errada
A asserção de filtro contava os cartões no DOM logo após o clique — e passava a
falhar acima de 60 registros, porque a renderização entra em fatias por quadro de
animação e só a primeira fatia existe nesse instante. O teste agora lê a
contagem, que é síncrona. Não era bug do site: era o teste medindo tarde demais.

## 2026.09.13 — 2026-09-18

Geossítio Janner e Sítio Wachholz. 134 registros, e os oito tipos de fonte em uso.

### Uma fauna carniana inteira num afloramento só
O Geossítio Janner, em Agudo, reúne no mesmo nível: dois dinossauros
(***Pampadromaeus barberenai*** e ***Bagualosaurus agudoensis***), um
ornitossuquídeo (***Dynamosuchus collisensis***), um cinodonte carnívoro de
grande porte (***Trucidocynodon riograndensis***) e o rincossauro
***Hyperodapedon*** sp. Predadores e presas, arcossauros e a linhagem dos
mamíferos, todos convivendo.

### Macrocollum itaquii, Sítio Wachholz
O **sauropodomorfo mais antigo com pescoço alongado** — o plano corporal que
define todo o grupo depois do Carniano aparece aqui pela primeira vez. Em 2023 a
espécie foi encontrada num segundo sítio, o "Boi da Guampa Torta", permitindo
correlacionar os dois afloramentos: como *Macrocollum* é mais derivado que
*Pampadromaeus* e *Bagualosaurus*, ambos os sítios são mais jovens que o de
Várzea do Agudo. Filogenia usada como ferramenta bioestratigráfica. O segundo
sítio NÃO entrou no banco porque a fonte não informa o município.

### Oitavo e último tipo de fonte
`Divulgação ou imprensa` estreia com quatro registros, apoiados na ficha de
geossítio do Geoparque Quarta Colônia (UNESCO). São táxons consistentes com a
literatura, mas cuja localidade foi confirmada em material de divulgação
institucional, não em publicação revisada por pares — e a ficha diz isso em
maiúsculas, no topo das observações. Os oito tipos de fonte previstos no modelo
agora têm uso real:

| tipo | registros |
|---|---|
| Artigo em periódico | 74 |
| Citação em revisão | 40 |
| Tese ou dissertação | 9 |
| Capítulo de sítio (SIGEP) | 4 |
| Divulgação ou imprensa | 4 |
| Anais ou resumo de evento | 3 |

Essa tabela é o ponto do campo `tipo_fonte`: quem consulta o banco vê de
imediato que 55% dos registros se apoiam em artigo revisado por pares e que 3%
se apoiam em divulgação — e pode decidir em quais confiar sem abrir 134 fichas.

## 2026.09.12 — 2026-09-18

Catálogo sem paginação, e as florestas petrificadas. 128 registros.

### O botão "mostrar mais" saiu
O catálogo agora renderiza inteiro, sozinho. A renderização continua fatiada —
60 cartões por quadro de animação, para não travar a interface com centenas de
elementos de uma vez — mas a fatia é invisível: o navegador respira entre elas e
o catálogo completa sozinho. Um pedido pendente é cancelado se o filtro mudar no
meio, senão cartões do filtro antigo entrariam depois do novo.

### Sítios Paleobotânicos do Arenito Mata (SIGEP 009)
- Lenhos silicificados de **Coniferophyta** no Jardim Paleobotânico de **Mata**
  (município novo) e no Afloramento Piscina, em São Pedro do Sul: troncos de
  30 cm a 2 m de diâmetro e mais de 20 m de comprimento, chegando a 30 m. Uma
  das mais importantes florestas petrificadas do planeta.
- ***Rhexoxylon brasiliensis***, o marcador bioestratigráfico mais importante da
  lignitafoflora gaúcha: gênero exclusivamente gondwânico, restrito ao
  Anisiano–Noriano.
- **Flora Dicroidium**, a vegetação que sucede a Glossopteris depois da extinção
  do Permo-Triássico e antecede as coníferas do Arenito Mata.

### Três museus municipais entram no banco
Museu Guido Borgomanero (Mata), Museu Paleontológico e Arqueológico Professor
Walter Ilha (São Pedro do Sul) e Museu de Ciências Naturais Vicente Pallotti
(Santa Maria). Os dois primeiros foram criados pelas próprias comunidades nos
anos 1980, com recursos locais, para proteger o que estava sendo levado.

### Sétimo tipo de fonte em uso
`Capítulo de sítio (SIGEP)` estreia com quatro registros. Falta apenas
`Divulgação ou imprensa`.

### O que a fonte diz e a ficha repete
As reservas superficiais de lenho silicificado estão **quase exauridas** pela
exploração para objetos de decoração, apesar da proteção constitucional. Não é
uma nota de rodapé: é o estado de conservação do sítio, e faz parte do registro.

## 2026.09.11 — 2026-09-18

As paleotocas. De 119 para 124 registros, e a região metropolitana entra no mapa.

### Megaichnus na Região Metropolitana de Porto Alegre
Fonte: Frank, Buchmann, Lima, Caron, Lopes & Fornari (2023), *Pesquisas em
Geociências* 50(1):e127863, DOI 10.22456/1807-9806.127863, acesso aberto.

- ***Megaichnus major***, atribuída a preguiças-terrícolas, e ***M. minor***,
  atribuída a tatus gigantes, em Porto Alegre.
- ***Megaichnus* isp.** em Novo Hamburgo, Guaíba e Tapes.
- Mais de 400 túneis mapeados em mais de 10 mil km² ao longo de uma década: a
  **maior densidade conhecida desse icnofóssil no mundo**. Larguras de 0,5 a
  3,0 m; mais de 80% preenchidos por sedimento, portanto crotovinas.
- Traços de escavação nas paredes e no teto são comuns, mas **nenhum fóssil
  corporal** foi achado dentro deles: o produtor é inferido pelo tamanho e pelas
  marcas de garra, nunca observado. A ficha diz isso.
- A maioria dos registros aparece em escavações de obra civil, não em prospecção
  paleontológica — a conta cresce com a duplicação de rodovia.

### Modelo de dados
- Campos de tombo e guarda passam a aceitar "Não se aplica": paleotoca é
  estrutura *in situ*, não se coleta nem se tomba.
- Bacia nova, que não é bacia: "Escudo Sul-rio-grandense e depósitos cenozoicos
  associados". Paleotoca não é unidade estratigráfica — é um túnel cavado em
  rochas de idades muito diversas, e o fóssil é a estrutura, não a rocha.

### Erro de modelagem que o validador pegou
Eu havia criado um sítio único para o trecho da BR-116 "entre Guaíba e Tapes".
O validador reprovou: um sítio não pode estar em dois municípios, e o
ponto-em-polígono mostrou o ponto caindo fora de Guaíba. Separado em dois
sítios, um por município.

### Sexto tipo de fonte em uso
`Anais ou resumo de evento` estreia com três registros. Faltam apenas
`Capítulo de sítio (SIGEP)` e `Divulgação ou imprensa`.

### Buscas sem resultado, registradas
- **Mesossauros da Fm. Irati**: a unidade aflora no RS, mas todo o material
  descrito que encontrei é do Paraná, São Paulo e Goiás. Sem localidade gaúcha
  documentada, não entra.
- **Jurássico e Cretáceo**: seguem vazios. A icnofauna da Fm. Botucatu está
  concentrada no interior paulista.
- **Devoniano, Carbonífero, Paleógeno e Neógeno**: sem registro publicado
  localizado no estado entre as fontes consultadas.

## 2026.09.10 — 2026-09-18

O Paleorrota reforçado. De 112 para 119 registros.

### Sete registros do Triássico Médio e Superior
- ***Aetosauroides scagliai*** (UFSM 11505), do afloramento Faixa Nova–Cerrito I,
  em Santa Maria: um dos esqueletos de aetossauro mais completos do Brasil,
  crânio, hemimandíbulas e boa parte do pós-crânio. Pseudossúquio herbívoro
  encouraçado — parente distante do crocodilo com aparência de tatu gigante.
- ***Botucaraitherium belarminoi*** (MMACR-PV003-T), do Sítio Botucaraí, em
  Candelária. O holótipo está num **museu municipal**, o Aristides Carlos
  Rodrigues — o tipo de acervo que costuma escapar dos catálogos estaduais.
  Instituição acrescentada ao banco.
- ***Jachaleria candelariensis***, o último dicinodonte do Triássico gaúcho:
  o grupo, dominante no Triássico Médio, chega ao Noriano reduzido a esta
  espécie, já convivendo com os primeiros dinossauros.
- ***Exaeretodon riograndensis***, do sítio Várzea do Agudo (**Agudo**,
  município novo no banco).
- ***Hyperodapedon* sp.** e ***Teyumbaita sulcognathus***, dos afloramentos de
  **Vale do Sol** (município novo).
- ***Brasilitherium riograndensis***, de Linha São Luiz.

### Duas disputas registradas na ficha
- A Zona de Assembleia de Hyperodapedon pode ser **duas subzonas**: uma inferior
  com acme de *Hyperodapedon* e outra superior dominada por *Exaeretodon
  riograndensis*. A revisão de 2024, com seções medidas em três afloramentos de
  Vale do Sol, sustenta a divisão — e registra *Teyumbaita* pela primeira vez
  abaixo do nível de *Hyperodapedon*, mostrando coocorrência em vez de sucessão.
- ***Brasilitherium riograndensis*** pode ser sinônimo júnior de *Brasilodon
  quadrangularis*. Mantido como registro separado porque a literatura consultada
  ainda o trata como táxon próprio, com a disputa escrita na ficha.

### O Triássico empatou com o Permiano
33 a 33, contra 53 do Quaternário. As cinco zonas de assembleia agora têm
conteúdo: Sanga do Cabral 7, Dinodontosaurus 3, Santacruzodon 4, Hyperodapedon 9,
Riograndia 10.

### Botucatu: procurado, não catalogado
Fui atrás das pegadas de dinossauro da Fm. Botucatu para abrir o Jurássico. A
icnofauna publicada — *Brasilichnium*, *Aracoaraichnium*, *Farlowichnus* — está
concentrada em Araraquara e no interior paulista. Nenhuma fonte consultada
documenta afloramento gaúcho com material descrito. O Jurássico segue vazio,
como deve.

## 2026.09.9 — 2026-09-18

O Triássico Inferior entra no banco. De 105 para 112 registros.

### Sítio Bica São Tomé, São Francisco de Assis
A quinta e última zona de assembleia do Triássico gaúcho sai do zero. O Bica
São Tomé é o afloramento mais produtivo da Fm. Sanga do Cabral — mais de
duzentos espécimes recuperados, e a única localidade da unidade com material
razoavelmente completo e articulado; em todas as outras o registro é
fragmentário e retrabalhado.

- ***Teyujagua paradoxa*** (UNIPAMPA 653) — forma de transição entre répteis
  primitivos e Archosauriformes, o clado de dinossauros, crocodilianos, aves e
  pterossauros. Viveu logo depois da extinção que eliminou ~90% das espécies.
  O nome vem de Teyú Yaguá, lenda guarani do lagarto com cabeça de cão.
- ***Elessaurus gondwanoccidens*** (UFSM 11471) — grupo-irmão dos
  tanistrofeídeos, os répteis de pescoço desproporcional. É continental e
  gondwânico, ao contrário dos tanistrofeídeos marinhos do Hemisfério Norte.
- ***Procolophon trigoniceps***, ***Oryporan insolitus*** e um terceiro
  morfótipo de procolofonoide ainda sem nome (UNIPAMPA 916, *Historical
  Biology* 2025).
- **cf. *Proterosuchus*** e **cf. *Chasmatosuchus*** — primeiros registros
  conclusivos de proterossuquídeos para o Triássico Inferior do Brasil.

### Coordenada
Publicada na descrição de *Teyujagua* (29°36'56"S, 55°03'10"W) e conferida por
ponto-em-polígono: cai em São Francisco de Assis, município novo no banco.

### Nota de método
A revisão do sítio afirma que quatro dos seis táxons nominais da Fm. Sanga do
Cabral vêm do Bica São Tomé, mas não diz quais. *Sangaia lavinai*,
*Tomeia witecki* e *Kwatisuchus rosai* ficaram de fora por isso: atribuir uma
localidade que a fonte não sustenta seria inventar. Entram quando houver fonte
que nomeie o afloramento de cada um.

## 2026.09.8 — 2026-09-18

Os sítios permianos de Aceguá e São Gabriel. De 89 para 105 registros.

### Fonte
Cisneros, Dentzien-Dias & Francischini (2021), *Frontiers in Ecology and
Evolution* 9:758802, DOI 10.3389/fevo.2021.758802, acesso aberto CC BY. Além
de redescrever o pareiassauro, o artigo publica o inventário completo dos
sítios da Fm. Rio do Rasto no estado — nove localidades em dois municípios.

### Aceguá estreia no banco
- ***Provelosaurus americanus***, o **único pareiassauro conhecido das
  Américas**, em três sítios: a localidade-tipo na BR-153 km 665,4 (holótipo
  UFRGS-PV-0231-P e mais três exemplares), o corte do km 666 e a Fazenda Santo
  Antônio. Quatro indivíduos de idades diferentes numa área de menos de 100 m²
  sugerem algum grau de comportamento social.
- ***Bageherpeton longignathus*** e ***Xenacanthus santosi*** na Fazenda
  Coxilha Grande; peixes ósseos, coprólitos espiralados, lenho petrificado e
  *Glossopteris communis* nos demais afloramentos; a toca de estivação de peixe
  pulmonado do km 659,5, com datação U-Pb de 270,61 Ma.

### São Gabriel ganha três sítios novos
*Tiarajudens eccentricus* — o anomodonte herbívoro com caninos de sabre — e
*Triodus richterae* na Fazenda Capão Alto; o crânio juvenil MCP 4263-PV de
*Provelosaurus* e os dinocéfalos do Posto Queimado; a assembleia de coprólitos
da "Coprolândia".

### Ressalvas que a fonte obrigou a registrar
- **A posição estratigráfica de *Bageherpeton* está em disputa.** Descrito como
  Fm. Rio do Rasto, mas o sítio hoje expõe a Fm. Teresina no mapeamento da CPRM,
  e o contexto preciso nunca foi publicado. A ficha diz isso e o campo de
  formação carrega a ressalva.
- **"Posto Queimado" é um topônimo não confiável**: autores diferentes o usaram
  para afloramentos distintos em São Gabriel, às vezes em distritos diferentes.
  A ficha fixa a que propriedade o nome se refere aqui.

### Ferramenta nova: sincronizar-sitios.py
A cada lote era preciso acrescentar sítios à mão e recontar os `count`. O
validador sempre pegava o erro, mas depois do trabalho feito. Agora
`scripts/sincronizar-sitios.py` reconstrói `DB_SITIOS` a partir de
`DB_REGISTROS`: nome, município e coordenada vêm do registro, o `count` é
contado, e coordenada publicada nunca é rebaixada por estimativa de outro
registro do mesmo sítio.

### Correção no validador
A regra 2 comparava a formação inteira contra a tabela formação→bacia, então
"Fm. Rio do Rasto (posição estratigráfica contestada)" não era reconhecida.
Agora a base é extraída cortando barra e parêntese.

## 2026.09.7 — 2026-09-18

A Flora Glossopteris entra no banco. De 75 para 89 registros.

### Permiano — de 3 para 17 registros
Até aqui o Permiano eram só três terápsidas de São Gabriel. Agora tem a flora,
que é o que a Bacia do Paraná tem de mais abundante no estado.

- **Afloramento Quitéria (SIGEP 008), Encruzilhada do Sul** — Fm. Rio Bonito.
  *Glossopteris browniana*, *Botrychiopsis plantiana*, *Brasilodendron* sp. e
  *Giridia quiteriensis*, mais a associação macroflorística da Zona
  Glossopteris/Rhodeopteridium e a palinoflora de 69 táxons.
- **Mina do Faxinal, Arroio dos Ratos** — Fm. Rio Bonito. Palinoflora de 45
  táxons e um registro de **herbivoria em folhas de glossopterídea**: impressões
  foliares com bordos corroídos num tonstein entre camadas de carvão. Evidência
  direta de insetos comendo plantas há ~280 milhões de anos — comportamento, não
  corpo.
- **Paleovale Mariana Pimentel** — Fm. Itararé, fácies Mariana Pimentel.
  *Glossopteris*, *Gangamopteris* (três espécies), *Paracalamites*,
  *Noeggerathiopsis*, *Samaropsis* e *Buriadia*.

### Uma armadilha administrativa registrada
O trabalho original sobre Mariana Pimentel situa o afloramento **no município de
Guaíba**: a vila era distrito de Guaíba e só foi emancipada em 1996. O registro
fica no município atual, com a mudança anotada na ficha. Sem isso, o mesmo
afloramento pareceria estar em dois lugares conforme a data do artigo consultado.

### Novos tipos de registro no banco
- Primeiros **vegetais** (10), **palinomorfos** (2) e **associações
  paleoflorísticas** (1) — até aqui o catálogo era 100% vertebrado.
- Primeiro uso de `Tese ou dissertação` como tipo de fonte (7 registros).
- Quatro registros são de associação, não de táxon, e dizem isso na ficha.

## 2026.09.6 — 2026-09-18

A Fauna Local do Arroio Chuí. De 46 para 75 registros.

### Arroio Chuí, Santa Vitória do Palmar
- 29 registros do extremo sul do estado, da Alofm. Santa Vitória / Sistema
  Laguna-Barreira III, com idades por ressonância de spin eletrônico entre
  ~226 mil e ~34 mil anos AP.
- Fonte: Pereira, Lopes & Kerber (2012), *Revista Brasileira de Paleontologia*
  15(2):228-239, DOI 10.4072/rbp.2012.2.10 — acesso aberto, com apêndice
  trazendo a lista atualizada completa dos mamíferos do arroio.
- Nove registros vêm com material descrito e tombo no próprio artigo; os outros
  vinte entram como `Citação em revisão`, com o autor original nomeado na ficha
  e o tombo em aberto. A ficha diz qual é qual.
- Destaques: *Eremotherium* cf. *E. laurillardi* (EPM-PV 0133) é o **registro
  mais austral da espécie em todas as Américas**; *Catagonus* sp. tem crânio e
  mandíbula completos e articulados; *Lagostomus* cf. *L. maximus* é o primeiro
  registro confiável do gênero no Brasil; e *Doedicurus* só ocorre, no Brasil,
  no Rio Grande do Sul.
- Coordenada aproximada: a fonte delimita o trecho fossilífero por dois extremos
  em UTM, a cerca de 19 km um do outro. O ponto médio foi adotado e conferido por
  ponto-em-polígono. O extremo oeste publicado cai fora do polígono municipal,
  provavelmente dentro da Lagoa Mirim — anotado na ficha.

### Instituições
- **MCTFM**, Museu Coronel Tancredo Fernandes de Mello, Santa Vitória do Palmar —
  museu municipal que guarda o principal acervo do arroio Chuí, incluindo a
  Coleção Emidio Pinto Martino.
- **FURG**, Laboratório de Geologia e Paleontologia, Rio Grande — série LGP,
  megafauna costeira e material dragado da plataforma.

### Ressalvas registradas nas fichas
- *Glyptodon clavipes*: Oliveira et al. (2010) reatribuíram material brasileiro
  da espécie a *Glyptotherium*. A atribuição precisa ser conferida.
- *Stegomastodon waringi*: boa parte do material sul-americano hoje vai para
  *Notiomastodon platensis*.
- O intervalo de ~192 mil anos coberto pelas datações é longo demais para uma
  única fauna: a assembleia pode ser tempo-médio, e não uma comunidade real.

## 2026.09.5 — 2026-09-17

O Quaternário entra no banco. De 22 para 46 registros.

### Formação Touro Passo, Uruguaiana
- 24 registros da megafauna do arroio Touro Passo, a associação pleistocênica
  mais bem estudada do sul do Brasil, com idades entre ~42 mil e ~10 mil anos AP.
- Fonte: Kerber, Pitana, Ribeiro, Hsiou & Oliveira (2014), *Revista Mexicana de
  Ciencias Geológicas* 31(2):248-259 — revisão em acesso aberto que lista número
  de tombo por táxon e publica as coordenadas UTM das localidades. É o tipo de
  fonte que rende dezenas de registros de uma vez.
- Preguiças-terrícolas (*Glossotherium robustum*), gliptodontes (*Glyptodon*,
  *Panochthus*), tatus gigantes (*Pampatherium typum*, *Holmesina paulacoutoi*,
  *Propraopus sulcatus*), caititus (*Catagonus stenocephalus*, *Tayassu pecari*),
  camelídeos (*Hemiauchenia paradoxa*), cervídeos (*Antifer*, *Morenelaphus*),
  cavalos (*Equus neogaeus*, *Hippidion*), anta, *Toxodon*,
  *Macrauchenia patachonica*, capivara, *Galea*, ratão-do-banhado, o lagarto
  *Tupinambis uruguaianensis* (holótipo gaúcho), cágado, uma cegonha e um coprólito.
- Coordenadas UTM convertidas da zona 21J e conferidas por ponto-em-polígono:
  as cinco localidades caem dentro de Uruguaiana.
- Uma delas, Ponte Velha II, tem a coordenada impressa com um dígito a menos no
  apêndice do artigo; corrigida por interpolação com as vizinhas e marcada.

### Achados do validador e da leitura
- O tombo **MCPU-PV 059** aparece na fonte tanto para *Panochthus* sp. quanto para
  *Morenelaphus* sp. Um dos dois está errado no artigo. As duas fichas registram
  a contradição em vez de escolher uma às cegas.
- A coleção MCPU-PV, do campus Uruguaiana da PUCRS, foi transferida para o campus
  central em Porto Alegre. Anotado no campo de guarda de todos os registros afetados.
- Três registros entram sem determinação taxonômica (Mylodontidae indet.,
  *Glyptodon* sp. no nível de gênero, coprólito sem produtor identificado),
  marcados como tal na ficha.
- O status de *Tupinambis uruguaianensis* está em aberto na literatura —
  Scanferla et al. (2009) e Brizuela (2010) questionam a validade. A ficha diz isso.

### Bacia nova
- "Depósitos fluviais quaternários da bacia do rio Uruguai" — cascalhos, siltes e
  areias assentados sobre os basaltos da Fm. Serra Geral, no oeste do estado.

## 2026.09.4 — 2026-09-17

Cliques do mapa, duas faunas novas no catálogo e polimento visual.

### Mapa — o clique era mudo
- **Clicar num sítio ou município não fazia nada.** O arraste chamava
  `setPointerCapture` já no `pointerdown`, então o evento de clique nascia com o
  SVG inteiro como alvo e nenhum sítio era selecionado. Agora o ponteiro só é
  capturado depois que o cursor anda mais de 4 px — abaixo disso é clique.
- Dica que segue o ponteiro, dizendo no próprio ponto o que está sob o cursor:
  nome do sítio, município, quantos registros e a precisão da coordenada. Para
  município, quantos registros em quantos sítios.
- A dica acompanha o foco do teclado, senão a camada ficaria muda para quem
  navega com Tab.
- O município do sítio selecionado ganha contorno vermelho; em tela estreita o
  painel lateral rola até a vista, porque fica abaixo do mapa.

### Dados — 15 para 22 registros
- **Zona de Assembleia de Santacruzodon** estreia com a fauna do afloramento
  Schoenstatt, em Santa Cruz do Sul: *Santacruzodon hopsoni*,
  *Dagasuchus santacruzensis*, *Menadon besairiei* e *Santacruzgnathus abdalai*.
- **Zona de Assembleia de Dinodontosaurus** estreia com Chiniquá, em São Pedro
  do Sul: *Prestosuchus chiniquensis* (lectótipo de Huene, em Munique, e os
  juvenis do Tree Sanga) e *Stahleckeria potens*.
- 11 sítios em 8 municípios; 14 instituições.
- O afloramento Tree Sanga tem coordenada publicada, e a fonte o situa "entre
  São Pedro do Sul, Mata e São Vicente do Sul". O teste de ponto-em-polígono
  contra a malha do IBGE resolveu a ambiguidade: o ponto cai em São Pedro do Sul.

### Visual
- Filete tricolor sob o cabeçalho, o anel partido da logo esticado em linha.
  É a única citação literal da bandeira; o resto da interface usa as três cores
  separadas, com função definida, para não virar bandeirola.
- Vinheta radial no herói, ecoando o fundo do medalhão.
- Selos de tipo de fonte arredondados; cartões com elevação leve no hover.

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
