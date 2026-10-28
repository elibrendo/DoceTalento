// Gera a imagem (PNG) do resumo do pedido usando canvas.
(function () {
  const COR = {
    chocolate: '#502910',
    creme: '#FFF9EF',
    cremeEscuro: '#F1E8DA',
    suave: '#806D5D',
    borda: '#E8DCCB',
    destaque: '#A36E45',
  };
  const TITULO = "'Bodoni Moda', Georgia, serif";
  const TEXTO = "'DM Sans', Arial, sans-serif";
  const LARGURA = 1080;
  const MARGEM = 70;
  const ALTURA_TOPO = 340;
  const ALTURA_ITEM = 170;
  const FOTO = 130;

  const imagens = {};

  function carregar(src) {
    if (!src) return Promise.resolve(null);
    if (!imagens[src]) {
      imagens[src] = new Promise(function (resolve) {
        const img = new Image();
        img.onload = function () { resolve(img); };
        img.onerror = function () { resolve(null); };
        img.src = src;
      });
    }
    return imagens[src];
  }

  function fontes() {
    if (!document.fonts || !document.fonts.load) return Promise.resolve();
    return Promise.all([
      document.fonts.load("500 36px 'Bodoni Moda'"),
      document.fonts.load("400 28px 'DM Sans'"),
      document.fonts.load("700 28px 'DM Sans'"),
    ]).catch(function () { /* usa a fonte reserva */ });
  }

  // Deixa logo, fotos e fontes prontos para a geração ser instantânea
  function preparar(fotos) {
    return Promise.all([fontes(), carregar('img/logo.png')].concat(fotos.map(carregar)));
  }

  function retangulo(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function quebrar(ctx, texto, larguraMax, maxLinhas) {
    const palavras = texto.split(' ');
    const linhas = [];
    let atual = '';
    palavras.forEach(function (p) {
      const teste = atual ? atual + ' ' + p : p;
      if (ctx.measureText(teste).width > larguraMax && atual) {
        linhas.push(atual);
        atual = p;
      } else {
        atual = teste;
      }
    });
    if (atual) linhas.push(atual);
    if (linhas.length > maxLinhas) {
      linhas.length = maxLinhas;
      linhas[maxLinhas - 1] = linhas[maxLinhas - 1].replace(/.{0,2}$/, '…');
    }
    return linhas;
  }

  function dataHora() {
    const d = new Date();
    return d.toLocaleDateString('pt-BR') + ' às ' +
      d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  async function gerar(dados) {
    const fotos = await Promise.all(dados.itens.map(function (i) { return carregar(i.foto); }));
    const logo = await carregar('img/logo.png');
    await fontes();

    const linhasTotais = 1 + (dados.desconto > 0 ? 1 : 0);
    const alturaTotais = 40 + linhasTotais * 56 + 150;
    const alturaRodape = 190;
    const altura = ALTURA_TOPO + 250 + dados.itens.length * ALTURA_ITEM + alturaTotais + alturaRodape;

    const canvas = document.createElement('canvas');
    canvas.width = LARGURA;
    canvas.height = altura;
    const ctx = canvas.getContext('2d');

    // Fundo
    ctx.fillStyle = COR.creme;
    ctx.fillRect(0, 0, LARGURA, altura);

    // Topo com listras e logo
    ctx.fillStyle = COR.chocolate;
    ctx.fillRect(0, 0, LARGURA, ALTURA_TOPO);
    ctx.fillStyle = 'rgba(255, 249, 239, .055)';
    for (let x = 36; x < LARGURA; x += 52) ctx.fillRect(x, 0, 16, ALTURA_TOPO);
    if (logo) {
      const lw = 520;
      const lh = lw * logo.height / logo.width;
      ctx.drawImage(logo, (LARGURA - lw) / 2, (ALTURA_TOPO - lh) / 2, lw, lh);
    }

    // Título
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = COR.chocolate;
    ctx.font = '500 64px ' + TITULO;
    ctx.fillText('Resumo do pedido', LARGURA / 2, ALTURA_TOPO + 110);
    ctx.fillStyle = COR.suave;
    ctx.font = '400 28px ' + TEXTO;
    ctx.fillText('Pedido nº ' + dados.numero + '  ·  ' + dataHora(), LARGURA / 2, ALTURA_TOPO + 165);

    // Itens
    let y = ALTURA_TOPO + 220;
    ctx.strokeStyle = COR.borda;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(MARGEM, y);
    ctx.lineTo(LARGURA - MARGEM, y);
    ctx.stroke();

    dados.itens.forEach(function (item, idx) {
      const topo = y + 20;

      // Foto (ou emoji, se não houver)
      retangulo(ctx, MARGEM, topo, FOTO, FOTO, 18);
      ctx.save();
      ctx.clip();
      const foto = fotos[idx];
      if (foto) {
        const lado = Math.min(foto.width, foto.height);
        ctx.drawImage(foto, (foto.width - lado) / 2, (foto.height - lado) / 2, lado, lado, MARGEM, topo, FOTO, FOTO);
      } else {
        ctx.fillStyle = COR.cremeEscuro;
        ctx.fillRect(MARGEM, topo, FOTO, FOTO);
        ctx.fillStyle = COR.chocolate;
        ctx.font = '64px ' + TEXTO;
        ctx.textAlign = 'center';
        ctx.fillText(item.icone || '✦', MARGEM + FOTO / 2, topo + FOTO / 2 + 22);
      }
      ctx.restore();

      // Nome, quantidade e valor
      const xTexto = MARGEM + FOTO + 28;
      const larguraTexto = LARGURA - MARGEM - 200 - xTexto;
      ctx.textAlign = 'left';
      ctx.fillStyle = COR.chocolate;
      ctx.font = '500 36px ' + TITULO;
      const linhas = quebrar(ctx, item.nome, larguraTexto, 2);
      linhas.forEach(function (l, i) { ctx.fillText(l, xTexto, topo + 44 + i * 42); });
      ctx.fillStyle = COR.suave;
      ctx.font = '400 28px ' + TEXTO;
      ctx.fillText(item.qtd + ' × ' + dados.formatar(item.unit), xTexto, topo + 44 + linhas.length * 42 + 8);

      ctx.textAlign = 'right';
      ctx.fillStyle = COR.chocolate;
      ctx.font = '700 34px ' + TEXTO;
      ctx.fillText(dados.formatar(item.total), LARGURA - MARGEM, topo + 52);

      y += ALTURA_ITEM;
      ctx.strokeStyle = COR.borda;
      ctx.beginPath();
      ctx.moveTo(MARGEM, y);
      ctx.lineTo(LARGURA - MARGEM, y);
      ctx.stroke();
    });

    // Subtotal e desconto
    y += 56;
    function linhaTotal(rotulo, valor, cor) {
      ctx.textAlign = 'left';
      ctx.fillStyle = COR.suave;
      ctx.font = '400 30px ' + TEXTO;
      ctx.fillText(rotulo, MARGEM, y);
      ctx.textAlign = 'right';
      ctx.fillStyle = cor || COR.chocolate;
      ctx.font = '700 30px ' + TEXTO;
      ctx.fillText(valor, LARGURA - MARGEM, y);
      y += 56;
    }
    linhaTotal('Subtotal', dados.formatar(dados.subtotal));
    if (dados.desconto > 0) {
      linhaTotal('Cupom ' + dados.cupom, '-' + dados.formatar(dados.desconto), '#4C7A3A');
    }

    // Total em destaque
    y += 4;
    retangulo(ctx, MARGEM, y, LARGURA - MARGEM * 2, 110, 20);
    ctx.fillStyle = COR.chocolate;
    ctx.fill();
    ctx.textAlign = 'left';
    ctx.fillStyle = COR.creme;
    ctx.font = '500 40px ' + TITULO;
    ctx.fillText('Total', MARGEM + 36, y + 70);
    ctx.textAlign = 'right';
    ctx.font = '500 56px ' + TITULO;
    ctx.fillText(dados.formatar(dados.total), LARGURA - MARGEM - 36, y + 74);
    y += 110;

    // Rodapé
    const topoRodape = altura - alturaRodape;
    ctx.fillStyle = COR.chocolate;
    ctx.fillRect(0, topoRodape, LARGURA, alturaRodape);
    ctx.textAlign = 'center';
    ctx.fillStyle = COR.creme;
    ctx.font = '500 38px ' + TITULO;
    ctx.fillText('Com carinho, do nosso forno para você.', LARGURA / 2, topoRodape + 85);
    ctx.fillStyle = 'rgba(255, 249, 239, .8)';
    ctx.font = '400 28px ' + TEXTO;
    ctx.fillText('Doce Talento  ·  @docetalento.dt', LARGURA / 2, topoRodape + 135);

    return new Promise(function (resolve, reject) {
      canvas.toBlob(function (blob) {
        if (blob) resolve(blob); else reject(new Error('Não foi possível gerar a imagem.'));
      }, 'image/png');
    });
  }

  window.Comprovante = { preparar: preparar, gerar: gerar };
})();
