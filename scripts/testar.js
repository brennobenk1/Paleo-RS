const { JSDOM } = require("jsdom");
const fs = require("fs");
const html = fs.readFileSync(__dirname + "/../previa.html", "utf8");
const dom = new JSDOM(html, { runScripts: "dangerously", pretendToBeVisual: true, url: "https://exemplo.test/" });
const { window } = dom;
window.addEventListener("error", e => console.log("ERRO JS:", e.error && e.error.stack));
const falhas = [];
const ok = (c, m) => { console.log((c ? "ok   " : "FALHA") + "  " + m); if (!c) falhas.push(m); };
const clique = (el) => el.dispatchEvent(new window.Event("click", { bubbles: true }));

setTimeout(() => {
  const d = window.document;
  // abas
  ok(d.querySelectorAll("#abas a").length === 6, "seis abas no menu");
  ok(!d.querySelector("#p-inicio").hidden && d.querySelector("#p-mapa").hidden, "abre no Início com as outras ocultas");
  ok(d.querySelector("#h-registros").textContent === "15", `placar de registros: ${d.querySelector("#h-registros").textContent}`);
  ok(d.querySelector("#h-sitios").textContent === "8", `sítios: ${d.querySelector("#h-sitios").textContent}`);
  ok(d.querySelector("#h-municipios").textContent === "6", `municípios: ${d.querySelector("#h-municipios").textContent}`);
  ok(d.querySelector("#c-malha").textContent === "496", `malha: ${d.querySelector("#c-malha").textContent} municípios`);

  // navegar para o mapa
  clique(d.querySelector('#abas a[data-aba="mapa"]'));
  ok(!d.querySelector("#p-mapa").hidden && d.querySelector("#p-inicio").hidden, "aba Mapa troca o painel");
  ok(window.location.hash === "#/mapa", `hash da aba: ${window.location.hash}`);
  ok(d.querySelectorAll("#mapa path.mun").length === 496, `polígonos municipais: ${d.querySelectorAll("#mapa path.mun").length}`);
  ok(d.querySelectorAll("#mapa path.mun.com-registro").length === 6, `municípios destacados: ${d.querySelectorAll("#mapa path.mun.com-registro").length}`);
  ok(d.querySelectorAll("#mapa circle.sitio").length === 8, `círculos de sítio: ${d.querySelectorAll("#mapa circle.sitio").length}`);
  // nenhum sítio coberto por outro
  const cs = Array.from(d.querySelectorAll("#mapa circle.sitio")).map(c => ({x:+c.getAttribute("cx"),y:+c.getAttribute("cy"),r:+c.getAttribute("r")}));
  let cobertos = 0;
  for (let i=0;i<cs.length;i++) for (let j=0;j<cs.length;j++) if (i!==j) {
    const dd = Math.hypot(cs[i].x-cs[j].x, cs[i].y-cs[j].y);
    if (dd + cs[i].r <= cs[j].r) cobertos++;
  }
  ok(cobertos === 0, `sítios inteiramente cobertos por vizinho: ${cobertos}`);
  ok(d.querySelectorAll("#mapa circle.sitio[tabindex]").length === 8, "sítios alcançáveis por teclado");
  clique(d.querySelector('#mapa circle.sitio[data-sitio="Fazenda Boqueirão"]'));
  ok(/Boqueirão/.test(d.querySelector("#sitio-detalhe").textContent), "painel lateral mostra o sítio clicado");
  ok(/Pampaphoneus/.test(d.querySelector("#sitio-detalhe").textContent), "lista os táxons do sítio");

  // períodos
  clique(d.querySelector('#abas a[data-aba="periodos"]'));
  ok(d.querySelectorAll(".periodo-bloco").length === 9, `blocos de período: ${d.querySelectorAll(".periodo-bloco").length}`);
  const cabTri = Array.from(d.querySelectorAll(".periodo-cab")).find(b => b.dataset.periodo === "triassico");
  clique(cabTri);
  ok(cabTri.getAttribute("aria-expanded") === "true" && !cabTri.nextElementSibling.hidden, "acordeão do Triássico abre");
  ok(/Zona de Assembleia de Hyperodapedon/.test(cabTri.nextElementSibling.textContent), "mostra as zonas de assembleia");

  // instituições
  clique(d.querySelector('#abas a[data-aba="instituicoes"]'));
  ok(d.querySelectorAll(".inst").length === 12, `fichas de instituição: ${d.querySelectorAll(".inst").length}`);

  // catálogo + filtro
  clique(d.querySelector('#abas a[data-aba="catalogo"]'));
  ok(d.querySelectorAll(".cartao").length === 15, `cartões: ${d.querySelectorAll(".cartao").length}`);
  const sel = d.querySelector("#f-periodo");
  sel.value = "permiano"; sel.dispatchEvent(new window.Event("change"));
  ok(d.querySelectorAll(".cartao").length === 3, `filtro Permiano: ${d.querySelectorAll(".cartao").length} (esperado 3)`);
  ok(/periodo=permiano/.test(window.location.hash), `permalink com filtro: ${window.location.hash}`);
  clique(d.querySelector("#limpar"));

  // ficha
  clique(d.querySelectorAll(".cartao")[7]);
  ok(!d.querySelector("#modal").hidden, "ficha abre");
  ok(/Pampaphoneus/.test(d.querySelector("#ficha-titulo").textContent), `ficha: ${d.querySelector("#ficha-titulo").textContent.trim()}`);
  ok(/pnas/.test(d.querySelector("#ficha-corpo").innerHTML), "DOI do PNAS presente");
  d.dispatchEvent(new window.KeyboardEvent("keydown", { key: "Escape" }));
  ok(d.querySelector("#modal").hidden, "Esc fecha a ficha");

  // citação
  clique(d.querySelector("#abrir-citar"));
  ok(!d.querySelector("#modal-citar").hidden, "modal Como citar abre");
  const abnt = d.querySelector("#citacao-texto").textContent;
  ok(/^BENK, Brenno Alef\./.test(abnt), `ABNT começa pela autoria: ${abnt.slice(0,40)}…`);
  ok(/Versão 2026\.09\.2/.test(abnt), "ABNT traz a versão do banco");
  ok(/Acesso em: \d+ \w+\.? \d{4}/.test(abnt), "ABNT traz data de acesso automática");
  clique(d.querySelector('.guia[data-norma="apa"]'));
  ok(/^Benk, B\. A\. \(2026\)/.test(d.querySelector("#citacao-texto").textContent), "APA formata o nome de outro jeito");
  clique(d.querySelector('.guia[data-norma="bibtex"]'));
  ok(/@misc\{benk2026paleors/.test(d.querySelector("#citacao-texto").textContent), "BibTeX gerado");

  // não sobrou o bloco removido
  ok(!/densidade de registros reflete|erro mais fácil de cometer/.test(d.body.textContent), "bloco de viés amostral removido");

  console.log("\n" + (falhas.length ? falhas.length + " FALHA(S)" : "todos os testes passaram"));
  process.exit(falhas.length ? 1 : 0);
}, 1200);
