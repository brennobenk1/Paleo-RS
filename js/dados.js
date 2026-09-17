/* =====================================================================
   Paleo-RS — Banco de Dados Paleontológico do Rio Grande do Sul
   js/dados.js — FONTE ÚNICA DE DADOS

   Este é o único arquivo de dados editável à mão.
   data/*.json e planilha.xlsx são ARTEFATOS GERADOS por
   scripts/exportar-dados.py e scripts/exportar-planilha.py.
   Nunca edite os artefatos: eles serão sobrescritos e o validador
   acusa divergência.

   Escopo: apenas material COLETADO no Rio Grande do Sul.
   Critério de procedência, não de guarda.

   Licença dos dados: CC BY 4.0
   ===================================================================== */

const VERSAO_BANCO = "2026.09.3";
const DATA_VERSAO = "2026-09-17";

/* ---------------------------------------------------------------------
   COLUNA CRONOESTRATIGRÁFICA DO RS
   Cores seguem a Tabela Cronoestratigráfica Internacional (ICS/IUGS),
   não a paleta da interface: a cor de um período é dado, não decoração,
   e um geólogo reconhece o roxo do Triássico à primeira vista.
   periodo_ordem: 1 = mais antigo (base), n = mais recente (topo).
   --------------------------------------------------------------------- */
const DB_PERIODOS = [
  { chave: "devoniano",   nome: "Devoniano",               ordem: 1, inicio_ma: 419.2, fim_ma: 358.9, cor: "#CB8C37", total_registros: 0 },
  { chave: "carbonifero", nome: "Carbonífero",             ordem: 2, inicio_ma: 358.9, fim_ma: 298.9, cor: "#67A599", total_registros: 0 },
  { chave: "permiano",    nome: "Permiano",                ordem: 3, inicio_ma: 298.9, fim_ma: 251.9, cor: "#F04028", total_registros: 3 },
  { chave: "triassico",   nome: "Triássico",               ordem: 4, inicio_ma: 251.9, fim_ma: 201.4, cor: "#812B92", total_registros: 12 },
  { chave: "jurassico",   nome: "Jurássico",               ordem: 5, inicio_ma: 201.4, fim_ma: 145.0, cor: "#34B2C9", total_registros: 0 },
  { chave: "cretaceo",    nome: "Cretáceo",                ordem: 6, inicio_ma: 145.0, fim_ma:  66.0, cor: "#7FC64E", total_registros: 0 },
  { chave: "paleogeno",   nome: "Paleógeno",               ordem: 7, inicio_ma:  66.0, fim_ma:  23.0, cor: "#FD9A52", total_registros: 0 },
  { chave: "neogeno",     nome: "Neógeno",                 ordem: 8, inicio_ma:  23.0, fim_ma:   2.58, cor: "#FFE619", total_registros: 0 },
  { chave: "quaternario", nome: "Quaternário",             ordem: 9, inicio_ma:   2.58, fim_ma:  0.0,  cor: "#F9F97F", total_registros: 0 }
];

/* ---------------------------------------------------------------------
   ZONAS DE ASSEMBLEIA DO TRIÁSSICO (biozonas de tetrápodes)
   Eixo cronoestratigráfico fino do Geoparque Paleorrota. Subdividem o
   período "triassico" na linha do tempo.
   --------------------------------------------------------------------- */
const DB_BIOZONAS = [
  { chave: "az_sanga_cabral",  nome: "Fauna da Fm. Sanga do Cabral", ordem: 1, idade: "Triássico Inferior (Induano–Olenekiano)", total_registros: 0 },
  { chave: "az_dinodontosaurus", nome: "Zona de Assembleia de Dinodontosaurus", ordem: 2, idade: "Triássico Médio (Ladiniano)", total_registros: 0 },
  { chave: "az_santacruzodon",  nome: "Zona de Assembleia de Santacruzodon", ordem: 3, idade: "Triássico Médio–Superior (Ladiniano–Carniano)", total_registros: 0 },
  { chave: "az_hyperodapedon",  nome: "Zona de Assembleia de Hyperodapedon", ordem: 4, idade: "Triássico Superior (Carniano)", total_registros: 5 },
  { chave: "az_riograndia",     nome: "Zona de Assembleia de Riograndia", ordem: 5, idade: "Triássico Superior (Noriano)", total_registros: 7 }
];

/* ---------------------------------------------------------------------
   OCORRÊNCIAS
   Campo coord_precisao — acrescentado ao modelo do §4. Valores:
     "publicada"  — coordenada informada pela própria fonte
     "aproximada" — localidade identificada, coordenada estimada
     "regional"   — só o município é conhecido; usa a sede municipal
   Sem isso, uma sede municipal e um afloramento medido por GPS ficam
   indistinguíveis no mapa, o que é uma afirmação falsa de precisão.
   --------------------------------------------------------------------- */
