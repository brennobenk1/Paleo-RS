/* =====================================================================
   Paleo-RS — js/app.js
   Só código. Nenhum dado aqui: tudo vem de js/dados.js.
   Nenhum número escrito à mão no HTML: todas as contagens são lidas
   do banco em tempo de execução.
   ===================================================================== */

(function () {
  "use strict";

  const LOTE = 36;

  const estado = {
    busca: "",
    periodo: "",
    grupo: "",
    formacao: "",
    municipio: "",
    instituicao: "",
    vista: "cartoes",
    mostrados: 0,
    filtrados: []
  };

  let ultimoFoco = null;

  /* ---------- utilidades ---------- */
  const $ = (s, raiz) => (raiz || document).querySelector(s);
  const $$ = (s, raiz) => Array.from((raiz || document).querySelectorAll(s));

  function normalizar(t) {
    return String(t == null ? "" : t)
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

  function corDoPeriodo(chave) {
    const p = DB_PERIODOS.find((x) => x.chave === chave);
    return p ? p.cor : "#B9C2B4";
  }

  /* Separa "Genus species Autor, ano" em nome científico + autoria,
     para o itálico cobrir só o que deve estar em itálico. */
  function partirTaxon(taxon) {
    const m = String(taxon).match(/^([A-Z][a-zé]+(?:\s+[a-z\u00C0-\u017F.]+)?(?:\s+(?:sp\.|indet\.|aff\.|cf\.))?)\s*(.*)$/);
    if (!m) return { nome: taxon, autoria: "" };
    return { nome: m[1], autoria: m[2] || "" };
  }

  function grupoDe(reg) {
    return String(reg.categoria).split("—")[0].trim();
  }

  function esc(t) {
    const d = document.createElement("div");
    d.textContent = t == null ? "" : t;
    return d.innerHTML;
  }

  /* ---------- filtragem ---------- */
  function aplicarFiltros() {
    const b = normalizar(estado.busca);
    estado.filtrados = DB_REGISTROS.filter((r) => {
      if (estado.periodo && r.periodo_chave !== estado.periodo) return false;
      if (estado.grupo && grupoDe(r) !== estado.grupo) return false;
      if (estado.formacao && r.formacao !== estado.formacao) return false;
      if (estado.municipio && r.municipio !== estado.municipio) return false;
      if (estado.instituicao && !normalizar(r.armazenamento + " " + r.unidade_pesquisa).includes(normalizar(estado.instituicao))) return false;
      if (!b) return true;
      const alvo = normalizar([r.taxon, r.categoria, r.formacao, r.municipio, r.local_coleta,
        r.numero_catalogo, r.armazenamento, r.descritor, r.observacoes].join(" "));
      return b.split(/\s+/).every((t) => alvo.includes(t));
    });
    estado.mostrados = 0;
    $("#grade").innerHTML = "";
    $("#tabela-corpo").innerHTML = "";
    renderizarLote();
    atualizarResumo();
    gravarHash();
  }

  function atualizarResumo() {
    const n = estado.filtrados.length;
    const total = DB_REGISTROS.length;
    $("#contagem").textContent = n === total
      ? `${total} ${total === 1 ? "registro" : "registros"}`
      : `${n} de ${total} registros`;
    $("#vazio").hidden = n > 0;
  }

  /* ---------- renderização incremental ---------- */
  function renderizarLote() {
    const fim = Math.min(estado.mostrados + LOTE, estado.filtrados.length);
    const fragC = document.createDocumentFragment();
    const fragT = document.createDocumentFragment();

    for (let i = estado.mostrados; i < fim; i++) {
      fragC.appendChild(montarCartao(estado.filtrados[i]));
      fragT.appendChild(montarLinha(estado.filtrados[i]));
    }
    $("#grade").appendChild(fragC);
    $("#tabela-corpo").appendChild(fragT);
    estado.mostrados = fim;
    $("#mais").hidden = estado.mostrados >= estado.filtrados.length;
    $("#mais").textContent = `Mostrar mais ${Math.min(LOTE, estado.filtrados.length - estado.mostrados)}`;
  }

  function montarCartao(r) {
    const t = partirTaxon(r.taxon);
    const el = document.createElement("button");
    el.type = "button";
    el.className = "cartao";
    el.setAttribute("aria-label", `Abrir ficha de ${t.nome}, registro ${r.id}`);
    el.dataset.id = r.id;
    el.innerHTML =
      `<span class="faixa-periodo" style="background:${corDoPeriodo(r.periodo_chave)}"></span>` +
      `<span class="cartao-corpo">` +
        `<span class="taxon">${esc(t.nome)}${t.autoria ? ` <span class="autoria">${esc(t.autoria)}</span>` : ""}</span>` +
        `<dl>` +
          `<div><dt>Idade</dt><dd>${esc(r.periodo)}</dd></div>` +
          `<div><dt>Formação</dt><dd>${esc(r.formacao)}</dd></div>` +
          `<div><dt>Município</dt><dd>${esc(r.municipio)}</dd></div>` +
          `<div><dt>Acervo</dt><dd>${esc(String(r.armazenamento).split(",")[0])}</dd></div>` +
        `</dl>` +
        `<span class="selo" data-fonte="${esc(r.tipo_fonte)}">${esc(r.tipo_fonte)}</span>` +
      `</span>` +
      `<span class="etiqueta-tombo">${esc(String(r.numero_catalogo).split(";")[0])}</span>`;
    return el;
  }

  function montarLinha(r) {
    const tr = document.createElement("tr");
    tr.innerHTML =
      `<td><button type="button" class="ligacao-registro" data-id="${r.id}"><i>${esc(partirTaxon(r.taxon).nome)}</i></button></td>` +
      `<td>${esc(r.periodo)}</td><td>${esc(r.formacao)}</td><td>${esc(r.municipio)}</td>` +
      `<td>${esc(r.numero_catalogo)}</td><td>${esc(r.tipo_fonte)}</td>`;
    return tr;
  }

  /* ---------- ficha ---------- */
  function abrirFicha(id) {
    const r = DB_REGISTROS.find((x) => x.id === Number(id));
    if (!r) return;
    ultimoFoco = document.activeElement;
    const t = partirTaxon(r.taxon);
    const bio = DB_BIOZONAS.find((z) => z.chave === r.biozona_chave);
    const perm = `${location.origin}${location.pathname}#/registro/${r.id}`;

    $("#ficha-titulo").innerHTML = `<i>${esc(t.nome)}</i> <span class="autoria">${esc(t.autoria)}</span>`;
    $("#ficha-corpo").innerHTML =
      `<dl>` +
      linha("Categoria", r.categoria) +
      linha("Idade", `${esc(r.periodo)} — ${esc(r.idade_ma)}`) +
      (bio ? linha("Zona de assembleia", bio.nome) : "") +
      linha("Formação", r.formacao) +
      linha("Bacia", r.bacia) +
      linha("Município", r.municipio) +
      linha("Local de coleta", r.local_coleta) +
      linha("Coordenada", `${r.lat.toFixed(4)}, ${r.lon.toFixed(4)} <span class="precisao" data-p="${esc(r.coord_precisao)}">${esc(r.coord_precisao)}</span>`) +
      linha("Nº de catálogo", r.numero_catalogo) +
      linha("Acervo", r.armazenamento) +
      linha("Instituições", r.unidade_pesquisa) +
      linha("Fonte", r.descritor) +
      linha("Tipo de fonte", r.tipo_fonte) +
      (r.doi ? linha("DOI", `<a href="https://doi.org/${esc(r.doi)}" target="_blank" rel="noopener">${esc(r.doi)}</a>`) : linha("DOI", "Não informado na fonte consultada")) +
      linha("Observações", r.observacoes) +
      (r.citacao_abnt ? linha("Referência", r.citacao_abnt) : "") +
      `</dl>` +
      `<div class="ficha-acoes">` +
        `<button type="button" class="botao secundario" id="copiar-link">Copiar link da ficha</button>` +
        `<a class="botao secundario" id="reportar" href="#" target="_blank" rel="noopener">Reportar erro</a>` +
      `</div>`;

    $("#reportar").href = urlIssue(r, perm);
    $("#copiar-link").addEventListener("click", () => {
      navigator.clipboard.writeText(perm).then(() => {
        $("#copiar-link").textContent = "Link copiado";
        setTimeout(() => { $("#copiar-link").textContent = "Copiar link da ficha"; }, 2000);
      });
    });

    $("#modal").hidden = false;
    document.body.style.overflow = "hidden";
    $("#fechar-ficha").focus();
    location.hash = `#/registro/${r.id}`;
  }

  function linha(rotulo, valor) {
    return `<div><dt>${esc(rotulo)}</dt><dd>${/[<]/.test(String(valor)) ? valor : esc(valor)}</dd></div>`;
  }

  function urlIssue(r, perm) {
    const corpo = [
      `Registro: #${r.id}`,
      `Táxon: ${r.taxon}`,
      `Permalink: ${perm}`,
      `Versão do banco: ${VERSAO_BANCO} (${DATA_VERSAO})`,
      `Fonte citada: ${r.descritor}`,
      "", "O que está errado:", "", "Fonte que sustenta a correção:", ""
    ].join("\n");
    return "https://github.com/brennobenk1/Paleo-RS/issues/new?title=" +
      encodeURIComponent(`Correção no registro #${r.id} — ${partirTaxon(r.taxon).nome}`) +
      "&body=" + encodeURIComponent(corpo);
  }

  function fecharFicha() {
    $("#modal").hidden = true;
    document.body.style.overflow = "";
    if (ultimoFoco) ultimoFoco.focus();
    if (location.hash.startsWith("#/registro/")) gravarHash();
  }

  /* foco preso no diálogo enquanto aberto */
  function prenderFoco(ev) {
    if ($("#modal").hidden || ev.key !== "Tab") return;
    const alvos = $$('a[href], button, input, select, [tabindex]:not([tabindex="-1"])', $("#modal"))
      .filter((e) => e.offsetParent !== null);
    if (!alvos.length) return;
    const primeiro = alvos[0], ultimo = alvos[alvos.length - 1];
    if (ev.shiftKey && document.activeElement === primeiro) { ev.preventDefault(); ultimo.focus(); }
    else if (!ev.shiftKey && document.activeElement === ultimo) { ev.preventDefault(); primeiro.focus(); }
  }

  /* ---------- permalink por hash (funciona no GitHub Pages e em file://) ---------- */
  function gravarHash() {
    const p = new URLSearchParams();
    if (estado.busca) p.set("q", estado.busca);
    if (estado.periodo) p.set("periodo", estado.periodo);
    if (estado.grupo) p.set("grupo", estado.grupo);
    if (estado.formacao) p.set("formacao", estado.formacao);
    if (estado.municipio) p.set("municipio", estado.municipio);
    if (estado.instituicao) p.set("instituicao", estado.instituicao);
    const s = p.toString();
    const novo = s ? `#/catalogo?${s}` : "#/catalogo";
    if (location.hash !== novo) history.replaceState(null, "", novo);
  }

  function lerHash() {
    const h = decodeURIComponent(location.hash || "");
    const mReg = h.match(/^#\/registro\/(\d+)/);
    if (mReg) { abrirFicha(mReg[1]); return true; }
    const mCat = h.match(/^#\/catalogo\?(.*)$/);
    if (mCat) {
      const p = new URLSearchParams(mCat[1]);
      estado.busca = p.get("q") || "";
      estado.periodo = p.get("periodo") || "";
      estado.grupo = p.get("grupo") || "";
      estado.formacao = p.get("formacao") || "";
      estado.municipio = p.get("municipio") || "";
      estado.instituicao = p.get("instituicao") || "";
      $("#busca").value = estado.busca;
      $("#f-periodo").value = estado.periodo;
      $("#f-grupo").value = estado.grupo;
      $("#f-formacao").value = estado.formacao;
      $("#f-municipio").value = estado.municipio;
      $("#f-instituicao").value = estado.instituicao;
    }
    return false;
  }

  /* ---------- exportações ---------- */
  function baixar(nome, conteudo, tipo) {
    const blob = new Blob([conteudo], { type: tipo });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = nome;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  function exportarCSV() {
    const cols = ["id", "taxon", "categoria", "periodo", "idade_ma", "formacao", "bacia", "municipio",
      "local_coleta", "site", "lat", "lon", "coord_precisao", "numero_catalogo", "armazenamento",
      "unidade_pesquisa", "descritor", "tipo_fonte", "doi", "observacoes"];
    const linhas = [cols.join(";")].concat(estado.filtrados.map((r) =>
      cols.map((c) => `"${String(r[c] == null ? "" : r[c]).replace(/"/g, '""')}"`).join(";")));
    /* BOM só no CSV: o Excel em pt-BR precisa dele para os acentos.
       Nunca no JSON — lá o BOM quebra json.load. */
    baixar(`paleo-rs-${VERSAO_BANCO}.csv`, "\ufeff" + linhas.join("\r\n"), "text/csv;charset=utf-8");
  }

  function exportarJSON() {
    baixar(`paleo-rs-${VERSAO_BANCO}.json`,
      JSON.stringify({ versao: VERSAO_BANCO, data: DATA_VERSAO, filtro: location.hash, registros: estado.filtrados }, null, 2),
      "application/json;charset=utf-8");
  }

  /* ---------- montagem dos filtros e da coluna ---------- */
  function popular(sel, valores, rotulo) {
    const s = $(sel);
    s.innerHTML = `<option value="">${rotulo}</option>` +
      valores.map((v) => `<option value="${esc(v)}">${esc(v)}</option>`).join("");
  }

  function unicos(f) {
    return Array.from(new Set(DB_REGISTROS.map(f))).sort((a, b) => a.localeCompare(b, "pt-BR"));
  }

  function montarColuna() {
    const alvo = $("#coluna");
    const usados = DB_PERIODOS.slice().sort((a, b) => b.ordem - a.ordem);
    alvo.innerHTML = usados.map((p) => {
      const n = DB_REGISTROS.filter((r) => r.periodo_chave === p.chave).length;
      return `<button type="button" class="coluna-faixa" data-periodo="${p.chave}" data-vazio="${n ? "nao" : "sim"}">` +
        `<span class="bloco" style="background:${p.cor}"></span>` +
        `<span>${esc(p.nome)}</span>` +
        `<span class="n">${n || "—"}</span></button>`;
    }).join("");
  }

  /* ---------- inicialização ---------- */
  function iniciar() {
    montarColuna();
    popular("#f-periodo", DB_PERIODOS.filter((p) => DB_REGISTROS.some((r) => r.periodo_chave === p.chave)).map((p) => p.nome), "todos os períodos");
    $("#f-periodo").innerHTML = `<option value="">todos os períodos</option>` +
      DB_PERIODOS.filter((p) => DB_REGISTROS.some((r) => r.periodo_chave === p.chave))
        .map((p) => `<option value="${p.chave}">${esc(p.nome)}</option>`).join("");
    popular("#f-grupo", unicos(grupoDe), "todos os grupos");
    popular("#f-formacao", unicos((r) => r.formacao), "todas as formações");
    popular("#f-municipio", unicos((r) => r.municipio), "todos os municípios");
    popular("#f-instituicao", DB_INSTITUICOES.map((i) => i.sigla), "todas as instituições");

    $("#total-registros").textContent = DB_REGISTROS.length;
    $("#total-sitios").textContent = DB_SITIOS.length;
    $("#total-municipios").textContent = new Set(DB_REGISTROS.map((r) => r.municipio)).size;
    $("#versao").textContent = `${VERSAO_BANCO} — ${DATA_VERSAO}`;

    $("#busca").addEventListener("input", (e) => { estado.busca = e.target.value; aplicarFiltros(); });
    ["periodo", "grupo", "formacao", "municipio", "instituicao"].forEach((k) => {
      $(`#f-${k}`).addEventListener("change", (e) => { estado[k] = e.target.value; aplicarFiltros(); });
    });
    $("#limpar").addEventListener("click", () => {
      Object.assign(estado, { busca: "", periodo: "", grupo: "", formacao: "", municipio: "", instituicao: "" });
      $("#busca").value = "";
      ["periodo", "grupo", "formacao", "municipio", "instituicao"].forEach((k) => { $(`#f-${k}`).value = ""; });
      aplicarFiltros();
    });
    $("#mais").addEventListener("click", renderizarLote);
    $("#csv").addEventListener("click", exportarCSV);
    $("#json").addEventListener("click", exportarJSON);

    $("#alternar").addEventListener("click", () => {
      estado.vista = estado.vista === "cartoes" ? "tabela" : "cartoes";
      $("#grade").hidden = estado.vista !== "cartoes";
      $("#tabela").hidden = estado.vista !== "tabela";
      $("#alternar").textContent = estado.vista === "cartoes" ? "Ver como tabela" : "Ver como cartões";
    });

    document.addEventListener("click", (ev) => {
      const cartao = ev.target.closest(".cartao, .ligacao-registro");
      if (cartao) { abrirFicha(cartao.dataset.id); return; }
      if (ev.target.closest(".coluna-faixa")) {
        const p = ev.target.closest(".coluna-faixa").dataset.periodo;
        estado.periodo = estado.periodo === p ? "" : p;
        $("#f-periodo").value = estado.periodo;
        aplicarFiltros();
        $("#catalogo").scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });

    $("#fechar-ficha").addEventListener("click", fecharFicha);
    $("#modal").addEventListener("click", (ev) => { if (ev.target.id === "modal") fecharFicha(); });
    document.addEventListener("keydown", (ev) => {
      if (ev.key === "Escape" && !$("#modal").hidden) fecharFicha();
      prenderFoco(ev);
    });

    const abriuFicha = lerHash();
    aplicarFiltros();
    if (abriuFicha) lerHash();
  }

  /* Zona morta temporal: com <script defer>, chamar iniciar() de imediato
     executaria antes das declarações acima. setTimeout(...,0) adia para
     depois da avaliação completa do módulo. */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    setTimeout(iniciar, 0);
  }
})();
