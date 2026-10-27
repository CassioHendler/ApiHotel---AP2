/**
 * Hotel Paradiso - Gestão de quartos integrada à API (JavaScript puro).
 * Todas as operações usam fetch na mesma origem: GET/POST/PUT/DELETE em /api/quartos.
 * Nenhum dado fictício: a lista vem do banco SQLite via Entity Framework Core.
 */
const API = "/api/quartos";

document.addEventListener("DOMContentLoaded", () => {
  let quartos = [];

  const lista = document.getElementById("lista-quartos");
  const stats = document.getElementById("stats-container");
  const form = document.getElementById("form-quarto");
  const inputId = document.getElementById("quarto-id");
  const inputTitulo = document.getElementById("titulo-quarto");
  const selectDisp = document.getElementById("disponibilidade-quarto");
  const feedback = document.getElementById("mensagem-feedback");
  const tituloForm = document.getElementById("form-heading");
  const textoBtn = document.getElementById("btn-cadastrar-texto");
  const btnSalvar = document.getElementById("btn-cadastrar");
  const btnCancelar = document.getElementById("btn-cancelar");

  // Envia a requisição e lança erro com mensagem clara se o status não for 2xx
  async function chamar(url, opcoes) {
    let resp;
    try {
      resp = await fetch(url, opcoes);
    } catch {
      throw new Error("Não foi possível conectar à API. Verifique se ela está em execução.");
    }
    if (!resp.ok) {
      let detalhe = "";
      try { detalhe = (await resp.json()).erro || ""; } catch { /* sem corpo JSON */ }
      const erro = new Error(detalhe || `A API respondeu com status ${resp.status}.`);
      erro.status = resp.status;
      throw erro;
    }
    return resp.status === 204 ? null : resp.json();
  }

  function mostrar(mensagem, tipo) {
    feedback.textContent = "";
    const alerta = document.createElement("div");
    alerta.className = `alert alert-${tipo}`;
    alerta.setAttribute("role", "alert");
    const texto = document.createElement("div");
    texto.textContent = mensagem; // textContent: nunca interpreta HTML
    alerta.appendChild(texto);
    feedback.appendChild(alerta);
  }

  function pill(texto, cor) {
    const s = document.createElement("span");
    s.className = "stat-pill";
    if (cor) s.style.color = cor;
    s.textContent = texto;
    return s;
  }

  function renderizar() {
    const livres = quartos.filter(q => q.disponivel).length;
    stats.replaceChildren(
      pill(`Total: ${quartos.length}`),
      pill(`Disponíveis: ${livres}`, "var(--color-success)"),
      pill(`Ocupados: ${quartos.length - livres}`, "var(--color-occupied)")
    );

    lista.replaceChildren();
    if (quartos.length === 0) {
      const vazio = document.createElement("div");
      vazio.className = "empty-state";
      vazio.textContent = "Nenhum quarto cadastrado. Use o formulário para cadastrar o primeiro.";
      lista.appendChild(vazio);
      return;
    }

    quartos.forEach(q => {
      const item = document.createElement("div");
      item.className = "room-item";
      item.setAttribute("role", "listitem");

      const info = document.createElement("div");
      info.className = "room-info";
      const tag = document.createElement("span");
      tag.className = "room-id-tag";
      tag.textContent = `#${q.id}`;
      const nome = document.createElement("span");
      nome.className = "room-title-text";
      nome.textContent = q.titulo;
      info.append(tag, nome);

      const badge = document.createElement("span");
      badge.className = q.disponivel ? "badge badge-available" : "badge badge-occupied";
      badge.textContent = q.disponivel ? "● Disponível" : "■ Ocupado";

      const acoes = document.createElement("div");
      acoes.className = "room-actions";
      acoes.append(
        botao(q.disponivel ? "Marcar ocupado" : "Liberar quarto", "btn-acao", () => alternar(q)),
        botao("Editar", "btn-acao", () => editar(q)),
        botao("Excluir", "btn-acao btn-excluir", () => excluir(q))
      );

      const direita = document.createElement("div");
      direita.className = "room-status-wrapper";
      direita.append(badge, acoes);

      item.append(info, direita);
      lista.appendChild(item);
    });
  }

  function botao(texto, classe, aoClicar) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = classe;
    b.textContent = texto;
    b.addEventListener("click", aoClicar);
    return b;
  }

  // GET /api/quartos
  async function carregar() {
    try {
      quartos = await chamar(API);
      renderizar();
    } catch (e) {
      lista.replaceChildren();
      const erro = document.createElement("div");
      erro.className = "empty-state";
      erro.textContent = `Erro ao carregar os quartos: ${e.message}`;
      lista.appendChild(erro);
      stats.replaceChildren();
    }
  }

  function sairDoModoEdicao() {
    form.reset();
    inputId.value = "";
    tituloForm.textContent = "Cadastrar novo quarto";
    textoBtn.textContent = "Cadastrar quarto";
    btnCancelar.hidden = true;
  }

  function editar(q) {
    inputId.value = q.id;
    inputTitulo.value = q.titulo;
    selectDisp.value = String(q.disponivel);
    tituloForm.textContent = `Editar quarto #${q.id}`;
    textoBtn.textContent = "Salvar alterações";
    btnCancelar.hidden = false;
    feedback.textContent = "";
    inputTitulo.focus();
  }

  // PUT /api/quartos/{id} (alternar disponibilidade direto na lista)
  async function alternar(q) {
    try {
      await chamar(`${API}/${q.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo: q.titulo, disponivel: !q.disponivel })
      });
      await carregar();
      mostrar(`Quarto #${q.id} atualizado.`, "success");
    } catch (e) {
      mostrar(`Não foi possível atualizar o quarto #${q.id}: ${e.message}`, "error");
      await carregar();
    }
  }

  // DELETE /api/quartos/{id}
  async function excluir(q) {
    if (!confirm(`Excluir o quarto #${q.id} (${q.titulo})?`)) return;
    try {
      await chamar(`${API}/${q.id}`, { method: "DELETE" });
      if (inputId.value === String(q.id)) sairDoModoEdicao();
      await carregar();
      mostrar(`Quarto #${q.id} excluído.`, "success");
    } catch (e) {
      mostrar(`Não foi possível excluir o quarto #${q.id}: ${e.message}`, "error");
      await carregar();
    }
  }

  // POST /api/quartos (novo) ou PUT /api/quartos/{id} (edição)
  form.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const titulo = inputTitulo.value.trim();
    if (!titulo) {
      mostrar("Preencha o título do quarto antes de salvar.", "error");
      inputTitulo.focus();
      return;
    }

    const editando = inputId.value !== "";
    const corpo = JSON.stringify({ titulo, disponivel: selectDisp.value === "true" });
    btnSalvar.disabled = true;
    try {
      const salvo = await chamar(editando ? `${API}/${inputId.value}` : API, {
        method: editando ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: corpo
      });
      sairDoModoEdicao();
      await carregar();
      mostrar(`Quarto #${salvo.id} ${editando ? "atualizado" : "cadastrado"} com sucesso.`, "success");
    } catch (e) {
      mostrar(e.status === 404
        ? "Este quarto não existe mais. A lista foi recarregada."
        : `Não foi possível salvar: ${e.message}`, "error");
      if (e.status === 404) { sairDoModoEdicao(); await carregar(); }
    } finally {
      btnSalvar.disabled = false;
    }
  });

  btnCancelar.addEventListener("click", () => { sairDoModoEdicao(); feedback.textContent = ""; });

  carregar();
});
