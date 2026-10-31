import { Outlet } from 'react-router-dom'
import Cabecalho from './Cabecalho.jsx'
import Rodape from './Rodape.jsx'
import estilos from './Layout.module.css'

/**
 * Estrutura comum a todas as páginas: cabeçalho, conteúdo (Outlet do React Router) e rodapé.
 * O link "Pular para o conteúdo" ajuda usuários de teclado e leitores de tela.
 */
export default function Layout() {
  return (
    <div className={estilos.pagina}>
      <a href="#conteudo" className={estilos.pularLink}>
        Pular para o conteúdo
      </a>
      <Cabecalho />
      <main id="conteudo" className={`container ${estilos.conteudo}`} tabIndex={-1}>
        <Outlet />
      </main>
      <Rodape />
    </div>
  )
}
