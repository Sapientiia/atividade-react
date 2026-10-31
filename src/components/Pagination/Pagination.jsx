import { calcularPaginasVisiveis } from './calcularPaginasVisiveis.js'
import estilos from './Pagination.module.css'

/**
 * Paginação.
 *
 * Props:
 * - paginaAtual   : número da página selecionada (1..totalPaginas)
 * - totalPaginas  : quantidade total de páginas
 * - aoMudarPagina : callback(novaPagina) chamado em qualquer navegação
 * - rotulo        : texto acessível do <nav> (padrão "Paginação")
 *
 * O componente não guarda estado: quem controla a página é o pai (componente controlado).
 */
export default function Pagination({ paginaAtual, totalPaginas, aoMudarPagina, rotulo = 'Paginação' }) {
  if (!Number.isInteger(totalPaginas) || totalPaginas <= 0) return null

  const atual = Math.min(Math.max(1, paginaAtual || 1), totalPaginas)
  const paginas = calcularPaginasVisiveis(atual, totalPaginas)
  const ehPrimeira = atual === 1
  const ehUltima = atual === totalPaginas

  function irPara(pagina) {
    if (pagina !== atual && pagina >= 1 && pagina <= totalPaginas) {
      aoMudarPagina(pagina)
    }
  }

  return (
    <nav className={estilos.paginacao} aria-label={rotulo}>
      <button
        type="button"
        className={`${estilos.botao} ${estilos.navegacao}`}
        onClick={() => irPara(atual - 1)}
        disabled={ehPrimeira}
        aria-label="Página anterior"
      >
        ‹ <span className={estilos.textoNavegacao}>Anterior</span>
      </button>

      <ul className={estilos.lista}>
        {paginas.map((pagina) =>
          typeof pagina === 'number' ? (
            <li key={pagina}>
              <button
                type="button"
                className={`${estilos.botao} ${pagina === atual ? estilos.ativo : ''}`}
                onClick={() => irPara(pagina)}
                aria-current={pagina === atual ? 'page' : undefined}
                aria-label={`Página ${pagina}`}
              >
                {pagina}
              </button>
            </li>
          ) : (
            <li key={pagina.chave} className={estilos.reticencias} aria-hidden="true">
              …
            </li>
          ),
        )}
      </ul>

      <button
        type="button"
        className={`${estilos.botao} ${estilos.navegacao}`}
        onClick={() => irPara(atual + 1)}
        disabled={ehUltima}
        aria-label="Próxima página"
      >
        <span className={estilos.textoNavegacao}>Próxima</span> ›
      </button>

      <p className={estilos.resumo}>
        Página {atual} de {totalPaginas}
      </p>
    </nav>
  )
}