const DB_REGISTROS = [
  {
    id: 1,
    taxon: "Staurikosaurus pricei Colbert, 1970",
    categoria: "Vertebrado — dinossauro (Saurischia, Herrerasauridae)",
    periodo: "Triássico Superior (Carniano)",
    periodo_chave: "triassico",
    biozona_chave: "az_hyperodapedon",
    era: "Mesozóico — Triássico",
    periodo_ordem: 4,
    idade_ma: "ca. 233 Ma",
    formacao: "Fm. Santa Maria / Sequência Candelária (Membro Alemoa)",
    bacia: "Bacia do Paraná — Supersequência Santa Maria",
    municipio: "Santa Maria",
    local_coleta: "Sanga Grande (ou Sanga de Baixo), complexo da Alemoa, periferia leste de Santa Maria, RS",
    site: "Sanga Grande / Sanga de Baixo (Alemoa)",
    lat: -29.6836, lon: -53.7690,
    coord_precisao: "aproximada",
    numero_catalogo: "MCZ 1669 (holótipo)",
    armazenamento: "Museum of Comparative Zoology, Harvard University, Cambridge (EUA)",
    unidade_pesquisa: "MCZ; AMNH",
    descritor: "Colbert, E.H. (1970) — American Museum Novitates 2405:1-39",
    tipo_fonte: "Artigo em periódico",
    doi: "",
    observacoes: "Primeiro dinossauro descrito para o Brasil e um dos mais antigos do mundo. Coletado por Llewellyn Ivor Price em 1936; depositado no MCZ (Harvard) — permanece elegível porque o critério do banco é procedência, não guarda. Colbert (1970) situa o holótipo na Sanga Grande/Sanga de Baixo, afloramento distinto do Cerro da Alemoa (Waldsanga), de onde vem Saturnalia; os dois são frequentemente confundidos sob o rótulo genérico 'Sanga da Alemoa'. Coordenada aproximada: nenhuma das fontes consultadas publica coordenada do afloramento. Redescrição: Bittencourt & Kellner (2009), Zootaxa 2079:1-56, DOI 10.11646/zootaxa.2079.1.1.",
    citacao_abnt: "COLBERT, E. H. A saurischian dinosaur from the Triassic of Brazil. American Museum Novitates, n. 2405, p. 1-39, 1970.",
    fontes: [
      "https://hdl.handle.net/2246/2615",
      "https://doi.org/10.11646/zootaxa.2079.1.1"
    ]
  },
  {
    id: 2,
    taxon: "Saturnalia tupiniquim Langer, Abdala, Richter & Benton, 1999",
    categoria: "Vertebrado — dinossauro (Sauropodomorpha)",
    periodo: "Triássico Superior (Carniano)",
    periodo_chave: "triassico",
    biozona_chave: "az_hyperodapedon",
    era: "Mesozóico — Triássico",
    periodo_ordem: 4,
    idade_ma: "ca. 233 Ma",
    formacao: "Fm. Santa Maria / Sequência Candelária (Membro Alemoa)",
    bacia: "Bacia do Paraná — Supersequência Santa Maria",
    municipio: "Santa Maria",
    local_coleta: "Cerro da Alemoa (Waldsanga / Sanga do Mato), arredores de Santa Maria, RS",
    site: "Cerro da Alemoa (Waldsanga)",
    lat: -29.6667, lon: -53.7500,
    coord_precisao: "publicada",
    numero_catalogo: "MCP 3844-PV (holótipo); parátipos MCP 3845-PV e MCP 3846-PV",
    armazenamento: "Museu de Ciências e Tecnologia da PUCRS (MCT-PUCRS), Porto Alegre",
    unidade_pesquisa: "MCT-PUCRS; USP-RP",
    descritor: "Langer, M.C.; Abdala, F.; Richter, M.; Benton, M.J. (1999) — Comptes Rendus de l'Académie des Sciences, Série IIA 329(7):511-517",
    tipo_fonte: "Artigo em periódico",
    doi: "",
    observacoes: "Três esqueletos coletados pelo MCT-PUCRS em 1998. Um dos sauropodomorfos mais basais conhecidos. A coordenada publicada (53°45'W; 29°40'S) vem de Bronzati, Müller & Langer (2019), que descrevem o crânio do parátipo MCP 3845-PV; é dada em minutos, logo tem precisão de cerca de 1,5 km. O DOI da descrição original de 1999 não foi localizado nas fontes consultadas e não foi deduzido; o DOI registrado em 'fontes' é o da redescrição craniana de 2019, em acesso aberto.",
    citacao_abnt: "LANGER, M. C.; ABDALA, F.; RICHTER, M.; BENTON, M. J. A sauropodomorph dinosaur from the Upper Triassic (Carnian) of southern Brazil. Comptes Rendus de l'Académie des Sciences, Série IIA, v. 329, n. 7, p. 511-517, 1999.",
    fontes: [
      "https://doi.org/10.1371/journal.pone.0221387"
    ]
  },
  {
    id: 3,
    taxon: "Buriolestes schultzi Cabreira et al., 2016",
    categoria: "Vertebrado — dinossauro (Sauropodomorpha)",
    periodo: "Triássico Superior (Carniano)",
    periodo_chave: "triassico",
    biozona_chave: "az_hyperodapedon",
    era: "Mesozóico — Triássico",
    periodo_ordem: 4,
    idade_ma: "ca. 233 Ma",
    formacao: "Fm. Santa Maria / Sequência Candelária",
    bacia: "Bacia do Paraná — Supersequência Santa Maria",
    municipio: "São João do Polêsine",
    local_coleta: "Afloramento Buriol, São João do Polêsine, RS",
    site: "Afloramento Buriol",
    lat: -29.6595, lon: -53.4298,
    coord_precisao: "publicada",
    numero_catalogo: "ULBRA-PVT 280 (holótipo); CAPPA/UFSM 0035 (espécime referido)",
    armazenamento: "Museu de Ciências Naturais da ULBRA, Canoas; CAPPA/UFSM, São João do Polêsine",
    unidade_pesquisa: "ULBRA; CAPPA/UFSM; USP-RP; MN/UFRJ",
    descritor: "Cabreira, S.F. et al. (2016) — Current Biology 26(22):3090-3095",
    tipo_fonte: "Artigo em periódico",
    doi: "10.1016/j.cub.2016.09.040",
    observacoes: "Sauropodomorfo mais basal conhecido, com dentição carnívora — desmonta a ideia de que a linhagem dos saurópodes nasceu herbívora. Preservado no mesmo bloco que Ixalerpeton polesinensis (registro 4), uma das raras associações diretas entre dinossauro e precursor de dinossauro. Duas coordenadas publicadas para o afloramento Buriol divergem em cerca de 350 m (29°39'30,78\"S / 53°26'08,97\"W e 29°39'34,2\"S / 53°25'47,4\"W); adotada a segunda.",
    citacao_abnt: "CABREIRA, S. F. et al. A unique Late Triassic dinosauromorph assemblage reveals dinosaur ancestral anatomy and diet. Current Biology, v. 26, n. 22, p. 3090-3095, 2016.",
    fontes: ["https://doi.org/10.1016/j.cub.2016.09.040"]
  },
  {
    id: 4,
    taxon: "Ixalerpeton polesinensis Cabreira et al., 2016",
    categoria: "Vertebrado — dinossauromorfo não-dinossauro (Lagerpetidae)",
    periodo: "Triássico Superior (Carniano)",
    periodo_chave: "triassico",
    biozona_chave: "az_hyperodapedon",
    era: "Mesozóico — Triássico",
    periodo_ordem: 4,
    idade_ma: "ca. 233 Ma",
    formacao: "Fm. Santa Maria / Sequência Candelária",
    bacia: "Bacia do Paraná — Supersequência Santa Maria",
    municipio: "São João do Polêsine",
    local_coleta: "Afloramento Buriol, São João do Polêsine, RS",
    site: "Afloramento Buriol",
    lat: -29.6595, lon: -53.4298,
    coord_precisao: "publicada",
    numero_catalogo: "ULBRA-PVT 059 (holótipo)",
    armazenamento: "Museu de Ciências Naturais da ULBRA, Canoas",
    unidade_pesquisa: "ULBRA; CAPPA/UFSM; USP-RP; MN/UFRJ",
    descritor: "Cabreira, S.F. et al. (2016) — Current Biology 26(22):3090-3095",
    tipo_fonte: "Artigo em periódico",
    doi: "10.1016/j.cub.2016.09.040",
    observacoes: "Lagerpetídeo — parente próximo dos dinossauros, mas fora de Dinosauria. É o registro que define a anatomia do teto craniano e do neurocrânio para a família. Coletado no mesmo nível e bloco de Buriolestes schultzi.",
    citacao_abnt: "CABREIRA, S. F. et al. A unique Late Triassic dinosauromorph assemblage reveals dinosaur ancestral anatomy and diet. Current Biology, v. 26, n. 22, p. 3090-3095, 2016.",
    fontes: ["https://doi.org/10.1016/j.cub.2016.09.040"]
  },
  {
    id: 5,
    taxon: "Gnathovorax cabreirai Pacheco et al., 2019",
    categoria: "Vertebrado — dinossauro (Saurischia, Herrerasauridae)",
    periodo: "Triássico Superior (Carniano)",
    periodo_chave: "triassico",
    biozona_chave: "az_hyperodapedon",
    era: "Mesozóico — Triássico",
    periodo_ordem: 4,
    idade_ma: "ca. 233,23 ± 0,73 Ma",
    formacao: "Fm. Santa Maria / Sequência Candelária",
    bacia: "Bacia do Paraná — Supersequência Santa Maria",
    municipio: "São João do Polêsine",
    local_coleta: "Sítio Marchezan, São João do Polêsine, RS",
    site: "Sítio Marchezan",
    lat: -29.6311, lon: -53.4506,
    coord_precisao: "publicada",
    numero_catalogo: "CAPPA/UFSM 0009 (holótipo)",
    armazenamento: "CAPPA/UFSM — Centro de Apoio à Pesquisa Paleontológica da Quarta Colônia, São João do Polêsine",
    unidade_pesquisa: "CAPPA/UFSM; USP-RP; PUCRS",
    descritor: "Pacheco, C.; Müller, R.T.; Langer, M.; Pretto, F.A.; Kerber, L.; Dias-da-Silva, S. (2019) — PeerJ 7:e7963",
    tipo_fonte: "Artigo em periódico",
    doi: "10.7717/peerj.7963",
    observacoes: "Esqueleto de herrerassaurídeo mais completo já descoberto, achado em 2014 e preparado no CAPPA. Preservado em bloco com cinodontes e rincossauros associados. Idade por datação radioisotópica de camadas correlatas (Langer, Ramezani & Da-Rosa, 2018). Publicado sob licença CC BY, o que libera reuso das figuras com crédito.",
    citacao_abnt: "PACHECO, C. et al. Gnathovorax cabreirai: a new early dinosaur and the origin and initial radiation of predatory dinosaurs. PeerJ, v. 7, e7963, 2019.",
    fontes: ["https://doi.org/10.7717/peerj.7963"]
  },
  {
    id: 6,
    taxon: "Unaysaurus tolentinoi Leal, Azevedo, Kellner & Da Rosa, 2004",
    categoria: "Vertebrado — dinossauro (Sauropodomorpha, Unaysauridae)",
    periodo: "Triássico Superior (Noriano)",
    periodo_chave: "triassico",
    biozona_chave: "az_riograndia",
    era: "Mesozóico — Triássico",
    periodo_ordem: 4,
    idade_ma: "ca. 225 Ma",
    formacao: "Fm. Caturrita",
    bacia: "Bacia do Paraná — Supersequência Santa Maria",
    municipio: "São Martinho da Serra",
    local_coleta: "Localidade Água Negra, São Martinho da Serra, RS",
    site: "Água Negra",
    lat: -29.5353, lon: -53.8683,
    coord_precisao: "regional",
    numero_catalogo: "UFSM 11069 (holótipo); molde MN 6749-V",
    armazenamento: "Universidade Federal de Santa Maria (UFSM), Santa Maria; molde no MN/UFRJ",
    unidade_pesquisa: "UFSM; MN/UFRJ",
    descritor: "Leal, L.A.; Azevedo, S.A.K.; Kellner, A.W.A.; Da Rosa, Á.A.S. (2004) — Zootaxa 690:1-24",
    tipo_fonte: "Artigo em periódico",
    doi: "10.11646/zootaxa.690.1.1",
    observacoes: "Esqueleto cerca de 70% completo com o crânio mais completo já recuperado para um dinossauro no Brasil. Descoberto em 1998 por Tolentino Flores Marafiga à margem de estrada. Coordenada regional: as fontes consultadas não publicam coordenada da localidade Água Negra — usada a sede municipal de São Martinho da Serra, com erro possível de vários quilômetros. Corrigir quando houver coordenada publicada.",
    citacao_abnt: "LEAL, L. A.; AZEVEDO, S. A. K.; KELLNER, A. W. A.; DA ROSA, Á. A. S. A new early dinosaur (Sauropodomorpha) from the Caturrita Formation (Late Triassic), Paraná Basin, Brazil. Zootaxa, v. 690, p. 1-24, 2004.",
    fontes: ["https://doi.org/10.11646/zootaxa.690.1.1"]
  },
  {
    id: 7,
    taxon: "Unaysaurus tolentinoi Leal, Azevedo, Kellner & Da Rosa, 2004",
    categoria: "Vertebrado — dinossauro (Sauropodomorpha, Unaysauridae)",
    periodo: "Triássico Superior (Noriano)",
    periodo_chave: "triassico",
    biozona_chave: "az_riograndia",
    era: "Mesozóico — Triássico",
    periodo_ordem: 4,
    idade_ma: "ca. 225 Ma",
    formacao: "Fm. Caturrita",
    bacia: "Bacia do Paraná — Supersequência Santa Maria",
    municipio: "São Martinho da Serra",
    local_coleta: "Localidade Água Negra, São Martinho da Serra, RS",
    site: "Água Negra",
    lat: -29.5353, lon: -53.8683,
    coord_precisao: "regional",
    numero_catalogo: "UFSM 11712",
    armazenamento: "Universidade Federal de Santa Maria (UFSM), Santa Maria",
    unidade_pesquisa: "UFSM; CAPPA/UFSM",
    descritor: "Müller, R.T.; Garcia, M.S.; Bem, F.P.; Damke, L.V.S.; Fonseca, A.O.; Da-Rosa, Á.A.S. (2023) — The Anatomical Record 307(4):1071-1083",
    tipo_fonte: "Artigo em periódico",
    doi: "10.1002/ar.25285",
    observacoes: "Indivíduo osteologicamente imaturo encontrado em associação com o holótipo e reconhecido apenas em 2023, após reexame direto do material. Mesmo táxon e mesmo sítio do registro 6, espécime distinto — é o caso que o validador sinaliza como aviso, não como erro. Periódico Wiley: figuras sem liberação de reuso por padrão.",
    citacao_abnt: "MÜLLER, R. T. et al. On a skeletally immature individual of Unaysaurus tolentinoi (Dinosauria: Sauropodomorpha) from the upper Triassic of southern Brazil. The Anatomical Record, v. 307, n. 4, p. 1071-1083, 2024.",
    fontes: ["https://doi.org/10.1002/ar.25285"]
  },
  {
    id: 8,
    taxon: "Pampaphoneus biccai Cisneros et al., 2012",
    categoria: "Vertebrado — sinapsídeo (Therapsida, Dinocephalia)",
    periodo: "Permiano Médio (Guadalupiano)",
    periodo_chave: "permiano",
    biozona_chave: "",
    era: "Paleozóico — Permiano",
    periodo_ordem: 3,
    idade_ma: "ca. 265 Ma",
    formacao: "Fm. Rio do Rasto / Membro Morro Pelado",
    bacia: "Bacia do Paraná — Supersequência Gondwana I",
    municipio: "São Gabriel",
    local_coleta: "Fazenda Boqueirão, distrito de Catuçaba, São Gabriel, RS",
    site: "Fazenda Boqueirão",
    lat: -30.0022, lon: -54.0858,
    coord_precisao: "publicada",
    numero_catalogo: "UFRGS PV386P (holótipo); UNIPAMPA 759 (segundo crânio)",
    armazenamento: "Laboratório de Paleovertebrados, UFRGS, Porto Alegre; UNIPAMPA, São Gabriel",
    unidade_pesquisa: "UFRGS; UNIPAMPA",
    descritor: "Cisneros, J.C. et al. (2012) — PNAS 109(5):1584-1588",
    tipo_fonte: "Artigo em periódico",
    doi: "10.1073/pnas.1115975109",
    observacoes: "Maior predador terrestre conhecido do Permiano brasileiro e o primeiro dinocéfalo descrito fora da Rússia e da África do Sul — evidência direta de dispersão de tetrápodes pela Pangeia. Coordenada publicada na descrição original (S 30°00'08\"; W 54°05'09\"). Um segundo crânio quase completo, UNIPAMPA 759, foi descrito por Costa Santos et al. (2023) no Zoological Journal of the Linnean Society 199(4):1034, do mesmo afloramento.",
    citacao_abnt: "CISNEROS, J. C. et al. Carnivorous dinocephalian from the Middle Permian of Brazil and tetrapod dispersal in Pangaea. PNAS, v. 109, n. 5, p. 1584-1588, 2012.",
    fontes: ["https://doi.org/10.1073/pnas.1115975109"]
  },
  {
    id: 9,
    taxon: "Rastodon procurvidens Boos et al., 2016",
    categoria: "Vertebrado — sinapsídeo (Therapsida, Dicynodontia)",
    periodo: "Permiano Médio (Guadalupiano)",
    periodo_chave: "permiano",
    biozona_chave: "",
    era: "Paleozóico — Permiano",
    periodo_ordem: 3,
    idade_ma: "ca. 265 Ma",
    formacao: "Fm. Rio do Rasto / Membro Morro Pelado",
    bacia: "Bacia do Paraná — Supersequência Gondwana I",
    municipio: "São Gabriel",
    local_coleta: "Fazenda Boqueirão, São Gabriel, RS",
    site: "Fazenda Boqueirão",
    lat: -30.0022, lon: -54.0858,
    coord_precisao: "publicada",
    numero_catalogo: "UNIPAMPA 317 (holótipo; também citado como UNIPAMPA PV317P)",
    armazenamento: "Laboratório de Paleobiologia, UNIPAMPA, São Gabriel",
    unidade_pesquisa: "UNIPAMPA; UFRGS",
    descritor: "Boos, A.D.S.; Kammerer, C.F.; Schultz, C.L.; Soares, M.B.; Ilha, A.L.R. (2016)",
    tipo_fonte: "Artigo em periódico",
    doi: "",
    observacoes: "Único dicinodonte permiano da América do Sul conhecido por crânio completo. Presas pequenas e curvadas para a frente, caráter único no grupo. Coletado no mesmo afloramento que Pampaphoneus biccai e Konzhukovia sangabrielensis. O DOI da descrição original de 2016 não foi confirmado nas fontes consultadas e não foi deduzido; a fonte registrada é o estudo endocraniano de Simão-Oliveira et al. (2020), Journal of Anatomy, que descreve o mesmo holótipo. Reinterpretado como Kingoriidae em revisão de 2025 — ver a ficha antes de citar a posição filogenética.",
    citacao_abnt: "BOOS, A. D. S. et al. A new dicynodont (Therapsida: Anomodontia) from the Permian of southern Brazil and its implications for bidentalian origins. 2016.",
    fontes: ["https://doi.org/10.1111/joa.13107"]
  },
  {
    id: 10,
    taxon: "Konzhukovia sangabrielensis Pacheco et al., 2017",
    categoria: "Vertebrado — anfíbio (Temnospondyli, Archegosauriformes)",
    periodo: "Permiano Médio (Guadalupiano)",
    periodo_chave: "permiano",
    biozona_chave: "",
    era: "Paleozóico — Permiano",
    periodo_ordem: 3,
    idade_ma: "ca. 265 Ma",
    formacao: "Fm. Rio do Rasto / Membro Morro Pelado",
    bacia: "Bacia do Paraná — Supersequência Gondwana I",
    municipio: "São Gabriel",
    local_coleta: "Fazenda Boqueirão, São Gabriel, RS",
    site: "Fazenda Boqueirão",
    lat: -30.0022, lon: -54.0858,
    coord_precisao: "publicada",
    numero_catalogo: "Não informado na fonte consultada",
    armazenamento: "Não informado na fonte consultada",
    unidade_pesquisa: "UNIPAMPA; UFRGS",
    descritor: "Pacheco, C.P. et al. (2017), citado em Kammerer (2021) e em Costa Santos et al. (2023)",
    tipo_fonte: "Citação em revisão",
    doi: "",
    observacoes: "REGISTRO FRÁGIL — não verificado na publicação original. O táxon é citado em duas revisões consultadas como tendo holótipo do mesmo afloramento de Pampaphoneus e Rastodon, mas nem o número de tombo nem a instituição de guarda foram confirmados. Primeiro Konzhukovia fora da Rússia, o que sustenta a mesma hipótese de conexão faunística da Pangeia. Abrir a descrição original de 2017 e completar tombo, guarda e DOI antes de citar.",
    citacao_abnt: "",
    fontes: ["https://academic.oup.com/zoolinnean/article/199/4/1034/7260715"]
  },
  {
    id: 11,
    taxon: "Riograndia guaibensis Bonaparte, Ferigolo & Ribeiro, 2001",
    categoria: "Vertebrado — cinodonte (Probainognathia, Prozostrodontia)",
    periodo: "Triássico Superior (Noriano)",
    periodo_chave: "triassico",
    biozona_chave: "az_riograndia",
    era: "Mesozóico — Triássico",
    periodo_ordem: 4,
    idade_ma: "ca. 225,42 ± 0,37 Ma",
    formacao: "Fm. Caturrita / Sequência Candelária",
    bacia: "Bacia do Paraná — Supersequência Santa Maria",
    municipio: "Candelária",
    local_coleta: "Afloramento Sesmaria do Pinhal 1, Candelária, RS",
    site: "Sesmaria do Pinhal 1",
    lat: -29.6667, lon: -52.7833,
    coord_precisao: "regional",
    numero_catalogo: "MCN-PV 2264 (holótipo); UFRGS-PV-596-T e UFRGS-PV-788-T (referidos)",
    armazenamento: "Museu de Ciências Naturais, Porto Alegre; UFRGS, Porto Alegre",
    unidade_pesquisa: "MCN; UFRGS",
    descritor: "Bonaparte, J.F.; Ferigolo, J.; Ribeiro, A.M. (2001); redescrição em Fonseca et al. (2025), The Anatomical Record",
    tipo_fonte: "Artigo em periódico",
    doi: "10.1002/ar.25540",
    observacoes: "Dá nome à Zona de Assembleia de Riograndia, o intervalo noriano que contém a fauna mais próxima da origem dos mamíferos no Brasil. Candelária é referência mundial nessa linhagem. Coordenada regional: as fontes consultadas nomeiam o afloramento mas não publicam coordenada — usada a sede municipal de Candelária. Corrigir quando houver coordenada publicada. O DOI registrado é o da redescrição do canal maxilar, em acesso fechado.",
    citacao_abnt: "BONAPARTE, J. F.; FERIGOLO, J.; RIBEIRO, A. M. A primitive Late Triassic 'ictidosaur' from Rio Grande do Sul, Brazil. Palaeontology, v. 44, n. 4, p. 623-635, 2001.",
    fontes: ["https://doi.org/10.1002/ar.25540"]
  },
  {
    id: 12,
    taxon: "Brasilodon quadrangularis Bonaparte et al., 2003",
    categoria: "Vertebrado — cinodonte (Probainognathia, Brasilodontidae)",
    periodo: "Triássico Superior (Noriano)",
    periodo_chave: "triassico",
    biozona_chave: "az_riograndia",
    era: "Mesozóico — Triássico",
    periodo_ordem: 4,
    idade_ma: "ca. 225,42 ± 0,37 Ma",
    formacao: "Fm. Caturrita / Sequência Candelária",
    bacia: "Bacia do Paraná — Supersequência Santa Maria",
    municipio: "Faxinal do Soturno",
    local_coleta: "Sítio Linha São Luiz, Faxinal do Soturno, RS",
    site: "Linha São Luiz",
    lat: -29.5789, lon: -53.4436,
    coord_precisao: "regional",
    numero_catalogo: "UFRGS-PV-0611-T (holótipo); UFRGS-PV-0628-T, 0765-T (referidos)",
    armazenamento: "Departamento de Paleontologia e Estratigrafia, UFRGS, Porto Alegre",
    unidade_pesquisa: "UFRGS; MCN",
    descritor: "Bonaparte, J.F. et al. (2003); pós-crânio em Bonaparte et al. (2019), PLOS ONE 14(5):e0216672",
    tipo_fonte: "Artigo em periódico",
    doi: "10.1371/journal.pone.0216672",
    observacoes: "Cinodonte não-mamaliaforme com traços de mamaliaforme no pós-crânio — um dos táxons mais citados na discussão sobre onde termina o cinodonte e começa o mamífero. Espécimes conhecidos de dois sítios, Linha São Luiz (Faxinal do Soturno) e Sesmaria do Pinhal (Candelária); este registro cobre o de Faxinal do Soturno. Coordenada regional: a publicação mapeia o sítio mas não publica coordenada — usada a sede municipal.",
    citacao_abnt: "BONAPARTE, J. F. et al. The postcranial anatomy of Brasilodon quadrangularis and the acquisition of mammaliaform traits among non-mammaliaform cynodonts. PLOS ONE, v. 14, n. 5, e0216672, 2019.",
    fontes: ["https://doi.org/10.1371/journal.pone.0216672"]
  },
  {
    id: 13,
    taxon: "Guaibasaurus candelariensis Bonaparte, Ferigolo & Ribeiro, 1999",
    categoria: "Vertebrado — dinossauro (Saurischia basal)",
    periodo: "Triássico Superior (Noriano)",
    periodo_chave: "triassico",
    biozona_chave: "az_riograndia",
    era: "Mesozóico — Triássico",
    periodo_ordem: 4,
    idade_ma: "ca. 225 Ma",
    formacao: "Fm. Caturrita / Sequência Candelária",
    bacia: "Bacia do Paraná — Supersequência Santa Maria",
    municipio: "Faxinal do Soturno",
    local_coleta: "Sítio Linha São Luiz, Faxinal do Soturno, RS",
    site: "Linha São Luiz",
    lat: -29.5789, lon: -53.4436,
    coord_precisao: "regional",
    numero_catalogo: "Não informado na fonte consultada",
    armazenamento: "Não informado na fonte consultada",
    unidade_pesquisa: "MCN; UFRGS",
    descritor: "Bonaparte, J.F.; Ferigolo, J.; Ribeiro, A.M. (1999), citado em Soares, Schultz & Horn (2011), An. Acad. Bras. Ciênc. 83(1)",
    tipo_fonte: "Citação em revisão",
    doi: "",
    observacoes: "REGISTRO FRÁGIL — este registro cobre o espécime de Faxinal do Soturno, citado em revisão, não o holótipo. Homonímia a documentar: o epíteto candelariensis vem de Candelária, município do holótipo, mas o material aqui catalogado é de Faxinal do Soturno, a cerca de 60 km. Tombo, guarda e coordenada não confirmados. Verificar a descrição original de 1999 e o artigo de 2007 sobre o novo espécime antes de citar.",
    citacao_abnt: "",
    fontes: ["https://www.scielo.br/j/aabc/a/pQGpjtvVysDQ6wwTR7R9HkN/"]
  },
  {
    id: 14,
    taxon: "Soturnia caliodon Cisneros & Schultz, 2003",
    categoria: "Vertebrado — parareptil (Procolophonidae)",
    periodo: "Triássico Superior (Noriano)",
    periodo_chave: "triassico",
    biozona_chave: "az_riograndia",
    era: "Mesozóico — Triássico",
    periodo_ordem: 4,
    idade_ma: "ca. 225 Ma",
    formacao: "Fm. Caturrita / Sequência Candelária",
    bacia: "Bacia do Paraná — Supersequência Santa Maria",
    municipio: "Faxinal do Soturno",
    local_coleta: "Sítio Linha São Luiz, Faxinal do Soturno, RS",
    site: "Linha São Luiz",
    lat: -29.5789, lon: -53.4436,
    coord_precisao: "regional",
    numero_catalogo: "Não informado na fonte consultada",
    armazenamento: "Não informado na fonte consultada",
    unidade_pesquisa: "UFRGS",
    descritor: "Cisneros, J.C.; Schultz, C.L. (2003), citado em Soares, Schultz & Horn (2011), An. Acad. Bras. Ciênc. 83(1)",
    tipo_fonte: "Citação em revisão",
    doi: "",
    observacoes: "REGISTRO FRÁGIL — procolofonídeo da mesma fauna de Riograndia e Brasilodon, listado em revisão. Tombo, guarda e coordenada não confirmados na fonte consultada. Abrir a descrição original antes de citar.",
    citacao_abnt: "",
    fontes: ["https://www.scielo.br/j/aabc/a/pQGpjtvVysDQ6wwTR7R9HkN/"]
  },
  {
    id: 15,
    taxon: "Clevosaurus brasiliensis Bonaparte & Sues, 2006",
    categoria: "Vertebrado — lepidossauro (Rhynchocephalia, Clevosauridae)",
    periodo: "Triássico Superior (Noriano)",
    periodo_chave: "triassico",
    biozona_chave: "az_riograndia",
    era: "Mesozóico — Triássico",
    periodo_ordem: 4,
    idade_ma: "ca. 225 Ma",
    formacao: "Fm. Caturrita / Sequência Candelária",
    bacia: "Bacia do Paraná — Supersequência Santa Maria",
    municipio: "Faxinal do Soturno",
    local_coleta: "Sítio Linha São Luiz, Faxinal do Soturno, RS",
    site: "Linha São Luiz",
    lat: -29.5789, lon: -53.4436,
    coord_precisao: "regional",
    numero_catalogo: "Não informado na fonte consultada",
    armazenamento: "Não informado na fonte consultada",
    unidade_pesquisa: "UFRGS",
    descritor: "Bonaparte, J.F.; Sues, H.-D. (2006), citado em Soares, Schultz & Horn (2011), An. Acad. Bras. Ciênc. 83(1)",
    tipo_fonte: "Citação em revisão",
    doi: "",
    observacoes: "REGISTRO FRÁGIL — parente triássico do tuatara, na mesma fauna de Faxinal do Soturno. Um dos registros mais antigos do clado clevosaurídeo segundo a revisão consultada. Tombo, guarda e coordenada não confirmados. Abrir a descrição original antes de citar.",
    citacao_abnt: "",
    fontes: ["https://www.scielo.br/j/aabc/a/pQGpjtvVysDQ6wwTR7R9HkN/"]
  }
];

