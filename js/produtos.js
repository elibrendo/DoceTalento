const LOJA = {
  whatsapp: '5535998380259',
  mensagemPedido: 'Olá! Gostaria de fazer o seguinte pedido:',
  mensagemContato: 'Olá! Vim pelo link da Doce Talento.',
  maxProdutos: 10,
};

// tipo: 'percentual' (valor em %) ou 'fixo' (valor em R$). Códigos em MAIÚSCULAS.
const CUPONS = [
  { codigo: 'TESTE', tipo: 'percentual', valor: 10 },
];

const CATEGORIAS = [
  { id: 'todos', nome: 'Tudo' },
  { id: 'bolachinhas', nome: 'Bolachinhas' },
  { id: 'pudins', nome: 'Pudins' },
  { id: 'doces', nome: 'Doces' },
];

const PRODUTOS = [
  {
    nome: 'Bolachinhas caseiras',
    descricao: 'Nata, coco, limão, queijo, goiabinha e sequilhos.',
    detalhe: '250 g',
    foto: 'img/bolachinhas.jpg',
    preco: 8.5,
    categoria: 'bolachinhas',
    icone: '🍪',
  },
  {
    nome: 'Bolachinhas caseiras',
    descricao: 'Nata, coco, limão, queijo, goiabinha e sequilhos.',
    detalhe: '500 g',
    foto: 'img/bolachinhas.jpg',
    preco: 17,
    categoria: 'bolachinhas',
    icone: '🍪',
  },
  {
    nome: 'Bolachinhas caseiras',
    descricao: 'Nata, coco, limão, queijo, goiabinha e sequilhos.',
    detalhe: '1 kg',
    foto: 'img/bolachinhas.jpg',
    preco: 34,
    categoria: 'bolachinhas',
    icone: '🍪',
  },
  {
    nome: 'Bolachinhas de chocolate',
    detalhe: '200 g',
    foto: 'img/bolachinhas-chocolate.jpg',
    preco: 9,
    categoria: 'bolachinhas',
    icone: '🍫',
  },
  {
    nome: 'Bolachinhas de chocolate',
    detalhe: '400 g',
    foto: 'img/bolachinhas-chocolate.jpg',
    preco: 17,
    categoria: 'bolachinhas',
    icone: '🍫',
  },
  {
    nome: 'Pudim',
    descricao: 'Porção aproximada de 8 fatias.',
    detalhe: '900 g',
    foto: 'img/pudim-pequeno.jpg',
    preco: 35,
    categoria: 'pudins',
    icone: '🍮',
  },
  {
    nome: 'Pudim',
    descricao: 'Porção aproximada de 16 fatias.',
    detalhe: '1,6 kg',
    foto: 'img/pudim-grande.jpg',
    preco: 45,
    categoria: 'pudins',
    icone: '🍮',
  },
  {
    nome: 'Pão de mel',
    foto: 'img/pao-de-mel.jpg',
    descricao: 'Macio e aromático, recheado com doce de leite e coberto com chocolate.',
    detalhe: 'Unidade',
    preco: 10,
    categoria: 'doces',
    icone: '🍯',
  },
  {
    nome: 'Bombom de brownie',
    foto: 'img/bombom-brownie.jpg',
    descricao: 'Brownie com brigadeiro tradicional e de Ninho, finalizado com chocolate.',
    detalhe: 'Unidade',
    preco: 13,
    categoria: 'doces',
    icone: '🍫',
  },
];
