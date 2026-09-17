const { JSDOM } = require("jsdom");
const fs = require("fs");
const html = fs.readFileSync(__dirname + "/../previa.html", "utf8");

const dom = new JSDOM(html, { runScripts: "dangerously", pretendToBeVisual: true, url: "https://exemplo.test/" });
const { window } = dom;

window.addEventListener("error", e => console.log("ERRO JS:", e.error && e.error.stack));

setTimeout(() => {
  const d = window.document;
  const falhas = [];
  const ok = (cond, msg) => { console.log((cond ? "ok   " : "FALHA") + "  " + msg); if (!cond) falhas.push(msg); };

  const cartoes = d.querySelectorAll(".cartao");
  ok(cartoes.length === 7, `cartões renderizados: ${cartoes.length} (esperado 7)`);
  ok(d.querySelector("#total-registros").textContent === "7", `contador de registros lido do banco: "${d.querySelector("#total-registros").textContent}"`);
  ok(d.querySelector("#total-sitios").textContent === "5", `contador de sítios: "${d.querySelector("#total-sitios").textContent}"`);
  ok(d.querySelector("#total-municipios").textContent === "3", `municípios distintos: "${d.querySelector("#total-municipios").textContent}"`);
  ok(d.querySelectorAll("#coluna .coluna-faixa").length === 9, `faixas da coluna estratigráfica: ${d.querySelectorAll("#coluna .coluna-faixa").length}`);
  ok(d.querySelectorAll("#f-municipio option").length === 4, `opções do filtro município: ${d.querySelectorAll("#f-municipio option").length} (3 + "todos")`);
  ok(d.querySelectorAll(".etiqueta-tombo").length === 7, "etiquetas de tombo presentes");
  ok(d.querySelectorAll("#tabela-corpo tr").length === 7, "linhas da tabela geradas em paralelo");

  const faixa = cartoes[0].querySelector(".faixa-periodo");
  ok(/812B92/i.test(faixa.getAttribute("style")), `faixa do cartão usa a cor ICS do Triássico: ${faixa.getAttribute("style")}`);

  // filtro
  const sel = d.querySelector("#f-municipio");
  sel.value = "São João do Polêsine";
  sel.dispatchEvent(new window.Event("change"));
  ok(d.querySelectorAll(".cartao").length === 3, `filtro por município devolveu ${d.querySelectorAll(".cartao").length} (esperado 3)`);
  ok(/municipio=S/.test(window.location.hash), `permalink gravado no hash: ${window.location.hash}`);

  // busca
  d.querySelector("#limpar").dispatchEvent(new window.Event("click", { bubbles: true }));
  const busca = d.querySelector("#busca");
  busca.value = "zzqqxx";
  busca.dispatchEvent(new window.Event("input"));
  ok(d.querySelectorAll(".cartao").length === 0 && !d.querySelector("#vazio").hidden, "busca sem resultado mostra o estado vazio (termo inexistente)");
  busca.value = "harvard";
  busca.dispatchEvent(new window.Event("input"));
  ok(d.querySelectorAll(".cartao").length === 1, `busca em campo de acervo achou ${d.querySelectorAll(".cartao").length} (Staurikosaurus)`);

  // ficha
  d.querySelector("#limpar").dispatchEvent(new window.Event("click", { bubbles: true }));
  d.querySelectorAll(".cartao")[4].dispatchEvent(new window.Event("click", { bubbles: true }));
  ok(!d.querySelector("#modal").hidden, "ficha abre ao clicar no cartão");
  ok(/Gnathovorax/.test(d.querySelector("#ficha-titulo").textContent), `título da ficha: ${d.querySelector("#ficha-titulo").textContent.trim()}`);
  ok(/peerj/i.test(d.querySelector("#ficha-corpo").innerHTML), "DOI da ficha é link clicável");
  ok(/Paleo-RS\/issues\/new/.test(d.querySelector("#reportar").href), "botão reportar erro aponta para o repositório certo");
  ok(window.location.hash === "#/registro/5", `permalink da ficha: ${window.location.hash}`);
  d.dispatchEvent(new window.KeyboardEvent("keydown", { key: "Escape" }));
  ok(d.querySelector("#modal").hidden, "Esc fecha a ficha");

  console.log("\n" + (falhas.length ? falhas.length + " FALHA(S)" : "todos os testes passaram"));
  process.exit(falhas.length ? 1 : 0);
}, 700);
