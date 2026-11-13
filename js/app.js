(function () {
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

  // Chave de item no carrinho: "indiceDoProduto:indiceDaOpcao"
  function itemDe(chave) {
    const partes = String(chave).split(':');
    const p = produtos[partes[0]];
    const o = p && p.opcoes[partes[1]];
    return o ? { produto: p, opcao: o } : null;
  }

  function nomeCompleto(chave) {
    const it = itemDe(chave);
    const r = it.opcao.rotulo;
    return it.produto.nome + (r && r !== 'Unidade' ? ' (' + r + ')' : '');
  }

  function precoDe(chave) { return itemDe(chave).opcao.preco; }

  // ---------- Carrinho ----------
  const CHAVE = 'docetalento-carrinho-v2';
  let itens = {};      // { "produto:opcao": quantidade }
  let cupomAtivo = null;

  try {
    const salvo = JSON.parse(localStorage.getItem(CHAVE) || '{}');
    Object.keys(salvo.itens || {}).forEach(function (k) {
      const q = parseInt(salvo.itens[k], 10);
      if (itemDe(k) && q > 0) itens[k] = q;
    });
    cupomAtivo = CUPONS.find(function (c) { return c.codigo === salvo.cupom; }) || null;
  } catch (e) { /* sem armazenamento: segue vazio */ }

  function salvar() {
    try {
      localStorage.setItem(CHAVE, JSON.stringify({ itens: itens, cupom: cupomAtivo && cupomAtivo.codigo }));
    } catch (e) { /* ignora */ }
  }

  function calcular() {
    let subtotal = 0, qtd = 0;
    Object.keys(itens).forEach(function (i) {
      subtotal += precoDe(i) * itens[i];
      qtd += itens[i];
    });
    let desconto = 0;
    if (cupomAtivo) {
      desconto = cupomAtivo.tipo === 'percentual' ? subtotal * cupomAtivo.valor / 100 : cupomAtivo.valor;
      desconto = Math.min(desconto, subtotal);
    }
    return { subtotal: subtotal, desconto: desconto, total: subtotal - desconto, qtd: qtd };
  }

  function adicionar(i) {
    itens[i] = (itens[i] || 0) + 1;
    renderCarrinho();
  }

  function alterar(i, delta) {
    const q = (itens[i] || 0) + delta;
    if (q > 0) itens[i] = q; else delete itens[i];
    renderCarrinho();
  }

  const modal = document.getElementById('carrinho');
  const botaoCarrinho = document.getElementById('carrinho-abrir');
  const lista = document.getElementById('carrinho-itens');
  const cupomForm = document.getElementById('cupom-form');
  const cupomInput = document.getElementById('cupom-codigo');
  const cupomMsg = document.getElementById('cupom-msg');
  const linkPedir = document.getElementById('carrinho-pedir');

  function mensagemCupom(texto, erro) {
    cupomMsg.textContent = texto;
    cupomMsg.classList.toggle('cupom__msg--erro', !!erro);
  }

  function montarMensagem(t) {
    const linhas = [LOJA.mensagemPedido, ''];
    Object.keys(itens).forEach(function (i) {
      linhas.push('• ' + itens[i] + 'x ' + nomeCompleto(i) + ' — ' + brl.format(precoDe(i) * itens[i]));
    });
    linhas.push('');
    if (cupomAtivo) {
      linhas.push('Subtotal: ' + brl.format(t.subtotal));
      linhas.push('Cupom ' + cupomAtivo.codigo + ': -' + brl.format(t.desconto));
    }
    linhas.push('*Total: ' + brl.format(t.total) + '*');
    return linhas.join('\n');
  }

  function renderCarrinho() {
    const t = calcular();
    const vazio = t.qtd === 0;

    botaoCarrinho.hidden = vazio && modal.hidden;
    document.getElementById('carrinho-qtd').textContent = t.qtd;
    botaoCarrinho.setAttribute('aria-label', 'Abrir carrinho, ' + t.qtd + (t.qtd === 1 ? ' item' : ' itens'));

    lista.innerHTML = '';
    if (vazio) {
      lista.appendChild(el('li', 'itens__vazio', 'Seu carrinho está vazio.'));
    }
    Object.keys(itens).forEach(function (i) {
      const nome = nomeCompleto(i);
      const li = el('li', 'item');
      const txt = el('div', 'item__txt');
      txt.appendChild(el('strong', 'item__nome', nome));
      txt.appendChild(el('span', 'item__unit', brl.format(precoDe(i)) + ' cada'));
      li.appendChild(txt);

      const qtd = el('div', 'item__qtd');
      const menos = el('button', null, '−');
      menos.type = 'button';
      menos.setAttribute('aria-label', 'Diminuir quantidade de ' + nome);
      menos.addEventListener('click', function () { alterar(i, -1); });
      const mais = el('button', null, '+');
      mais.type = 'button';
      mais.setAttribute('aria-label', 'Aumentar quantidade de ' + nome);
      mais.addEventListener('click', function () { alterar(i, 1); });
      qtd.appendChild(menos);
      qtd.appendChild(el('span', null, String(itens[i])));
      qtd.appendChild(mais);
      li.appendChild(qtd);

      li.appendChild(el('span', 'item__total', brl.format(precoDe(i) * itens[i])));
      lista.appendChild(li);
    });

    document.getElementById('total-subtotal').textContent = brl.format(t.subtotal);
    document.getElementById('total-desconto-linha').hidden = !cupomAtivo;
    document.getElementById('total-desconto').textContent = '-' + brl.format(t.desconto);
    document.getElementById('total-final').textContent = brl.format(t.total);

    if (cupomAtivo) mensagemCupom('Cupom ' + cupomAtivo.codigo + ' aplicado.', false);

    linkPedir.href = vazio ? '#' : linkWhatsApp(montarMensagem(t));
    linkPedir.setAttribute('aria-disabled', String(vazio));
    linkPedir.classList.toggle('botao--desativado', vazio);
    salvar();
  }

  function abrir() {
    modal.hidden = false;
    document.body.classList.add('modal-aberto');
    modal.querySelector('.modal__fechar').focus();
  }

  function fechar() {
    modal.hidden = true;
    document.body.classList.remove('modal-aberto');
    renderCarrinho();
    botaoCarrinho.focus();
  }

  botaoCarrinho.addEventListener('click', abrir);
  modal.querySelectorAll('[data-fechar]').forEach(function (n) { n.addEventListener('click', fechar); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.hidden) fechar();
  });

  cupomForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const codigo = cupomInput.value.trim().toUpperCase();
    if (!codigo) return;
    const c = CUPONS.find(function (x) { return x.codigo === codigo; });
    if (!c) {
      mensagemCupom('Cupom inválido.', true);
      return;
    }
    cupomAtivo = c;
    cupomInput.value = '';
    renderCarrinho();
  });

  linkPedir.addEventListener('click', function (e) {
    if (calcular().qtd === 0) e.preventDefault();
  });

  document.getElementById('carrinho-limpar').addEventListener('click', function () {
    itens = {};
    cupomAtivo = null;
    mensagemCupom('', false);
    renderCarrinho();
  });

  // ---------- Galeria (arrastar para o lado, estilo Shopee) ----------
  const ehVideo = function (src) { return /\.(mp4|webm|mov)$/i.test(src); };

  // Toca o vídeo só quando ele está visível na tela; pausa ao sair
  const observadorVideo = 'IntersectionObserver' in window
    ? new IntersectionObserver(function (entradas) {
        entradas.forEach(function (e) {
          const v = e.target;
          if (e.isIntersecting && e.intersectionRatio >= 0.6) {
            const tentativa = v.play();
            if (tentativa && tentativa.catch) tentativa.catch(function () {});
          } else {
            v.pause();
          }
        });
      }, { threshold: [0, 0.6] })
    : null;

  function galeria(p) {
    const caixa = el('div', 'galeria');
    const trilho = el('div', 'galeria__trilho');
    caixa.appendChild(trilho);

    p.midias.forEach(function (src, n) {
      const slide = el('div', 'galeria__slide');
      if (ehVideo(src)) {
        const v = document.createElement('video');
        v.className = 'galeria__midia';
        v.src = src + '#t=0.1';
        v.muted = true;
        v.loop = true;
        v.playsInline = true;
        v.setAttribute('playsinline', '');
        v.preload = 'metadata';
        v.setAttribute('aria-label', 'Vídeo de ' + p.nome);
        slide.appendChild(v);
        slide.appendChild(el('span', 'galeria__selo', '▶ Vídeo'));

        const som = el('button', 'galeria__som', '🔇');
        som.type = 'button';
        som.setAttribute('aria-label', 'Ativar som do vídeo');
        som.addEventListener('click', function () {
          v.muted = !v.muted;
          som.textContent = v.muted ? '🔇' : '🔊';
          som.setAttribute('aria-label', v.muted ? 'Ativar som do vídeo' : 'Desativar som do vídeo');
          if (!v.muted) v.play();
        });
        slide.appendChild(som);
        if (observadorVideo) observadorVideo.observe(v);
      } else {
        const img = el('img', 'galeria__midia');
        img.src = src;
        img.alt = p.nome + (p.midias.length > 1 ? ' — foto ' + (n + 1) : '');
        img.loading = 'lazy';
        img.draggable = false;
        slide.appendChild(img);
      }
      trilho.appendChild(slide);
    });

    if (p.midias.length > 1) {
      const pontos = el('div', 'galeria__pontos');
      pontos.setAttribute('aria-hidden', 'true');
      p.midias.forEach(function () { pontos.appendChild(el('span', 'galeria__ponto')); });
      caixa.appendChild(pontos);

      const contador = el('span', 'galeria__contador', '1/' + p.midias.length);
      caixa.appendChild(contador);

      function irPara(n) {
        trilho.scrollTo({ left: n * trilho.clientWidth, behavior: 'smooth' });
      }
      function atual() {
        return Math.round(trilho.scrollLeft / Math.max(1, trilho.clientWidth));
      }

      const ant = el('button', 'galeria__seta galeria__seta--ant', '‹');
      ant.type = 'button';
      ant.setAttribute('aria-label', 'Foto anterior');
      ant.addEventListener('click', function () { irPara(Math.max(0, atual() - 1)); });
      const prox = el('button', 'galeria__seta galeria__seta--prox', '›');
      prox.type = 'button';
      prox.setAttribute('aria-label', 'Próxima foto');
      prox.addEventListener('click', function () { irPara(Math.min(p.midias.length - 1, atual() + 1)); });
      caixa.appendChild(ant);
      caixa.appendChild(prox);

      function marcar() {
        const n = atual();
        pontos.querySelectorAll('.galeria__ponto').forEach(function (d, k) {
          d.classList.toggle('galeria__ponto--ativo', k === n);
        });
        contador.textContent = (n + 1) + '/' + p.midias.length;
        ant.hidden = n === 0;
        prox.hidden = n === p.midias.length - 1;
      }
      trilho.addEventListener('scroll', marcar, { passive: true });
      marcar();
    }
    return caixa;
  }

  // ---------- Popup do produto ampliado ----------
  const zoom = el('div', 'zoom');
  zoom.hidden = true;
  const zoomFundo = el('div', 'zoom__fundo');
  const zoomCaixa = el('div', 'zoom__caixa');
  zoomCaixa.setAttribute('role', 'dialog');
  zoomCaixa.setAttribute('aria-modal', 'true');
  const zoomFechar = el('button', 'zoom__fechar', '×');
  zoomFechar.type = 'button';
  zoomFechar.setAttribute('aria-label', 'Fechar');
  const zoomConteudo = el('div', 'zoom__conteudo');
  zoomCaixa.appendChild(zoomConteudo);
  zoomCaixa.appendChild(zoomFechar);
  zoom.appendChild(zoomFundo);
  zoom.appendChild(zoomCaixa);
  document.body.appendChild(zoom);
  let zoomOrigem = null;

  function abrirZoom(p, opcao, origem) {
    zoomConteudo.innerHTML = '';
    zoomConteudo.appendChild(cartao(p, { grande: true, opcaoInicial: opcao }));
    zoomCaixa.setAttribute('aria-label', p.nome);
    zoomOrigem = origem;
    // Pausa os vídeos do cardápio enquanto o popup está aberto
    grade.querySelectorAll('video').forEach(function (v) { v.pause(); });
    zoom.hidden = false;
    document.body.classList.add('modal-aberto');
    zoomConteudo.scrollTop = 0;
    zoomFechar.focus();
  }

  function fecharZoom() {
    if (zoom.hidden) return;
    zoomConteudo.querySelectorAll('video').forEach(function (v) {
      v.pause();
      if (observadorVideo) observadorVideo.unobserve(v);
    });
    zoomConteudo.innerHTML = '';
    zoom.hidden = true;
    if (modal.hidden) document.body.classList.remove('modal-aberto');
    // Retoma os vídeos do cardápio que estiverem visíveis
    if (observadorVideo) {
      grade.querySelectorAll('video').forEach(function (v) {
        observadorVideo.unobserve(v);
        observadorVideo.observe(v);
      });
    }
    if (zoomOrigem) zoomOrigem.focus({ preventScroll: true });
  }

  zoomFechar.addEventListener('click', fecharZoom);
  zoomFundo.addEventListener('click', fecharZoom);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') fecharZoom();
  });

  function cartao(p, cfg) {
    cfg = cfg || {};
    const art = el('article', 'produto' + (cfg.grande ? ' produto--grande' : ''));
    const indice = produtos.indexOf(p);
    let opcaoAtual = cfg.opcaoInicial || 0;

    art.appendChild(galeria(p));

    if (!cfg.grande) {
      // Clicar no anúncio (fora dos botões) abre o popup ampliado
      art.classList.add('produto--clicavel');
      art.tabIndex = 0;
      art.setAttribute('aria-label', 'Ver ' + p.nome + ' ampliado');
      art.addEventListener('click', function (e) {
        if (e.target.closest('button')) return;
        abrirZoom(p, opcaoAtual, art);
      });
      art.addEventListener('keydown', function (e) {
        if (e.target === art && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          abrirZoom(p, opcaoAtual, art);
        }
      });
    }

    const info = el('div', 'produto__info');
    info.appendChild(el('h3', 'produto__nome', p.nome));
    if (p.descricao) info.appendChild(el('p', 'produto__descricao', p.descricao));

    if (p.opcoes.length > 1) {
      const grupo = el('div', 'opcoes');
      grupo.setAttribute('role', 'group');
      grupo.setAttribute('aria-label', 'Tamanho de ' + p.nome);
      p.opcoes.forEach(function (o, j) {
        const b = el('button', 'opcao', o.rotulo);
        b.type = 'button';
        b.setAttribute('aria-pressed', String(j === opcaoAtual));
        b.addEventListener('click', function () {
          opcaoAtual = j;
          grupo.querySelectorAll('.opcao').forEach(function (x, k) {
            x.setAttribute('aria-pressed', String(k === j));
          });
          atualizarPreco();
        });
        grupo.appendChild(b);
      });
      info.appendChild(grupo);
    } else if (p.opcoes[0].rotulo) {
      info.appendChild(el('p', 'produto__detalhe', p.opcoes[0].rotulo));
    }

    const precos = el('div', 'produto__precos');
    const preco = el('span', 'preco');
    precos.appendChild(preco);
    info.appendChild(precos);

    const pedir = el('button', 'pedir', 'Adicionar');
    pedir.type = 'button';

    function atualizarPreco() {
      preco.textContent = brl.format(p.opcoes[opcaoAtual].preco);
      pedir.setAttribute('aria-label', 'Adicionar ' + nomeCompleto(indice + ':' + opcaoAtual) + ' ao carrinho');
    }
    atualizarPreco();

    pedir.addEventListener('click', function () {
      adicionar(indice + ':' + opcaoAtual);
      pedir.textContent = 'Adicionado ✓';
      setTimeout(function () { pedir.textContent = 'Adicionar'; }, 1200);
    });
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

    if (observadorVideo) observadorVideo.disconnect();
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
  renderCarrinho();
})();
