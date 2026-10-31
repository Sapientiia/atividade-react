import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Icone from '../components/Icone/Icone.jsx'
import Estrelas from '../components/Produto/Estrelas.jsx'
import ImagemProduto from '../components/Produto/ImagemProduto.jsx'
import Tabs from '../components/Tabs/Tabs.jsx'
import useAdicionarAoCarrinho from '../hooks/useAdicionarAoCarrinho.js'
import { buscarProduto, formatadorMoeda, produtos } from '../data/produtos.js'
import PaginaNaoEncontrada from './PaginaNaoEncontrada.jsx'
import estilos from './Paginas.module.css'

const AVALIACOES_FICTICIAS = [
  { autor: 'Mariana S.', nota: 5, texto: 'Chegou antes do prazo e a qualidade surpreendeu.' },
  { autor: 'Rafael T.', nota: 4, texto: 'Muito bom pelo preço. Só a embalagem poderia ser melhor.' },
]

/** Detalhe do produto: rota com parâmetro (React Router), Abas com descrição/especificações/avaliações. */
export default function PaginaProdutoDetalhe() {
  const { id } = useParams()
  const produto = buscarProduto(id)
  const [quantidade, setQuantidade] = useState(1)
  const adicionarAoCarrinho = useAdicionarAoCarrinho()

  // Refina o título da aba com o nome do produto (o Layout define o título genérico).
  useEffect(() => {
    if (produto) document.title = `${produto.nome} · Loja Aurora`
  }, [produto])

  if (!produto) return <PaginaNaoEncontrada />

  const relacionados = produtos.filter((p) => p.categoria === produto.categoria && p.id !== produto.id).slice(0, 3)

  const abas = [
    {
      id: 'descricao',
      titulo: 'Descrição',
      conteudo: <p className={estilos.textoLongo}>{produto.descricao}</p>,
    },
    {
      id: 'especificacoes',
      titulo: 'Especificações',
      conteudo: (
        <dl className={estilos.listaDefinicoes}>
          {produto.especificacoes.map(([chave, valor]) => (
            <div key={chave} className={estilos.definicao}>
              <dt>{chave}</dt>
              <dd>{valor}</dd>
            </div>
          ))}
        </dl>
      ),
    },
    {
      id: 'avaliacoes',
      titulo: `Avaliações (${produto.avaliacoes})`,
      conteudo: (
        <ul className={estilos.listaAvaliacoes}>
          {AVALIACOES_FICTICIAS.map((avaliacao) => (
            <li key={avaliacao.autor}>
              <div className={estilos.avaliacaoCabecalho}>
                <strong>{avaliacao.autor}</strong>
                <Estrelas valor={avaliacao.nota} />
              </div>
              <p className="texto-suave">{avaliacao.texto}</p>
            </li>
          ))}
        </ul>
      ),
    },
  ]

  return (
    <>
      <nav aria-label="Trilha de navegação" className={estilos.trilha}>
        <Link to="/">Início</Link>
        <Icone nome="setaDireita" tamanho={14} />
        <Link to="/produtos">Produtos</Link>
        <Icone nome="setaDireita" tamanho={14} />
        <span aria-current="page">{produto.nome}</span>
      </nav>

      <article className={estilos.detalhe}>
        <ImagemProduto produto={produto} tamanhoIcone={120} className={estilos.detalheImagem} />

        <div className={estilos.detalheInfo}>
          <span className="etiqueta">{produto.categoria}</span>
          <h1 className={estilos.detalheTitulo}>{produto.nome}</h1>
          <Estrelas valor={produto.avaliacao} total={produto.avaliacoes} tamanho={16} />

          <div className={estilos.detalhePrecos}>
            <span className={estilos.detalhePreco}>{formatadorMoeda.format(produto.preco)}</span>
            {produto.precoAntigo && (
              <s className="texto-fraco">
                <span className="sr-only">Preço anterior: </span>
                {formatadorMoeda.format(produto.precoAntigo)}
              </s>
            )}
          </div>
          <p className="texto-suave">
            em até 10x de {formatadorMoeda.format(produto.preco / 10)} sem juros ou{' '}
            <strong>{formatadorMoeda.format(produto.preco * 0.95)}</strong> no PIX
          </p>

          <div className={estilos.compra}>
            <div className={estilos.quantidade} role="group" aria-label="Quantidade">
              <button
                type="button"
                className="botao botao--secundario botao--icone"
                onClick={() => setQuantidade((atual) => Math.max(1, atual - 1))}
                aria-label="Diminuir quantidade"
                disabled={quantidade <= 1}
              >
                <Icone nome="menos" tamanho={16} />
              </button>
              <span className={estilos.quantidadeValor} aria-live="polite">
                {quantidade}
              </span>
              <button
                type="button"
                className="botao botao--secundario botao--icone"
                onClick={() => setQuantidade((atual) => Math.min(10, atual + 1))}
                aria-label="Aumentar quantidade"
                disabled={quantidade >= 10}
              >
                <Icone nome="mais" tamanho={16} />
              </button>
            </div>
            <button
              type="button"
              className={`botao ${estilos.botaoComprar}`}
              onClick={() => adicionarAoCarrinho(produto, quantidade)}
            >
              <Icone nome="carrinho" tamanho={18} /> Adicionar ao carrinho
            </button>
          </div>

          <ul className={estilos.beneficios}>
            <li>
              <Icone nome="caminhao" tamanho={18} /> Frete grátis acima de R$ 300
            </li>
            <li>
              <Icone nome="escudo" tamanho={18} /> Garantia de 12 meses
            </li>
          </ul>
        </div>
      </article>

      <section className="secao" aria-label="Informações do produto">
        <Tabs abas={abas} abaInicialId="descricao" rotulo="Informações do produto" />
      </section>

      {relacionados.length > 0 && (
        <section className="secao" aria-labelledby="titulo-relacionados">
          <div className="secao__cabecalho">
            <h2 id="titulo-relacionados">Você também pode gostar</h2>
          </div>
          <ul className={estilos.listaRelacionados}>
            {relacionados.map((item) => (
              <li key={item.id}>
                <Link to={`/produtos/${item.id}`} className={`cartao cartao--interativo ${estilos.relacionado}`}>
                  <ImagemProduto produto={item} tamanhoIcone={32} className={estilos.relacionadoImagem} decorativa />
                  <div>
                    <strong>{item.nome}</strong>
                    <span className={estilos.preco}>{formatadorMoeda.format(item.preco)}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  )
}