/* ---------------------------------------------------------------------
   SÍTIOS — pontos do mapa. 'count' é conferido pelo validador contra
   a contagem real em DB_REGISTROS.
   --------------------------------------------------------------------- */
const DB_SITIOS = [
  { nome: "Sanga Grande / Sanga de Baixo (Alemoa)", municipio: "Santa Maria", lat: -29.6836, lon: -53.7690, count: 1, coord_precisao: "aproximada" },
  { nome: "Cerro da Alemoa (Waldsanga)", municipio: "Santa Maria", lat: -29.6667, lon: -53.7500, count: 1, coord_precisao: "publicada" },
  { nome: "Afloramento Buriol", municipio: "São João do Polêsine", lat: -29.6595, lon: -53.4298, count: 2, coord_precisao: "publicada" },
  { nome: "Sítio Marchezan", municipio: "São João do Polêsine", lat: -29.6311, lon: -53.4506, count: 1, coord_precisao: "publicada" },
  { nome: "Água Negra", municipio: "São Martinho da Serra", lat: -29.5353, lon: -53.8683, count: 2, coord_precisao: "regional" },
  { nome: "Fazenda Boqueirão", municipio: "São Gabriel", lat: -30.0022, lon: -54.0858, count: 3, coord_precisao: "publicada" },
  { nome: "Sesmaria do Pinhal 1", municipio: "Candelária", lat: -29.6667, lon: -52.7833, count: 1, coord_precisao: "regional" },
  { nome: "Linha São Luiz", municipio: "Faxinal do Soturno", lat: -29.5789, lon: -53.4436, count: 4, coord_precisao: "regional" }
];

