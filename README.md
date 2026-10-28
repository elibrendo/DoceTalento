# Link na bio + catálogo

Página estilo "link na bio" com botões de redes sociais e um catálogo de até 10 produtos, com pedidos pelo WhatsApp.

## Estrutura

```
link-na-bio/
├── index.html        → textos do topo, redes sociais e botões
├── css/style.css     → cores e visual (variáveis no topo do arquivo)
├── js/produtos.js    → SEU WHATSAPP, CATEGORIAS E PRODUTOS
├── js/app.js         → lógica do catálogo e filtros (não precisa mexer)
└── img/              → coloque aqui a logo e as fotos dos produtos
```

## Como editar

1. **WhatsApp e produtos:** abra `js/produtos.js`, coloque seu número (DDI + DDD, só números) e preencha nome, preço, categoria e foto de cada produto.
2. **Nome, bio e redes:** em `index.html`, troque os textos entre colchetes e os links de Instagram, TikTok, YouTube e e-mail. Para remover uma rede, apague o `<a class="rede">` correspondente.
3. **Logo:** salve em `img/logo.png` e, no `index.html`, troque o `<span>Sua logo</span>` por `<img src="img/logo.png" alt="Logo da marca">`.
4. **Cor:** em `css/style.css`, mude `--destaque`.

## Visualizar

Abra o `index.html` no navegador, ou no VS Code use a extensão **Live Server** (botão "Go Live") para ver as mudanças ao vivo.

## Publicar

Funciona em qualquer hospedagem estática gratuita: GitHub Pages, Netlify ou Vercel (é só arrastar a pasta).
