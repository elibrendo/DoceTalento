const LOJA = {
  whatsapp: '5535998380259',
  mensagemPedido: 'Olá! Gostaria de fazer o seguinte pedido:',
  mensagemContato: 'Olá! Vim pelo link da Doce Talento.',
  maxProdutos: 50,
};

// tipo: 'percentual' (valor em %) ou 'fixo' (valor em R$). Códigos em MAIÚSCULAS.
const CUPONS = [
  { codigo: 'TESTE', tipo: 'percentual', valor: 10 },
];

const CATEGORIAS = [
  { id: 'todos', nome: 'Tudo' },
  { id: 'bolachinhas', nome: 'Bolachinhas' },
  { id: 'doces', nome: 'Doces' },
  { id: 'pudins', nome: 'Pudins' },
];

// Cada produto tem:
//   midias: lista de arquivos (fotos .jpeg/.jpg ou vídeos .mp4). Mais de um vira galeria de arrastar.
//   opcoes: tamanhos/quantidades, cada um com rótulo e preço. Com uma opção só, não aparece seletor.
const KG = [
  { rotulo: '1 kg', preco: 38 },
  { rotulo: '500 g', preco: 19 },
  { rotulo: '250 g', preco: 9.5 },
];

const PRODUTOS = [
  {
    nome: 'Sequilhos',
    midias: ['img/novos/1.jpeg'],
    opcoes: KG,
    categoria: 'bolachinhas',
  },
  {
    nome: 'Goiabinha',
    midias: ['img/novos/2.jpeg'],
    opcoes: KG,
    categoria: 'bolachinhas',
  },
  {
    nome: 'Bolachinha de coco',
    midias: ['img/novos/3.jpeg'],
    opcoes: KG,
    categoria: 'bolachinhas',
  },
  {
    nome: 'Bolachinha de queijo',
    midias: ['img/novos/4.jpeg'],
    opcoes: KG,
    categoria: 'bolachinhas',
  },
  {
    nome: 'Bolachinha de chocolate',
    midias: ['img/novos/5.jpeg'],
    opcoes: [
      { rotulo: '400 g', preco: 19 },
      { rotulo: '200 g', preco: 10 },
    ],
    categoria: 'bolachinhas',
  },
  {
    nome: 'Bolachinha de limão',
    midias: ['img/novos/6.jpeg'],
    opcoes: KG,
    categoria: 'bolachinhas',
  },
  {
    nome: 'Brownie',
    descricao: 'Consulte os sabores disponíveis.',
    midias: ['img/novos/7.jpeg', 'img/novos/8.jpeg', 'img/novos/9.jpeg'],
    opcoes: [{ rotulo: 'Unidade', preco: 12 }],
    categoria: 'doces',
  },
  {
    nome: 'Brownie nuvem',
    midias: ['img/novos/10.jpeg'],
    opcoes: [{ rotulo: 'Unidade', preco: 25 }],
    categoria: 'doces',
  },
  {
    nome: 'Palha italiana de Oreo',
    midias: ['img/novos/11.jpeg', 'img/novos/12.jpeg'],
    opcoes: [{ rotulo: 'Unidade', preco: 12 }],
    categoria: 'doces',
  },
  {
    nome: 'Bombom de brownie',
    descricao: 'Consulte os recheios disponíveis.',
    midias: ['img/novos/13.jpeg', 'img/novos/14.jpeg', 'img/novos/15.jpeg'],
    opcoes: [{ rotulo: 'Unidade', preco: 13 }],
    categoria: 'doces',
  },
  {
    nome: 'Pão de mel',
    descricao: 'Recheio de doce de leite.',
    midias: ['img/novos/16.jpeg', 'img/novos/17.jpeg', 'img/novos/18.mp4'],
    opcoes: [{ rotulo: 'Unidade', preco: 10 }],
    categoria: 'doces',
  },
  {
    nome: 'Cones',
    descricao: 'Consulte os sabores disponíveis.',
    midias: ['img/novos/19.jpeg', 'img/novos/20.jpeg', 'img/novos/21.jpeg', 'img/novos/22.mp4'],
    opcoes: [
      { rotulo: '1 unidade', preco: 12 },
      { rotulo: '2 unidades', preco: 20 },
    ],
    categoria: 'doces',
  },
  {
    nome: 'Bombom de morango',
    midias: ['img/novos/23.jpeg', 'img/novos/24.mp4'],
    opcoes: [{ rotulo: 'Unidade', preco: 10 }],
    categoria: 'doces',
  },
  {
    nome: 'Pudim',
    descricao: 'Porção aproximada de 8 fatias.',
    midias: ['img/pudim-pequeno.jpg'],
    opcoes: [{ rotulo: '900 g', preco: 35 }],
    categoria: 'pudins',
  },
  {
    nome: 'Pudim grande',
    descricao: 'Porção aproximada de 16 fatias.',
    midias: ['img/pudim-grande.jpg'],
    opcoes: [{ rotulo: '1,6 kg', preco: 45 }],
    categoria: 'pudins',
  },
];