/* ---------------------------------------------------------------------
   INSTITUIÇÕES — o validador exige que toda instituição citada em
   'armazenamento' ou 'unidade_pesquisa' tenha ficha aqui.
   --------------------------------------------------------------------- */
const DB_INSTITUICOES = [
  { sigla: "CAPPA/UFSM", nome: "Centro de Apoio à Pesquisa Paleontológica da Quarta Colônia", cidade: "São João do Polêsine, RS", site: "https://www.ufsm.br/orgaos-suplementares/cappa", acervo: "Vertebrados do Triássico da Quarta Colônia; coleção de referência da Sequência Candelária." },
  { sigla: "UFSM", nome: "Universidade Federal de Santa Maria — Laboratório de Estratigrafia e Paleobiologia", cidade: "Santa Maria, RS", site: "https://www.ufsm.br", acervo: "Vertebrados triássicos das formações Santa Maria e Caturrita." },
  { sigla: "MCT-PUCRS", nome: "Museu de Ciências e Tecnologia da PUCRS", cidade: "Porto Alegre, RS", site: "https://www.pucrs.br/mct/", acervo: "Uma das maiores coleções de vertebrados fósseis do país; forte em Triássico e Quaternário." },
  { sigla: "ULBRA", nome: "Museu de Ciências Naturais da Universidade Luterana do Brasil", cidade: "Canoas, RS", site: "https://www.ulbra.br", acervo: "Vertebrados do Triássico do RS (série ULBRA-PVT)." },
  { sigla: "MCZ", nome: "Museum of Comparative Zoology, Harvard University", cidade: "Cambridge, Massachusetts (EUA)", site: "https://mcz.harvard.edu", acervo: "Guarda o holótipo de Staurikosaurus pricei, coletado no RS em 1936." },
  { sigla: "AMNH", nome: "American Museum of Natural History", cidade: "Nova York (EUA)", site: "https://www.amnh.org", acervo: "Instituição de E.H. Colbert, autor da descrição de Staurikosaurus pricei." },
  { sigla: "MN/UFRJ", nome: "Museu Nacional, Universidade Federal do Rio de Janeiro", cidade: "Rio de Janeiro, RJ", site: "https://www.museunacional.ufrj.br", acervo: "Moldes e material comparativo; coautoria em descrições de material gaúcho." },
  { sigla: "USP-RP", nome: "Laboratório de Paleontologia, FFCLRP, Universidade de São Paulo", cidade: "Ribeirão Preto, SP", site: "https://www.ffclrp.usp.br", acervo: "Grupo de pesquisa em dinossauros basais do Triássico sul-brasileiro." },
  { sigla: "UFRGS", nome: "Universidade Federal do Rio Grande do Sul — Laboratório de Paleovertebrados", cidade: "Porto Alegre, RS", site: "https://www.ufrgs.br/paleovertebrados/", acervo: "Série UFRGS-PV, uma das maiores coleções de vertebrados fósseis do Brasil; referência em cinodontes triássicos e terápsidas permianos." },
  { sigla: "UNIPAMPA", nome: "Universidade Federal do Pampa — Laboratório de Paleobiologia", cidade: "São Gabriel, RS", site: "https://unipampa.edu.br", acervo: "Tetrápodes permianos da Fm. Rio do Rasto; guarda os holótipos de Rastodon procurvidens e o segundo crânio de Pampaphoneus biccai." },
  { sigla: "MCN", nome: "Museu de Ciências Naturais (ex-Fundação Zoobotânica do RS)", cidade: "Porto Alegre, RS", site: "https://www.sema.rs.gov.br", acervo: "Série MCN-PV; guarda os holótipos de Riograndia guaibensis e Guaibasaurus candelariensis." },
  { sigla: "PUCRS", nome: "Pontifícia Universidade Católica do Rio Grande do Sul", cidade: "Porto Alegre, RS", site: "https://www.pucrs.br", acervo: "Laboratório de Sedimentologia e Petrologia; microtomografia de fósseis." }
];

