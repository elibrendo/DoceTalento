(function () {
  const SELOS = { novo: 'Novo', top: 'Mais vendido', promo: 'Promo' };
  const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

  const grade = document.getElementById('grade');
  const filtros = document.getElementById('filtros');
  const contagem = document.getElementById('contagem');

  const produtos = PRODUTOS.slice(0, LOJA.maxProdutos);
  let categoriaAtual = 'todos';

  function linkWhatsApp(texto) {
    return 'https://wa.me/' + LOJA.whatsapp + '?text=' + encodeURIComponent(texto);
  }

  // Botão principal e ícone do WhatsApp usam o número configurado
  document.getElementById('link-whatsapp').href = linkWhatsApp(LOJA.mensagemContato);
  document.querySelectorAll('.rede[aria-label="WhatsApp"]').forEach(function (a) {
    a.href = linkWhatsApp(LOJA.mensagemContato);
  });

  function el(tag, classe, texto) {
    const n = document.createElement(tag);
    if (classe) n.className = classe;
    if (texto != null) n.textContent = texto;
    return n;
  }

  function cartao(p) {
    const art = el('article', 'produto');

    const foto = el('div', 'produto__foto ph');
    if (p.foto) {
      const img = document.createElement('img');
      img.src = p.foto;
      img.alt = p.nome;
      img.loading = 'lazy';
      foto.appendChild(img);
    } else {
      foto.appendChild(el('span', null, 'Foto do produto'));
    }
    if (SELOS[p.categoria]) {
      foto.appendChild(el('span', 'selo' + (p.categoria === 'promo' ? ' selo--promo' : ''), SELOS[p.categoria]));
    }
    art.appendChild(foto);

    const info = el('div', 'produto__info');
    info.appendChild(el('h3', 'produto__nome', p.nome));

    const precos = el('div', 'produto__precos');
    precos.appendChild(el('span', 'preco', brl.format(p.preco)));
    if (p.precoAntigo != null) {
      precos.appendChild(el('span', 'preco--antigo', brl.format(p.precoAntigo)));
    }
    info.appendChild(precos);

    const pedir = el('a', 'pedir', 'Pedir');
    pedir.href = linkWhatsApp(
      LOJA.mensagemPedido.replace('{produto}', p.nome).replace('{preco}', brl.format(p.preco))
    );
    pedir.target = '_blank';
    pedir.rel = 'noopener';
    pedir.setAttribute('aria-label', 'Pedir ' + p.nome + ' pelo WhatsApp');
    info.appendChild(pedir);

    art.appendChild(info);
    return art;
  }

  function renderFiltros() {
    filtros.innerHTML = '';
    CATEGORIAS.forEach(function (c) {
      const b = el('button', 'filtro', c.nome);
      b.type = 'button';
      b.setAttribute('aria-pressed', String(c.id === categoriaAtual));
      b.addEventListener('click', function () {
        categoriaAtual = c.id;
        renderFiltros();
        renderGrade();
      });
      filtros.appendChild(b);
    });
  }

  function renderGrade() {
    const lista = categoriaAtual === 'todos'
      ? produtos
      : produtos.filter(function (p) { return p.categoria === categoriaAtual; });

    grade.innerHTML = '';
    if (!lista.length) {
      grade.appendChild(el('p', 'vazio', 'Nenhum produto nesta categoria.'));
    } else {
      lista.forEach(function (p) { grade.appendChild(cartao(p)); });
    }
    contagem.textContent = lista.length + (lista.length === 1 ? ' produto' : ' produtos');
  }

  renderFiltros();
  renderGrade();
})();
