/* =====================================================================
   Paleo-RS — js/app.js
   Só código. Nenhum dado aqui: tudo vem de js/dados.js e js/malha.js.
   Nenhum número escrito à mão no HTML: as contagens saem do banco.
   ===================================================================== */

(function () {
  "use strict";

  const FATIA = 60;   // cartões por quadro de animação, não por clique
  const ABAS = ["inicio", "catalogo", "mapa", "periodos", "instituicoes", "sobre"];

  /* Autoria guardada em partes: cada norma monta o nome de um jeito. */
  const AUTORIA = [{ sobrenome: "Benk", nomes: "Brenno Alef" }];
  const OBRA = {
    titulo: "Paleo-RS: Banco de Dados Paleontológico do Rio Grande do Sul",
    subtitulo: "Banco de Dados Paleontológico do Rio Grande do Sul",
    url: "https://brennobenk1.github.io/Paleo-RS/",
    ano: 2026
  };

  const estado = {
    aba: "inicio",
    busca: "", periodo: "", grupo: "", formacao: "", municipio: "", instituicao: "",
    vista: "cartoes", mostrados: 0, pendente: null, filtrados: [],
    mapa: { escala: 1, x: 0, y: 0, sitio: null }
  };

  let ultimoFoco = null;
  let mapaMontado = false;

  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

  const normalizar = (t) => String(t == null ? "" : t)
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  function esc(t) {
    const d = document.createElement("div");
    d.textContent = t == null ? "" : t;
    return d.innerHTML;
  }

  const corDoPeriodo = (chave) => {
    const p = DB_PERIODOS.find((x) => x.chave === chave);
    return p ? p.cor : "#B9C2B4";
  };

  /* "Genus species Autor, ano" -> nome científico + autoria, para o
     itálico cobrir só o que deve estar em itálico. */
  function partirTaxon(taxon) {
    const m = String(taxon).match(
      /^([A-Z][a-zé]+(?:\s+[a-z\u00C0-\u017F.]+)?(?:\s+(?:sp\.|indet\.|aff\.|cf\.))?)\s*(.*)$/);
    return m ? { nome: m[1], autoria: m[2] || "" } : { nome: taxon, autoria: "" };
  }

  const grupoDe = (r) => String(r.categoria).split("—")[0].trim();

  /* "1 registro", "3 registros" — "registro(s)" é desleixo visível. */
  const plural = (n, um, muitos) => `${n} ${n === 1 ? um : muitos}`;

  /* "Fm. Santa Maria / Sequência Candelária (Membro Alemoa)" e
     "Fm. Santa Maria / Sequência Candelária" são a mesma unidade
     litoestratigráfica; listar as duas na linha do tempo é ruído. */
  const unidadeBase = (r) => String(r.formacao).split("/")[0].trim();

  /* ================= projeção — a mesma do gerador da malha ============ */
  const PROJ = (function () {
    const k = Math.cos(MAPA_CAIXA.lat0 * 0 + (MAPA_CAIXA.lat0 + MAPA_CAIXA.lat1) / 2 * Math.PI / 180);
    const ex = (MAPA_CAIXA.lon1 - MAPA_CAIXA.lon0) * k;
    const ey = (MAPA_CAIXA.lat1 - MAPA_CAIXA.lat0);
    const escala = Math.min(MAPA_LARGURA / ex, MAPA_ALTURA / ey);
    return {
      x: (lon) => (lon - MAPA_CAIXA.lon0) * k * escala + (MAPA_LARGURA - ex * escala) / 2,
      y: (lat) => (MAPA_CAIXA.lat1 - lat) * escala + (MAPA_ALTURA - ey * escala) / 2
    };
  })();

  /* ========================= CATÁLOGO ================================ */
  function aplicarFiltros(gravar) {
    const b = normalizar(estado.busca);
    estado.filtrados = DB_REGISTROS.filter((r) => {
      if (estado.periodo && r.periodo_chave !== estado.periodo) return false;
      if (estado.grupo && grupoDe(r) !== estado.grupo) return false;
      if (estado.formacao && r.formacao !== estado.formacao) return false;
      if (estado.municipio && r.municipio !== estado.municipio) return false;
      if (estado.instituicao &&
          !normalizar(r.armazenamento + " " + r.unidade_pesquisa).includes(normalizar(estado.instituicao))) return false;
      if (!b) return true;
      const alvo = normalizar([r.taxon, r.categoria, r.formacao, r.municipio, r.local_coleta,
        r.numero_catalogo, r.armazenamento, r.descritor, r.observacoes].join(" "));
      return b.split(/\s+/).every((t) => alvo.includes(t));
    });
    if (estado.pendente) { cancelAnimationFrame(estado.pendente); estado.pendente = null; }
    estado.mostrados = 0;
    $("#grade").innerHTML = "";
    $("#tabela-corpo").innerHTML = "";
    renderizarTudo();
    const n = estado.filtrados.length, total = DB_REGISTROS.length;
    $("#contagem").textContent = n === total
      ? `${total} ${total === 1 ? "registro" : "registros"}`
      : `${n} de ${total} registros`;
    $("#vazio").hidden = n > 0;
    sincronizarFitas();
    if (gravar !== false) gravarHash();
  }

  /* Renderiza TUDO. A fatia existe só para não travar a interface com
     centenas de cartões de uma vez: cada fatia entra num quadro de
     animação, e o navegador respira entre elas. Não há botão: o
     catálogo inteiro aparece sozinho. */
  function renderizarTudo() {
    const fc = document.createDocumentFragment(), ft = document.createDocumentFragment();
    const fim = Math.min(estado.mostrados + FATIA, estado.filtrados.length);
    for (let i = estado.mostrados; i < fim; i++) {
      fc.appendChild(montarCartao(estado.filtrados[i]));
      ft.appendChild(montarLinha(estado.filtrados[i]));
    }
    $("#grade").appendChild(fc);
    $("#tabela-corpo").appendChild(ft);
    estado.mostrados = fim;
    if (estado.mostrados < estado.filtrados.length) {
      /* guarda o pedido para poder cancelá-lo se o filtro mudar no meio */
      estado.pendente = requestAnimationFrame(renderizarTudo);
    } else {
      estado.pendente = null;
    }
  }

  function montarCartao(r) {
    const t = partirTaxon(r.taxon);
    const el = document.createElement("button");
    el.type = "button";
    el.className = "cartao";
    el.dataset.id = r.id;
    el.setAttribute("aria-label", `Abrir ficha de ${t.nome}, registro ${r.id}`);
    el.innerHTML =
      `<span class="faixa-periodo" style="background:${corDoPeriodo(r.periodo_chave)}"></span>` +
      `<span class="cartao-corpo">` +
        `<span class="taxon">${esc(t.nome)}${t.autoria ? ` <span class="autoria">${esc(t.autoria)}</span>` : ""}</span>` +
        `<dl>` +
          `<div><dt>Idade</dt><dd>${esc(r.periodo)}</dd></div>` +
          `<div><dt>Unidade</dt><dd>${esc(r.formacao)}</dd></div>` +
          `<div><dt>Município</dt><dd>${esc(r.municipio)}</dd></div>` +
          `<div><dt>Acervo</dt><dd>${esc(String(r.armazenamento).split(",")[0])}</dd></div>` +
        `</dl>` +
        `<span class="cartao-pe">` +
          `<span class="tombo">${esc(String(r.numero_catalogo).split(";")[0])}</span>` +
          `<span class="selo" data-fonte="${esc(r.tipo_fonte)}">${esc(r.tipo_fonte)}</span>` +
        `</span>` +
      `</span>`;
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

  /* =========================== FICHA ================================= */
  function abrirFicha(id) {
    const r = DB_REGISTROS.find((x) => x.id === Number(id));
    if (!r) return;
    ultimoFoco = document.activeElement;
    const t = partirTaxon(r.taxon);
    const bio = DB_BIOZONAS.find((z) => z.chave === r.biozona_chave);
    const perm = `${location.origin}${location.pathname}#/registro/${r.id}`;

    $("#ficha-titulo").innerHTML = `<i>${esc(t.nome)}</i> <span class="autoria">${esc(t.autoria)}</span>`;
    $("#ficha-corpo").innerHTML =
      `<span class="selo" data-fonte="${esc(r.tipo_fonte)}">${esc(r.tipo_fonte)}</span>` +
      `<dl>` +
      li("Categoria", r.categoria) +
      li("Idade", `${esc(r.periodo)} — ${esc(r.idade_ma)}`) +
      (bio ? li("Zona de assembleia", bio.nome) : "") +
      li("Formação", r.formacao) + li("Bacia", r.bacia) +
      li("Município", r.municipio) + li("Local de coleta", r.local_coleta) +
      li("Coordenada", `${r.lat.toFixed(4)}, ${r.lon.toFixed(4)} ` +
         `<span class="precisao" data-p="${esc(r.coord_precisao)}">${esc(r.coord_precisao)}</span>`) +
      li("Nº de catálogo", r.numero_catalogo) + li("Acervo", r.armazenamento) +
      li("Instituições", r.unidade_pesquisa) + li("Fonte", r.descritor) +
      li("DOI", r.doi ? `<a href="https://doi.org/${esc(r.doi)}" target="_blank" rel="noopener">${esc(r.doi)}</a>`
                      : "Não informado na fonte consultada") +
      li("Observações", r.observacoes) +
      (r.citacao_abnt ? li("Referência", r.citacao_abnt) : "") +
      `</dl>` +
      `<div class="ficha-acoes">` +
        `<button type="button" class="botao secundario" id="copiar-link">Copiar link da ficha</button>` +
        `<a class="botao secundario" id="reportar" target="_blank" rel="noopener">Reportar erro</a>` +
        `<button type="button" class="botao secundario" id="ver-no-mapa">Ver no mapa</button>` +
      `</div>`;

    $("#reportar").href = urlIssue(r, perm);
    $("#copiar-link").addEventListener("click", () => {
      navigator.clipboard.writeText(perm).then(() => {
        $("#copiar-link").textContent = "Link copiado";
        setTimeout(() => { $("#copiar-link").textContent = "Copiar link da ficha"; }, 2000);
      });
    });
    $("#ver-no-mapa").addEventListener("click", () => {
      fecharModal("#modal");
      irPara("mapa");
      selecionarSitio(r.site);
    });

    abrirModal("#modal", "#fechar-ficha");
    if (location.hash !== `#/registro/${r.id}`) history.replaceState(null, "", `#/registro/${r.id}`);
  }

  const li = (rot, val) =>
    `<div><dt>${esc(rot)}</dt><dd>${/[<]/.test(String(val)) ? val : esc(val)}</dd></div>`;

  function urlIssue(r, perm) {
    const corpo = [
      `Registro: #${r.id}`, `Táxon: ${r.taxon}`, `Permalink: ${perm}`,
      `Versão do banco: ${VERSAO_BANCO} (${DATA_VERSAO})`, `Fonte citada: ${r.descritor}`,
      "", "O que está errado:", "", "Fonte que sustenta a correção:", ""
    ].join("\n");
    return "https://github.com/brennobenk1/Paleo-RS/issues/new?title=" +
      encodeURIComponent(`Correção no registro #${r.id} — ${partirTaxon(r.taxon).nome}`) +
      "&body=" + encodeURIComponent(corpo);
  }

  /* ============================ MAPA ================================= */
  /* Sítios que compartilham ponto ficariam um debaixo do outro e alguns
     seriam inalcançáveis. Agrupa por PROXIMIDADE (não por coordenada
     idêntica — pares a 0,1 px escapavam) e distribui os coincidentes num
     anel dimensionado pelo maior raio do grupo. */
  function posicoesDosSitios() {
    const brutos = DB_SITIOS.map((s) => ({
      s, x: PROJ.x(s.lon), y: PROJ.y(s.lat), r: 4 + Math.sqrt(s.count) * 3.2
    }));
    const grupos = [];
    brutos.forEach((p) => {
      const g = grupos.find((gr) => gr.some((q) =>
        Math.hypot(q.x - p.x, q.y - p.y) < (q.r + p.r) * 0.9));
      if (g) g.push(p); else grupos.push([p]);
    });
    const saida = [];
    grupos.forEach((g) => {
      if (g.length === 1) { saida.push({ ...g[0], ox: g[0].x, oy: g[0].y }); return; }
      const cx = g.reduce((a, p) => a + p.x, 0) / g.length;
      const cy = g.reduce((a, p) => a + p.y, 0) / g.length;
      const maior = Math.max(...g.map((p) => p.r));
      /* raio do anel pela corda entre vizinhos, para dois círculos
         consecutivos nunca se encostarem */
      const corda = 2 * maior * 1.25;
      const raio = Math.max(maior * 1.6, corda / (2 * Math.sin(Math.PI / g.length)));
      g.forEach((p, i) => {
        const ang = (2 * Math.PI * i) / g.length - Math.PI / 2;
        saida.push({ ...p, ox: cx + raio * Math.cos(ang), oy: cy + raio * Math.sin(ang) });
      });
    });
    return saida;
  }

  function montarMapa() {
    if (mapaMontado) return;
    const svg = $("#mapa");
    svg.setAttribute("viewBox", `0 0 ${MAPA_LARGURA} ${MAPA_ALTURA}`);

    const comRegistro = new Set(DB_REGISTROS.map((r) => normalizar(r.municipio)));
    const contaMun = {};
    DB_REGISTROS.forEach((r) => {
      const k = normalizar(r.municipio);
      contaMun[k] = (contaMun[k] || 0) + 1;
    });

    let munHtml = "";
    DB_MUNICIPIOS.forEach((m) => {
      const k = normalizar(m.n);
      const tem = comRegistro.has(k);
      munHtml += `<path class="mun${tem ? " com-registro" : ""}" d="${m.d}" data-mun="${esc(m.n)}"` +
        (tem ? ` tabindex="0" role="button" aria-label="${esc(m.n)}: ${plural(contaMun[k], "registro", "registros")}"` : ' aria-hidden="true"') +
        `><title>${esc(m.n)}${tem ? ` — ${plural(contaMun[k], "registro", "registros")}` : ""}</title></path>`;
    });

    let sitioHtml = "";
    posicoesDosSitios().forEach((p) => {
      const deslocado = Math.hypot(p.ox - p.x, p.oy - p.y) > 1;
      if (deslocado) sitioHtml += `<line class="haste" x1="${p.x.toFixed(1)}" y1="${p.y.toFixed(1)}" x2="${p.ox.toFixed(1)}" y2="${p.oy.toFixed(1)}"/>`;
      sitioHtml += `<circle class="sitio" cx="${p.ox.toFixed(1)}" cy="${p.oy.toFixed(1)}" r="${p.r.toFixed(1)}"` +
        ` data-sitio="${esc(p.s.nome)}" tabindex="0" role="button"` +
        ` aria-label="${esc(p.s.nome)}, ${esc(p.s.municipio)}: ${plural(p.s.count, "registro", "registros")}"` +
        (p.s.coord_precisao === "regional" ? ' stroke-dasharray="3 2"' : "") +
        `><title>${esc(p.s.nome)} — ${plural(p.s.count, "registro", "registros")}</title></circle>`;
    });

    svg.innerHTML = `<g id="mapa-camadas">${munHtml}${sitioHtml}</g>`;
    $("#mapa-dica").hidden = true;
    $("#bacias-lista").innerHTML = DB_BACIAS.map((b) =>
      `<div class="bacia-item"><b>${esc(b.nome)}</b><span>${esc(b.idade)} · ${esc(b.unidades.join(", "))}</span></div>`
    ).join("");

    ligarZoom(svg);
    ligarDica(svg);
    mapaMontado = true;
  }

  /* Sem isto o clique no mapa era mudo: o painel lateral mudava, mas em
     tela estreita ele fica abaixo do mapa e a pessoa não via nada
     acontecer. A dica diz, no próprio ponto, o que está sob o cursor. */
  function ligarDica(svg) {
    const dica = $("#mapa-dica");
    const caixa = svg.parentElement;

    function conteudo(alvo) {
      if (alvo.classList.contains("sitio")) {
        const s = DB_SITIOS.find((x) => x.nome === alvo.dataset.sitio);
        if (!s) return null;
        return `<b>${esc(s.nome)}</b><span>${esc(s.municipio)}</span>` +
               `<em>${plural(s.count, "registro", "registros")} · coordenada ${esc(s.coord_precisao)}</em>`;
      }
      const nome = alvo.dataset.mun;
      const regs = DB_REGISTROS.filter((r) => normalizar(r.municipio) === normalizar(nome));
      const sitios = new Set(regs.map((r) => r.site)).size;
      return `<b>${esc(nome)}</b>` +
             `<em>${plural(regs.length, "registro", "registros")} em ${plural(sitios, "sítio", "sítios")}</em>`;
    }

    function mostrar(alvo, ev) {
      const html = conteudo(alvo);
      if (!html) return;
      dica.innerHTML = html;
      dica.hidden = false;
      const r = caixa.getBoundingClientRect();
      let x = ev.clientX - r.left, y = ev.clientY - r.top;
      /* mantém a dica dentro da caixa do mapa */
      const larg = dica.offsetWidth || 180;
      x = Math.min(Math.max(x, larg / 2 + 6), r.width - larg / 2 - 6);
      y = Math.max(y, dica.offsetHeight + 14);
      dica.style.left = x + "px";
      dica.style.top = y + "px";
    }

    svg.addEventListener("pointermove", (ev) => {
      const alvo = ev.target.closest && ev.target.closest(".sitio, .mun.com-registro");
      if (alvo) mostrar(alvo, ev); else dica.hidden = true;
    });
    svg.addEventListener("pointerleave", () => { dica.hidden = true; });

    /* teclado: a dica acompanha o foco, senão a camada fica muda para
       quem navega com Tab */
    svg.addEventListener("focusin", (ev) => {
      const alvo = ev.target;
      if (!alvo.classList || !(alvo.classList.contains("sitio") || alvo.classList.contains("com-registro"))) return;
      const b = alvo.getBoundingClientRect(), r = caixa.getBoundingClientRect();
      mostrar(alvo, { clientX: b.left + b.width / 2, clientY: b.top + Math.min(b.height / 2, 40) });
    });
    svg.addEventListener("focusout", () => { dica.hidden = true; });
  }

  function ligarZoom(svg) {
    const camadas = $("#mapa-camadas");
    const aplicar = () => {
      const m = estado.mapa;
      camadas.setAttribute("transform", `translate(${m.x} ${m.y}) scale(${m.escala})`);
    };
    const limitar = (v) => Math.min(8, Math.max(1, v));

    function zoomPara(fator, cx, cy) {
      const m = estado.mapa;
      const nova = limitar(m.escala * fator);
      const k = nova / m.escala;
      m.x = cx - (cx - m.x) * k;
      m.y = cy - (cy - m.y) * k;
      m.escala = nova;
      if (m.escala === 1) { m.x = 0; m.y = 0; }
      aplicar();
    }

    function ponto(ev) {
      const cx = svg.getBoundingClientRect();
      return {
        x: (ev.clientX - cx.left) / cx.width * MAPA_LARGURA,
        y: (ev.clientY - cx.top) / cx.height * MAPA_ALTURA
      };
    }

    svg.addEventListener("wheel", (ev) => {
      ev.preventDefault();
      const p = ponto(ev);
      zoomPara(ev.deltaY < 0 ? 1.18 : 1 / 1.18, p.x, p.y);
    }, { passive: false });

    /* O arraste só captura o ponteiro DEPOIS de sair do lugar. Capturar
       já no pointerdown fazia o evento de clique nascer com o SVG inteiro
       como alvo, e clique em sítio ou município não selecionava nada. */
    const LIMIAR = 4;
    let pendente = false, arrastando = false, ini = null, base = null;

    svg.addEventListener("pointerdown", (ev) => {
      if (ev.button !== 0 && ev.pointerType === "mouse") return;
      pendente = true; arrastando = false;
      ini = ponto(ev);
      base = { x: estado.mapa.x, y: estado.mapa.y };
    });

    svg.addEventListener("pointermove", (ev) => {
      if (!pendente) return;
      const p = ponto(ev);
      const escalaTela = svg.getBoundingClientRect().width / MAPA_LARGURA;
      if (!arrastando &&
          Math.hypot(p.x - ini.x, p.y - ini.y) * escalaTela > LIMIAR) {
        arrastando = true;
        svg.classList.add("arrastando");
        try { svg.setPointerCapture(ev.pointerId); } catch (e) { /* ignora */ }
      }
      if (!arrastando) return;
      estado.mapa.x = base.x + (p.x - ini.x);
      estado.mapa.y = base.y + (p.y - ini.y);
      aplicar();
    });

    const soltar = (ev) => {
      pendente = false;
      if (arrastando) {
        svg.classList.remove("arrastando");
        try {
          if (ev.pointerId != null && svg.hasPointerCapture(ev.pointerId)) {
            svg.releasePointerCapture(ev.pointerId);
          }
        } catch (e) { /* ignora */ }
      }
      arrastando = false;
    };
    svg.addEventListener("pointerup", soltar);
    svg.addEventListener("pointercancel", soltar);

    $("#zoom-mais").addEventListener("click", () => zoomPara(1.4, MAPA_LARGURA / 2, MAPA_ALTURA / 2));
    $("#zoom-menos").addEventListener("click", () => zoomPara(1 / 1.4, MAPA_LARGURA / 2, MAPA_ALTURA / 2));
    $("#zoom-reset").addEventListener("click", () => {
      estado.mapa.escala = 1; estado.mapa.x = 0; estado.mapa.y = 0; aplicar();
    });
  }

  function selecionarSitio(nome) {
    montarMapa();
    const s = DB_SITIOS.find((x) => x.nome === nome);
    if (!s) return;
    estado.mapa.sitio = nome;
    $$(".sitio").forEach((c) => c.classList.toggle("ativo", c.dataset.sitio === nome));
    $$(".mun").forEach((m) => m.classList.toggle("selecionado",
      normalizar(m.dataset.mun) === normalizar(s.municipio)));
    const regs = DB_REGISTROS.filter((r) => r.site === nome);
    $("#sitio-detalhe").innerHTML =
      `<p><b>${esc(s.nome)}</b><br><span class="cidade">${esc(s.municipio)}</span></p>` +
      `<p class="precisao" data-p="${esc(s.coord_precisao)}">${s.lat.toFixed(4)}, ${s.lon.toFixed(4)} — ${esc(s.coord_precisao)}</p>` +
      `<ul class="lista-taxons">` +
      regs.map((r) => `<button type="button" class="ligacao-registro" data-id="${r.id}">${esc(partirTaxon(r.taxon).nome)}</button>`).join("") +
      `</ul>`;
    revelarPainel();
  }

  /* Em tela estreita o painel fica abaixo do mapa; sem isto o clique
     parece não fazer nada. */
  function revelarPainel() {
    if (window.innerWidth > 900) return;
    const p = $(".mapa-lateral");
    if (p && p.scrollIntoView) p.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function selecionarMunicipio(nome) {
    const regs = DB_REGISTROS.filter((r) => normalizar(r.municipio) === normalizar(nome));
    if (!regs.length) return;
    $("#sitio-detalhe").innerHTML =
      `<p><b>${esc(nome)}</b><br><span class="cidade">${plural(regs.length, "registro", "registros")} em ` +
      `${plural(new Set(regs.map((r) => r.site)).size, "sítio", "sítios")}</span></p>` +
      `<ul class="lista-taxons">` +
      regs.map((r) => `<button type="button" class="ligacao-registro" data-id="${r.id}">${esc(partirTaxon(r.taxon).nome)}</button>`).join("") +
      `</ul>` +
      `<p><button type="button" class="botao secundario" data-filtrar-municipio="${esc(nome)}">Ver no catálogo</button></p>`;
    estado.mapa.sitio = null;
    $$(".sitio").forEach((c) => c.classList.remove("ativo"));
    $$(".mun").forEach((m) => m.classList.toggle("selecionado",
      normalizar(m.dataset.mun) === normalizar(nome)));
    revelarPainel();
  }

  /* ========================== PERÍODOS =============================== */
  function montarPeriodos() {
    const maior = Math.max(1, ...DB_PERIODOS.map((p) => p.total_registros));
    $("#acordeao").innerHTML = DB_PERIODOS.slice().sort((a, b) => b.ordem - a.ordem).map((p) => {
      const regs = DB_REGISTROS.filter((r) => r.periodo_chave === p.chave);
      const bios = DB_BIOZONAS.filter((z) => regs.some((r) => r.biozona_chave === z.chave));
      const unidades = Array.from(new Set(regs.map(unidadeBase))).sort();
      return `<div class="periodo-bloco">` +
        `<button type="button" class="periodo-cab" data-periodo="${p.chave}" data-vazio="${p.total_registros ? "nao" : "sim"}" aria-expanded="false">` +
          `<span class="bloco" style="background:${p.cor}"></span>` +
          `<span><span class="nome">${esc(p.nome)}</span><br>` +
          `<span class="ma">${p.inicio_ma} – ${p.fim_ma} Ma</span></span>` +
          `<span class="barra"><i style="width:${(p.total_registros / maior * 100).toFixed(0)}%;background:${p.cor}"></i></span>` +
          `<span class="qtd">${p.total_registros || "—"}</span>` +
        `</button>` +
        `<div class="periodo-conteudo" hidden>` +
          (regs.length
            ? `<p class="conduz">Unidades com registro: ${esc(unidades.join(" · "))}</p>` +
              bios.map((z) => {
                const rz = regs.filter((r) => r.biozona_chave === z.chave);
                return `<div class="biozona"><b>${esc(z.nome)}</b><span>${esc(z.idade)} · ${plural(rz.length, "registro", "registros")}</span>` +
                  `<ul class="lista-taxons">` +
                  rz.map((r) => `<button type="button" class="ligacao-registro" data-id="${r.id}">${esc(partirTaxon(r.taxon).nome)}</button>`).join("") +
                  `</ul></div>`;
              }).join("") +
              (() => {
                const soltos = regs.filter((r) => !r.biozona_chave);
                return soltos.length
                  ? `<div class="biozona"><b>Sem zona de assembleia atribuída</b>` +
                    `<span>${plural(soltos.length, "registro", "registros")}</span><ul class="lista-taxons">` +
                    soltos.map((r) => `<button type="button" class="ligacao-registro" data-id="${r.id}">${esc(partirTaxon(r.taxon).nome)}</button>`).join("") +
                    `</ul></div>` : "";
              })()
            : `<p class="conduz">Nenhum registro neste período ainda. O período aparece na coluna mesmo assim — omitir intervalos vazios daria a impressão de que não existem no estado.</p>`) +
        `</div></div>`;
    }).join("");
  }

  /* Fitas de período: o mesmo filtro do select, mas visível e com a cor
     da coluna estratigráfica. Num catálogo de 154 cartões, é a forma
     mais rápida de cortar para o intervalo que interessa. */
  function montarFitas() {
    const usados = DB_PERIODOS.filter((p) => p.total_registros > 0)
      .sort((a, b) => a.ordem - b.ordem);
    $("#fitas").innerHTML = usados.map((p) =>
      `<button type="button" class="fita" data-periodo="${p.chave}" aria-pressed="false">` +
      `<span class="ponto" style="background:${p.cor}"></span>` +
      `<span>${esc(p.nome)}</span><span class="n">${p.total_registros}</span></button>`).join("");
  }

  function sincronizarFitas() {
    $$(".fita").forEach((f) =>
      f.setAttribute("aria-pressed", String(f.dataset.periodo === estado.periodo)));
  }

  function montarColunaInicio() {
    const alvo = $("#coluna-inicio");
    const maior = Math.max(1, ...DB_PERIODOS.map((p) => p.total_registros));
    alvo.innerHTML = `<h2 class="visualmente-oculto"></h2>` + DB_PERIODOS.slice().sort((a, b) => b.ordem - a.ordem)
      .map((p) => `<button type="button" class="coluna-faixa" data-periodo="${p.chave}" data-vazio="${p.total_registros ? "nao" : "sim"}">` +
        `<span class="bloco" style="background:${p.cor};width:${Math.max(14, p.total_registros / maior * 90)}px"></span>` +
        `<span>${esc(p.nome)}</span><span class="n">${p.total_registros || "—"}</span></button>`).join("");
  }

  /* ======================== INSTITUIÇÕES ============================= */
  function montarInstituicoes() {
    $("#lista-inst").innerHTML = DB_INSTITUICOES.map((i) => {
      const n = DB_REGISTROS.filter((r) =>
        (r.unidade_pesquisa + " " + r.armazenamento).includes(i.sigla)).length;
      return `<article class="inst">` +
        `<span class="sigla">${esc(i.sigla)}</span>` +
        `<h3>${esc(i.nome)}</h3>` +
        `<p class="cidade">${esc(i.cidade)}</p>` +
        `<p>${esc(i.acervo)}</p>` +
        `<p class="qtd-reg">${plural(n, "registro", "registros")} no banco</p>` +
        (i.site ? `<p><a href="${esc(i.site)}" target="_blank" rel="noopener">Site institucional</a></p>` : "") +
        `</article>`;
    }).join("");
  }

  /* =========================== CITAÇÃO =============================== */
  const MESES = ["jan.", "fev.", "mar.", "abr.", "maio", "jun.", "jul.", "ago.", "set.", "out.", "nov.", "dez."];

  function citacao(norma) {
    const hoje = new Date();
    const acessoABNT = `${hoje.getDate()} ${MESES[hoje.getMonth()]} ${hoje.getFullYear()}`;
    const acessoISO = hoje.toISOString().slice(0, 10);
    const a = AUTORIA[0];
    if (norma === "abnt") {
      return `${a.sobrenome.toUpperCase()}, ${a.nomes}. ${OBRA.titulo}. Versão ${VERSAO_BANCO}. ` +
        `${OBRA.ano}. Base de dados. Disponível em: ${OBRA.url}. Acesso em: ${acessoABNT}.`;
    }
    if (norma === "apa") {
      const iniciais = a.nomes.split(/\s+/).map((n) => n[0] + ".").join(" ");
      return `${a.sobrenome}, ${iniciais} (${OBRA.ano}). ${OBRA.titulo} (Versão ${VERSAO_BANCO}) ` +
        `[Base de dados]. ${OBRA.url}`;
    }
    return [
      "@misc{benk" + OBRA.ano + "paleors,",
      `  author       = {${a.sobrenome}, ${a.nomes}},`,
      `  title        = {{Paleo-RS}: ${OBRA.subtitulo}},`,
      `  year         = {${OBRA.ano}},`,
      `  version      = {${VERSAO_BANCO}},`,
      "  howpublished = {\\url{" + OBRA.url + "}},",
      `  note         = {Base de dados. Acesso em: ${acessoISO}}`,
      "}"
    ].join("\n");
  }

  function mostrarCitacao(norma) {
    $$(".guia").forEach((g) => g.setAttribute("aria-selected", String(g.dataset.norma === norma)));
    $("#citacao-texto").textContent = citacao(norma);
  }

  /* =========================== MODAIS =============================== */
  function abrirModal(sel, focoSel) {
    ultimoFoco = ultimoFoco || document.activeElement;
    $(sel).hidden = false;
    document.body.style.overflow = "hidden";
    $(focoSel).focus();
  }

  function fecharModal(sel) {
    $(sel).hidden = true;
    if ($("#modal").hidden && $("#modal-citar").hidden) document.body.style.overflow = "";
    if (ultimoFoco) { ultimoFoco.focus(); ultimoFoco = null; }
    if (location.hash.startsWith("#/registro/")) irPara(estado.aba);
  }

  function prenderFoco(ev) {
    if (ev.key !== "Tab") return;
    const caixa = [$("#modal"), $("#modal-citar")].find((m) => !m.hidden);
    if (!caixa) return;
    const alvos = $$('a[href], button, input, select, [tabindex]:not([tabindex="-1"])', caixa)
      .filter((e) => e.offsetParent !== null || e.getClientRects().length);
    if (!alvos.length) return;
    const pri = alvos[0], ult = alvos[alvos.length - 1];
    if (ev.shiftKey && document.activeElement === pri) { ev.preventDefault(); ult.focus(); }
    else if (!ev.shiftKey && document.activeElement === ult) { ev.preventDefault(); pri.focus(); }
  }

  /* ====================== ROTEAMENTO POR HASH ======================== */
  function irPara(aba, gravar) {
    if (!ABAS.includes(aba)) aba = "inicio";
    estado.aba = aba;
    ABAS.forEach((a) => { $(`#p-${a}`).hidden = a !== aba; });
    $$("#abas a").forEach((l) => {
      if (l.dataset.aba === aba) l.setAttribute("aria-current", "page");
      else l.removeAttribute("aria-current");
    });
    if (aba === "mapa") montarMapa();
    if (gravar !== false) gravarHash();
  }

  function gravarHash() {
    let novo = `#/${estado.aba}`;
    if (estado.aba === "catalogo") {
      const p = new URLSearchParams();
      if (estado.busca) p.set("q", estado.busca);
      ["periodo", "grupo", "formacao", "municipio", "instituicao"].forEach((k) => {
        if (estado[k]) p.set(k, estado[k]);
      });
      const s = p.toString();
      if (s) novo += `?${s}`;
    }
    if (location.hash !== novo) history.replaceState(null, "", novo);
  }

  function lerHash() {
    const h = decodeURIComponent(location.hash || "");
    const reg = h.match(/^#\/registro\/(\d+)/);
    if (reg) { irPara("catalogo", false); aplicarFiltros(false); abrirFicha(reg[1]); return true; }
    const m = h.match(/^#\/([a-z]+)(?:\?(.*))?$/);
    if (!m) { irPara("inicio", false); aplicarFiltros(false); return false; }
    if (m[2]) {
      const p = new URLSearchParams(m[2]);
      estado.busca = p.get("q") || "";
      ["periodo", "grupo", "formacao", "municipio", "instituicao"].forEach((k) => {
        estado[k] = p.get(k) || "";
      });
      $("#busca").value = estado.busca;
      ["periodo", "grupo", "formacao", "municipio", "instituicao"].forEach((k) => {
        $(`#f-${k}`).value = estado[k];
      });
    }
    irPara(m[1], false);
    aplicarFiltros(false);
    return false;
  }

  /* ========================= EXPORTAÇÕES ============================= */
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
       Nunca no JSON — lá o BOM faz json.load recusar o arquivo. */
    baixar(`paleo-rs-${VERSAO_BANCO}.csv`, "\ufeff" + linhas.join("\r\n"), "text/csv;charset=utf-8");
  }

  function exportarJSON() {
    baixar(`paleo-rs-${VERSAO_BANCO}.json`, JSON.stringify({
      versao: VERSAO_BANCO, data: DATA_VERSAO, filtro: location.hash,
      citacao: citacao("abnt"), registros: estado.filtrados
    }, null, 2), "application/json;charset=utf-8");
  }

  /* ======================== INICIALIZAÇÃO =========================== */
  function popular(sel, valores, rotulo) {
    $(sel).innerHTML = `<option value="">${rotulo}</option>` +
      valores.map((v) => `<option value="${esc(v)}">${esc(v)}</option>`).join("");
  }

  const unicos = (f) => Array.from(new Set(DB_REGISTROS.map(f)))
    .sort((a, b) => a.localeCompare(b, "pt-BR"));

  function iniciar() {
    /* contagens, sempre lidas do banco */
    const nMun = new Set(DB_REGISTROS.map((r) => r.municipio)).size;
    $("#h-registros").textContent = $("#c-registros").textContent =
      $("#rodape-registros").textContent = DB_REGISTROS.length;
    $("#h-sitios").textContent = DB_SITIOS.length;
    $("#h-municipios").textContent = nMun;
    $("#h-instituicoes").textContent = $("#c-instituicoes").textContent = DB_INSTITUICOES.length;
    $("#c-malha").textContent = DB_MUNICIPIOS.length;
    $("#rodape-versao").textContent = VERSAO_BANCO;

    $("#f-periodo").innerHTML = `<option value="">todos os períodos</option>` +
      DB_PERIODOS.filter((p) => DB_REGISTROS.some((r) => r.periodo_chave === p.chave))
        .map((p) => `<option value="${p.chave}">${esc(p.nome)}</option>`).join("");
    popular("#f-grupo", unicos(grupoDe), "todos os grupos");
    popular("#f-formacao", unicos((r) => r.formacao), "todas as formações");
    popular("#f-municipio", unicos((r) => r.municipio), "todos os municípios");
    popular("#f-instituicao", DB_INSTITUICOES.map((i) => i.sigla), "todas as instituições");

    montarFitas();
    montarColunaInicio();
    montarPeriodos();
    montarInstituicoes();
    mostrarCitacao("abnt");

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
    $("#csv").addEventListener("click", exportarCSV);
    $("#json").addEventListener("click", exportarJSON);
    $("#alternar").addEventListener("click", () => {
      estado.vista = estado.vista === "cartoes" ? "tabela" : "cartoes";
      $("#grade").hidden = estado.vista !== "cartoes";
      $("#tabela").hidden = estado.vista !== "tabela";
      $("#alternar").textContent = estado.vista === "cartoes" ? "Ver como tabela" : "Ver como cartões";
    });

    $("#abrir-citar").addEventListener("click", () => abrirModal("#modal-citar", "#fechar-citar"));
    $("#fechar-citar").addEventListener("click", () => fecharModal("#modal-citar"));
    $("#fechar-ficha").addEventListener("click", () => fecharModal("#modal"));
    $("#copiar-citacao").addEventListener("click", () => {
      navigator.clipboard.writeText($("#citacao-texto").textContent).then(() => {
        $("#copiar-citacao").textContent = "Copiado";
        setTimeout(() => { $("#copiar-citacao").textContent = "Copiar"; }, 2000);
      });
    });

    document.addEventListener("click", (ev) => {
      const guia = ev.target.closest(".guia");
      if (guia) { mostrarCitacao(guia.dataset.norma); return; }

      const aba = ev.target.closest("#abas a, .cartela, .acoes-heroi a, .marca-bloco");
      if (aba && aba.getAttribute("href") && aba.getAttribute("href").startsWith("#/")) {
        ev.preventDefault();
        irPara(aba.getAttribute("href").slice(2));
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      const item = ev.target.closest(".cartao, .ligacao-registro");
      if (item) { abrirFicha(item.dataset.id); return; }

      const fita = ev.target.closest(".fita");
      if (fita) {
        estado.periodo = estado.periodo === fita.dataset.periodo ? "" : fita.dataset.periodo;
        $("#f-periodo").value = estado.periodo;
        aplicarFiltros();
        return;
      }

      const faixa = ev.target.closest(".coluna-faixa");
      if (faixa) {
        estado.periodo = estado.periodo === faixa.dataset.periodo ? "" : faixa.dataset.periodo;
        $("#f-periodo").value = estado.periodo;
        irPara("catalogo");
        aplicarFiltros();
        return;
      }

      const cab = ev.target.closest(".periodo-cab");
      if (cab) {
        const corpo = cab.nextElementSibling;
        const aberto = cab.getAttribute("aria-expanded") === "true";
        cab.setAttribute("aria-expanded", String(!aberto));
        corpo.hidden = aberto;
        return;
      }

      const sitio = ev.target.closest(".sitio");
      if (sitio) { selecionarSitio(sitio.dataset.sitio); return; }

      const mun = ev.target.closest(".mun.com-registro");
      if (mun) { selecionarMunicipio(mun.dataset.mun); return; }

      const filtrar = ev.target.closest("[data-filtrar-municipio]");
      if (filtrar) {
        estado.municipio = filtrar.dataset.filtrarMunicipio;
        $("#f-municipio").value = estado.municipio;
        irPara("catalogo");
        aplicarFiltros();
        return;
      }

      if (ev.target.id === "modal") fecharModal("#modal");
      if (ev.target.id === "modal-citar") fecharModal("#modal-citar");
    });

    /* SVG clicável precisa responder ao teclado: sem isto, a camada
       inteira do mapa fica inalcançável para quem não usa mouse. */
    document.addEventListener("keydown", (ev) => {
      if (ev.key === "Escape") {
        if (!$("#modal").hidden) fecharModal("#modal");
        else if (!$("#modal-citar").hidden) fecharModal("#modal-citar");
      }
      if ((ev.key === "Enter" || ev.key === " ") && ev.target.matches &&
          ev.target.matches(".sitio, .mun.com-registro")) {
        ev.preventDefault();
        if (ev.target.classList.contains("sitio")) selecionarSitio(ev.target.dataset.sitio);
        else selecionarMunicipio(ev.target.dataset.mun);
      }
      prenderFoco(ev);
    });

    window.addEventListener("hashchange", () => {
      if (!$("#modal").hidden || !$("#modal-citar").hidden) return;
      lerHash();
    });

    /* A barra de filtros gruda quando sai da vista, e o botão de voltar
       ao topo aparece depois de uma tela de rolagem. Ambos só existem
       porque o catálogo não tem mais paginação. */
    const filtros = $("#filtros"), aoTopo = $("#ao-topo");
    let topoFiltros = 0;
    const medir = () => {
      filtros.classList.remove("grudada");
      topoFiltros = filtros.getBoundingClientRect().top + window.scrollY;
    };
    medir();
    window.addEventListener("resize", medir);
    window.addEventListener("scroll", () => {
      if (estado.aba === "catalogo") {
        filtros.classList.toggle("grudada", window.scrollY > topoFiltros - 66);
      } else {
        filtros.classList.remove("grudada");
      }
      aoTopo.hidden = window.scrollY < window.innerHeight;
    }, { passive: true });
    aoTopo.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

    lerHash();
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