/* ---------------------------------------------------------------------
   BACIAS SEDIMENTARES
   --------------------------------------------------------------------- */
const DB_BACIAS = [
  {
    nome: "Bacia do Paraná — Supersequência Santa Maria",
    idade: "Triássico Médio a Superior",
    unidades: ["Fm. Sanga do Cabral", "Fm. Santa Maria", "Fm. Caturrita"],
    descricao: "Sucessão continental da região central do RS, base do Geoparque Paleorrota. Reúne o registro mais antigo de dinossauros do Brasil e uma das melhores séries de cinodontes do mundo."
  },
  {
    nome: "Bacia do Paraná — Supersequência Gondwana I",
    idade: "Carbonífero Superior a Permiano",
    unidades: ["Grupo Itararé", "Fm. Rio Bonito", "Fm. Irati", "Fm. Rio do Rasto"],
    descricao: "Do glacial ao continental árido. Flora Glossopteris, mesossauros e tetrápodes permianos. Ainda sem registros no banco."
  },
  {
    nome: "Bacia de Pelotas e planície costeira",
    idade: "Neógeno a Quaternário",
    unidades: ["Barreiras Múltiplas", "Depósitos da plataforma continental"],
    descricao: "Megafauna pleistocênica do Arroio Touro Passo, Santa Vitória do Palmar e material dragado da plataforma. Ainda sem registros no banco."
  }
];

/* Exportação para Node (usado pelos scripts de exportação) e navegador. */
if (typeof module !== "undefined" && module.exports) {
  module.exports = { VERSAO_BANCO, DATA_VERSAO, DB_PERIODOS, DB_BIOZONAS, DB_REGISTROS, DB_SITIOS, DB_INSTITUICOES, DB_BACIAS };
}
