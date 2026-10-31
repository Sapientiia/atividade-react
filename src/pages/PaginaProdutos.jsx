import { useEffect, useMemo, useState } from 'react'
import Dropdown from '../components/Dropdown/Dropdown.jsx'
import Icone from '../components/Icone/Icone.jsx'
import Pagination from '../components/Pagination/Pagination.jsx'
import CartaoProduto from '../components/Produto/CartaoProduto.jsx'
import EsqueletoProduto from '../components/Produto/EsqueletoProduto.jsx'
import { useToast } from '../context/ToastContext.js'
import useAdicionarAoCarrinho from '../hooks/useAdicionarAoCarrinho.js'
import { CATEGORIAS, produtos } from '../data/produtos.js'
import estilos from './Paginas.module.css'

const ITENS_POR_PAGINA = 6
const TODAS = 'todas'
const TEMPO_CARREGAMENTO_MS = 450

const OPCOES_CATEGORIA = [
  { id: TODAS, rotulo: 'Todas as categorias' },
  ...CATEGORIAS.map((nome) => ({ id: nome, rotulo: nome })),
]

const OPCOES_ORDEM = [
  { id: 'relevancia', rotulo: 'Relevância' },
  { id: 'menor-preco', rotulo: 'Menor preço' },
  { id: 'maior-preco', rotulo: 'Maior preço' },
  { id: 'avaliacao', rotulo: 'Melhor avaliação' },
]

const ORDENACOES = {
  relevancia: () => 0,
  'menor-preco': (a, b) => a.preco - b.preco,
  'maior-preco': (a, b) => b.preco - a.preco,
  avaliacao: (a, b) => b.avaliacao - a.avaliacao || b.avaliacoes - a.avaliacoes,
}

/** Página de produtos: dois Menus Suspensos (filtro e ordem) + Paginação sobre a lista filtrada. */
export default function PaginaProdutos() {
  const [categoria, setCategoria] = useState(TODAS)
  const [ordem, setOrdem] = useState('relevancia')
  const [paginaEscolhida, setPaginaEscolhida] = useState(1)
  const [carregando, setCarregando] = useState(false)
  const { adicionarToast } = useToast()
  const adicionarAoCarrinho = useAdicionarAoCarrinho()

  // Simula o tempo de resposta de uma API ao trocar o filtro: mostra o esqueleto por alguns ms.
  useEffect(() => {
    const temporizador = setTimeout(() => setCarregando(false), TEMPO_CARREGAMENTO_MS)
    return () => clearTimeout(temporizador)
  }, [categoria, ordem])

  const produtosFiltrados = useMemo(() => {
    const lista = categoria === TODAS ? produtos : produtos.filter((produto) => produto.categoria === categoria)
    return [...lista].sort(ORDENACOES[ordem] ?? ORDENACOES.relevancia)
  }, [categoria, ordem])

  const totalPaginas = Math.max(1, Math.ceil(produtosFiltrados.length / ITENS_POR_PAGINA))
  // Estado derivado: se o filtro reduzir o total de páginas, a página exibida nunca passa do limite.
  const paginaAtual = Math.min(paginaEscolhida, totalPaginas)
  const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA
  const produtosDaPagina = produtosFiltrados.slice(inicio, inicio + ITENS_POR_PAGINA)

  function aoEscolherCategoria(opcao) {
    if (opcao.id === categoria) return
    setCategoria(opcao.id)
    setPaginaEscolhida(1)
    setCarregando(true)
    adicionarToast({ tipo: 'info', mensagem: `Filtro aplicado: ${opcao.rotulo}.` })
  }

  function aoEscolherOrdem(opcao) {
    if (opcao.id === ordem) return
    setOrdem(opcao.id)
    setPaginaEscolhida(1)
    setCarregando(true)
  }

  return (
    <>
      <div className={estilos.cabecalhoPagina}>
        <div>
          <span className="sobretitulo">
            <Icone nome="caixa" tamanho={14} /> Catálogo
          </span>
          <h1>Produtos</h1>
        </div>
        <p className="texto-suave" aria-live="polite">
          {produtosFiltrados.length} produto(s) encontrado(s)
        </p>
      </div>

      <div className={estilos.barraFiltros}>
        <Dropdown
          rotulo="Categoria"
          icone={<Icone nome="filtro" tamanho={16} />}
          opcoes={OPCOES_CATEGORIA}
          valorSelecionadoId={categoria}
          aoSelecionar={aoEscolherCategoria}
        />
        <Dropdown
          rotulo="Ordenar"
          icone={<Icone nome="lista" tamanho={16} />}
          opcoes={OPCOES_ORDEM}
          valorSelecionadoId={ordem}
          aoSelecionar={aoEscolherOrdem}
        />
      </div>

      {carregando ? (
        <div className={estilos.gradeProdutos} role="status" aria-busy="true">
          <span className="sr-only">Carregando produtos…</span>
          {Array.from({ length: ITENS_POR_PAGINA }, (_, indice) => (
            <EsqueletoProduto key={indice} />
          ))}
        </div>
      ) : (
        <ul className={estilos.gradeProdutos} aria-label="Lista de produtos">
          {produtosDaPagina.map((produto) => (
            <li key={produto.id}>
              <CartaoProduto produto={produto} aoAdicionar={adicionarAoCarrinho} />
            </li>
          ))}
        </ul>
      )}

      <Pagination paginaAtual={paginaAtual} totalPaginas={totalPaginas} aoMudarPagina={setPaginaEscolhida} />
    </>
  )
}
