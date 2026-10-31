import { Link } from 'react-router-dom'
import Icone from '../Icone/Icone.jsx'
import Estrelas from './Estrelas.jsx'
import ImagemProduto from './ImagemProduto.jsx'
import { formatadorMoeda } from '../../data/produtos.js'
import estilos from './Produto.module.css'

const TEXTO_DESTAQUE = { novo: 'Novo', oferta: 'Oferta' }

/**
 * Cartão de produto da listagem.
 * Props: produto, aoAdicionar(produto), nivelTitulo (2 a 6, conforme a hierarquia da página).
 */
export default function CartaoProduto({ produto, aoAdicionar, nivelTitulo = 2 }) {
  const Titulo = `h${Number.isInteger(nivelTitulo) && nivelTitulo >= 2 && nivelTitulo <= 6 ? nivelTitulo : 2}`

  return (
    <article className={`cartao cartao--interativo ${estilos.cartao}`}>
      {/* O link da imagem repete o destino do título; fica fora da ordem de Tab para não duplicar paradas. */}
      <Link to={`/produtos/${produto.id}`} className={estilos.linkImagem} tabIndex={-1} aria-hidden="true">
        <ImagemProduto produto={produto} decorativa />
      </Link>
      {produto.destaque && (
        <span className={`etiqueta ${produto.destaque === 'oferta' ? 'etiqueta--acento' : 'etiqueta--primaria'} ${estilos.destaque}`}>
          {TEXTO_DESTAQUE[produto.destaque]}
        </span>
      )}
      <div className={estilos.corpo}>
        <span className="texto-fraco">{produto.categoria}</span>
        <Titulo className={estilos.nome}>
          <Link to={`/produtos/${produto.id}`}>{produto.nome}</Link>
        </Titulo>
        <Estrelas valor={produto.avaliacao} total={produto.avaliacoes} />
        <div className={estilos.precos}>
          <span className={estilos.preco}>{formatadorMoeda.format(produto.preco)}</span>
          {produto.precoAntigo && (
            <s className={estilos.precoAntigo}>
              <span className="sr-only">Preço anterior: </span>
              {formatadorMoeda.format(produto.precoAntigo)}
            </s>
          )}
        </div>
        <button
          type="button"
          className={`botao botao--pequeno ${estilos.botaoAdicionar}`}
          onClick={() => aoAdicionar(produto)}
          aria-label={`Adicionar ${produto.nome} ao carrinho`}
        >
          <Icone nome="carrinho" tamanho={16} /> Adicionar
        </button>
      </div>
    </article>
  )
}
