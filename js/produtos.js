/* =========================================================
   CONFIGURAÇÃO DA LOJA — edite só este arquivo no dia a dia
   ========================================================= */

const LOJA = {
  // Seu WhatsApp com DDI + DDD, só números. Ex.: '5535999999999'
  whatsapp: '5500000000000',

  // Mensagem que abre no WhatsApp ao clicar em "Pedir".
  // {produto} e {preco} são trocados automaticamente.
  mensagemPedido: 'Olá! Tenho interesse no produto {produto} ({preco}).',

  // Mensagem do botão "Fale comigo no WhatsApp"
  mensagemContato: 'Olá! Vim pelo seu link da bio.',

  // Limite de produtos exibidos no catálogo
  maxProdutos: 10,
};

// Categorias dos filtros. O id 'todos' mostra tudo.
const CATEGORIAS = [
  { id: 'todos', nome: 'Todos' },
  { id: 'novo',  nome: 'Novidades' },
  { id: 'top',   nome: 'Mais vendidos' },
  { id: 'promo', nome: 'Promoção' },
];

/*
  PRODUTOS (até 10)
  - nome:        nome do produto
  - preco:       preço em número (ex.: 49.9)
  - precoAntigo: opcional, aparece riscado (use em promoções)
  - categoria:   'novo', 'top' ou 'promo' (mesmos ids de CATEGORIAS)
  - foto:        caminho da imagem, ex.: 'img/produto-01.jpg' (deixe '' para o marcador)
*/
const PRODUTOS = [
  { nome: '[Produto 01]', preco: 0, categoria: 'novo',  foto: '' },
  { nome: '[Produto 02]', preco: 0, categoria: 'top',   foto: '' },
  { nome: '[Produto 03]', preco: 0, precoAntigo: 0, categoria: 'promo', foto: '' },
  { nome: '[Produto 04]', preco: 0, categoria: 'top',   foto: '' },
  { nome: '[Produto 05]', preco: 0, categoria: 'novo',  foto: '' },
  { nome: '[Produto 06]', preco: 0, precoAntigo: 0, categoria: 'promo', foto: '' },
  { nome: '[Produto 07]', preco: 0, categoria: 'top',   foto: '' },
  { nome: '[Produto 08]', preco: 0, categoria: 'novo',  foto: '' },
  { nome: '[Produto 09]', preco: 0, categoria: 'top',   foto: '' },
  { nome: '[Produto 10]', preco: 0, precoAntigo: 0, categoria: 'promo', foto: '' },
];
