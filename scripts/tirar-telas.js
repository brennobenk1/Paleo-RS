/* Paleo-RS — scripts/tirar-telas.js
   Renderiza previa.html num Chromium headless e salva capturas em telas/.
   Existe porque defeito visual não aparece em teste de DOM: a faixa de
   período dos cartões ficou com altura zero por semanas e só a captura
   de tela mostrou.

   Requer puppeteer:  npm install puppeteer
   Uso:  node scripts/tirar-telas.js
*/
const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");

const RAIZ = path.join(__dirname, "..");
const SAIDA = path.join(RAIZ, "telas");
const ABAS = ["inicio", "catalogo", "mapa", "periodos", "instituicoes", "sobre"];

(async () => {
  fs.mkdirSync(SAIDA, { recursive: true });
  const nav = await puppeteer.launch({ args: ["--no-sandbox"] });
  const url = "file://" + path.join(RAIZ, "previa.html");

  const p = await nav.newPage();
  await p.setViewport({ width: 1280, height: 900 });
  await p.goto(url, { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 900));
  for (const aba of ABAS) {
    await p.evaluate((a) => { location.hash = "#/" + a; }, aba);
    await new Promise((r) => setTimeout(r, 500));
    await p.screenshot({ path: path.join(SAIDA, `desktop-${aba}.png`), fullPage: true });
  }

  const m = await nav.newPage();
  await m.setViewport({ width: 390, height: 780, isMobile: true });
  await m.goto(url, { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 900));
  for (const aba of ABAS) {
    await m.evaluate((a) => { location.hash = "#/" + a; }, aba);
    await new Promise((r) => setTimeout(r, 500));
    await m.screenshot({ path: path.join(SAIDA, `mobile-${aba}.png`), fullPage: true });
  }

  await nav.close();
  console.log(`${ABAS.length * 2} capturas em telas/`);
})();
