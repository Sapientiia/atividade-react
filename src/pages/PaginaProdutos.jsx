import { useMemo, useState } from 'react'
import Dropdown from '../components/Dropdown/Dropdown.jsx'
import Pagination from '../components/Pagination/Pagination.jsx'
import { useToast } from '../context/ToastContext.js'
import { CATEGORIAS, produtos } from '../data/produtos.js'
import estilos from './Paginas.module.css'

const ITENS_POR_PAGINA = 6
const TODAS = 'todas'

const formatadorMoeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

const OPCOES_CATEGORIA = [
  { id: TODAS, rotulo: 'Todas as categorias' },
  ...CATEGORIAS.map((nome) => ({ id: nome, rotulo: nome })),
]

/** Página de produtos: Menu Suspenso como filtro + Paginação sobre a lista filtrada. */
export default function PaginaProdutos() {
  const [categoria, setCategoria] = useState(TODAS)
  const [paginaEscolhida, setPaginaEscolhida] = useState(1)
  const { adicionarToast } = useToast()

  const produtosFiltrados = useMemo(
    () => (categoria === TODAS ? produtos : produtos.filter((produto) => produto.categoria === categoria)),
    [categoria],
  )

  const totalPaginas = Math.max(1, Math.ceil(produtosFiltrados.length / ITENS_POR_PAGINA))
  // Estado derivado: se o filtro reduzir o total de páginas, a página exibida nunca passa do limite.
  const paginaAtual = Math.min(paginaEscolhida, totalPaginas)

  const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA
  const produtosDaPagina = produtosFiltrados.slice(inicio, inicio + ITENS_POR_PAGINA)

  function aoEscolherCategoria(opcao) {
    setCategoria(opcao.id)
    setPaginaEscolhida(1)
    adicionarToast({ tipo: 'info', mensagem: `Filtro aplicado: ${opcao.rotulo}.` })
  }

  return (
    <>
      <h1>Produtos</h1>

      <div className={estilos.barraFiltros}>
        <Dropdown
          rotulo="Categoria"
          opcoes={OPCOES_CATEGORIA}
          valorSelecionadoId={categoria}
          aoSelecionar={aoEscolherCategoria}
        />
        <p className="texto-suave" aria-live="polite">
          {produtosFiltrados.length} produto(s) encontrado(s)
        </p>
      </div>

      <ul className={estilos.gradeProdutos} aria-label="Lista de produtos">
        {produtosDaPagina.map((produto) => (
          <li key={produto.id} className={`cartao ${estilos.cartaoProduto}`}>
            <span className={estilos.etiqueta}>{produto.categoria}</span>
            <h2>{produto.nome}</h2>
            <p className={estilos.preco}>{formatadorMoeda.format(produto.preco)}</p>
          </li>
        ))}
      </ul>

      <Pagination paginaAtual={paginaAtual} totalPaginas={totalPaginas} aoMudarPagina={setPaginaEscolhida} />
    </>
  )
}
