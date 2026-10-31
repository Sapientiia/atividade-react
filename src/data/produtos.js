/** Catálogo fictício usado para demonstrar Paginação, Menu Suspenso (filtro), Abas e carrinho. */
export const CATEGORIAS = ['Eletrônicos', 'Livros', 'Casa', 'Esportes']

/** Ícone e cor de traço de cada categoria (substituem fotos de produto sobre fundo cinza claro). */
export const ESTILO_CATEGORIA = {
  Eletrônicos: { icone: 'fone', cor: '#0e606c' },
  Livros: { icone: 'livro', cor: '#8a5a00' },
  Casa: { icone: 'lampada', cor: '#2d6a4f' },
  Esportes: { icone: 'halter', cor: '#9b2226' },
}

const p = (id, nome, categoria, preco, extras = {}) => ({
  id,
  nome,
  categoria,
  preco,
  avaliacao: extras.avaliacao ?? 4,
  avaliacoes: extras.avaliacoes ?? 12,
  destaque: extras.destaque ?? null,
  precoAntigo: extras.precoAntigo ?? null,
  descricao:
    extras.descricao ??
    `${nome} com acabamento premium e garantia de 12 meses. Produto fictício criado para demonstrar os componentes desta aplicação.`,
  especificacoes: extras.especificacoes ?? [
    ['Garantia', '12 meses'],
    ['Origem', 'Nacional'],
    ['Peso', '0,5 kg'],
  ],
})

export const produtos = [
  p(1, 'Fone de ouvido sem fio', 'Eletrônicos', 249.9, {
    avaliacao: 5,
    avaliacoes: 128,
    destaque: 'oferta',
    precoAntigo: 329.9,
    descricao: 'Cancelamento ativo de ruído, 30 horas de bateria e estojo com carregamento rápido.',
    especificacoes: [
      ['Bluetooth', '5.3'],
      ['Bateria', '30 h'],
      ['Peso', '240 g'],
    ],
  }),
  p(2, 'Teclado mecânico compacto', 'Eletrônicos', 389.0, { avaliacao: 5, avaliacoes: 86, destaque: 'novo' }),
  p(3, 'Mouse ergonômico', 'Eletrônicos', 159.9, { avaliacoes: 54 }),
  p(4, 'Carregador portátil 10.000 mAh', 'Eletrônicos', 129.0, { avaliacoes: 203 }),
  p(5, 'Caixa de som Bluetooth', 'Eletrônicos', 199.9, { destaque: 'oferta', precoAntigo: 259.9, avaliacoes: 77 }),
  p(6, 'Smartwatch esportivo', 'Eletrônicos', 599.0, { avaliacao: 4, avaliacoes: 45, destaque: 'novo' }),
  p(7, 'Código Limpo', 'Livros', 89.9, { avaliacao: 5, avaliacoes: 412 }),
  p(8, 'Engenharia de Software Moderna', 'Livros', 119.0, { avaliacao: 5, avaliacoes: 98 }),
  p(9, 'Padrões de Projeto', 'Livros', 139.9, { avaliacoes: 150 }),
  p(10, 'Refatoração', 'Livros', 109.0, { avaliacao: 5, avaliacoes: 210, destaque: 'oferta', precoAntigo: 139.0 }),
  p(11, 'Arquitetura Limpa', 'Livros', 99.9, { avaliacoes: 180 }),
  p(12, 'Luminária de mesa LED', 'Casa', 79.9, { avaliacoes: 64, destaque: 'novo' }),
  p(13, 'Cadeira de escritório', 'Casa', 849.0, { avaliacao: 4, avaliacoes: 39 }),
  p(14, 'Organizador de cabos', 'Casa', 29.9, { avaliacao: 3, avaliacoes: 22 }),
  p(15, 'Garrafa térmica 1 L', 'Casa', 69.9, { avaliacoes: 91 }),
  p(16, 'Suporte para notebook', 'Casa', 99.0, { avaliacao: 5, avaliacoes: 133, destaque: 'oferta', precoAntigo: 129.0 }),
  p(17, 'Tapete de yoga', 'Esportes', 89.0, { avaliacoes: 58 }),
  p(18, 'Corda de pular', 'Esportes', 39.9, { avaliacao: 4, avaliacoes: 31 }),
  p(19, 'Halteres 5 kg (par)', 'Esportes', 149.0, { avaliacoes: 47 }),
  p(20, 'Bola de futebol', 'Esportes', 119.9, { avaliacao: 5, avaliacoes: 72, destaque: 'novo' }),
  p(21, 'Tênis de corrida', 'Esportes', 329.0, { avaliacao: 5, avaliacoes: 164 }),
  p(22, 'Mochila esportiva', 'Esportes', 159.0, { avaliacoes: 40 }),
  p(23, 'Garrafa squeeze 750 ml', 'Esportes', 34.9, { avaliacao: 3, avaliacoes: 19 }),
]

export const formatadorMoeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export function buscarProduto(id) {
  return produtos.find((produto) => produto.id === Number(id)) ?? null
}
