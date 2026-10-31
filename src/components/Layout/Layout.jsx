import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Cabecalho from './Cabecalho.jsx'
import Rodape from './Rodape.jsx'
import estilos from './Layout.module.css'

const TITULO_BASE = 'Loja Aurora'
const TITULOS = [
  ['/produtos/', 'Produto'],
  ['/produtos', 'Produtos'],
  ['/carrinho', 'Carrinho'],
  ['/faq', 'Perguntas frequentes'],
  ['/perfil', 'Meu perfil'],
  ['/upload', 'Upload de comprovante'],
  ['/', 'Início'],
]

/** Título do documento a partir do caminho (o detalhe do produto refina depois com o nome). */
export function tituloDaRota(pathname) {
  const encontrado = TITULOS.find(([prefixo]) => (prefixo === '/' ? pathname === '/' : pathname.startsWith(prefixo)))
  return encontrado ? `${encontrado[1]} · ${TITULO_BASE}` : `Página não encontrada · ${TITULO_BASE}`
}

/**
 * Estrutura comum a todas as páginas: cabeçalho, conteúdo (Outlet do React Router) e rodapé.
 * A chave no envoltório do conteúdo reinicia a animação de entrada a cada troca de rota.
 */
export default function Layout() {
  const { pathname } = useLocation()

  // A cada rota: volta ao topo, move o foco para o conteúdo (leitores de tela e teclado)
  // e atualiza o título da aba. Sem isso, uma SPA mantém a rolagem e o foco da página anterior.
  useEffect(() => {
    document.title = tituloDaRota(pathname)
    window.scrollTo(0, 0)
    document.getElementById('conteudo')?.focus({ preventScroll: true })
  }, [pathname])

  return (
    <div className={estilos.pagina}>
      <a href="#conteudo" className={estilos.pularLink}>
        Pular para o conteúdo
      </a>
      <Cabecalho />
      <main id="conteudo" className={`container ${estilos.conteudo}`} tabIndex={-1}>
        <div key={pathname} className="animar-entrada">
          <Outlet />
        </div>
      </main>
      <Rodape />
    </div>
  )
}
