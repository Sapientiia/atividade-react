import { useEffect, useId, useRef, useState } from 'react'
import estilos from './Dropdown.module.css'

/**
 * Menu Suspenso (Dropdown).
 *
 * Props:
 * - rotulo              : texto do botão que abre o menu
 * - opcoes              : [{ id, rotulo, aoSelecionar? }] — cada opção pode ter seu próprio callback
 * - aoSelecionar        : callback(opcao) geral, chamado para qualquer opção escolhida
 * - valorSelecionadoId  : id da opção atualmente escolhida (marca visual + aria-checked)
 * - alinhamento         : 'esquerda' | 'direita' (lado em que a lista abre)
 *
 * Visibilidade controlada por state. Fecha ao selecionar, ao clicar fora, com Escape ou ao sair com Tab.
 */
export default function Dropdown({
  rotulo,
  opcoes = [],
  aoSelecionar,
  valorSelecionadoId = null,
  alinhamento = 'esquerda',
}) {
  const [aberto, setAberto] = useState(false)
  const envoltorioRef = useRef(null)
  const botaoRef = useRef(null)
  const itensRef = useRef([])
  const idMenu = useId()

  // Fecha o menu ao clicar/tocar fora dele. O listener só existe enquanto o menu está aberto.
  useEffect(() => {
    if (!aberto) return undefined

    function aoClicarFora(evento) {
      if (envoltorioRef.current && !envoltorioRef.current.contains(evento.target)) {
        setAberto(false)
      }
    }

    document.addEventListener('mousedown', aoClicarFora)
    document.addEventListener('touchstart', aoClicarFora)
    return () => {
      document.removeEventListener('mousedown', aoClicarFora)
      document.removeEventListener('touchstart', aoClicarFora)
    }
  }, [aberto])

  function selecionar(opcao) {
    setAberto(false)
    if (typeof opcao.aoSelecionar === 'function') opcao.aoSelecionar(opcao)
    if (typeof aoSelecionar === 'function') aoSelecionar(opcao)
    botaoRef.current?.focus()
  }

  function focarItem(indice) {
    const total = opcoes.length
    if (total === 0) return
    const indiceSeguro = ((indice % total) + total) % total
    itensRef.current[indiceSeguro]?.focus()
  }

  function aoTeclaNoBotao(evento) {
    if (evento.key === 'ArrowDown' || evento.key === 'Enter' || evento.key === ' ') {
      evento.preventDefault()
      setAberto(true)
      // Foca o primeiro item depois que a lista for renderizada.
      requestAnimationFrame(() => focarItem(0))
      return
    }
    // Escape fecha; Tab fecha e deixa o foco seguir normalmente.
    if (evento.key === 'Escape' || evento.key === 'Tab') {
      setAberto(false)
    }
  }

  function aoTeclaNoMenu(evento, indice) {
    const acoes = {
      ArrowDown: () => focarItem(indice + 1),
      ArrowUp: () => focarItem(indice - 1),
      Home: () => focarItem(0),
      End: () => focarItem(opcoes.length - 1),
      Escape: () => {
        setAberto(false)
        botaoRef.current?.focus()
      },
      Tab: () => setAberto(false),
    }
    const acao = acoes[evento.key]
    if (acao) {
      if (evento.key !== 'Tab') evento.preventDefault()
      acao()
    }
  }

  const opcaoSelecionada = opcoes.find((opcao) => opcao.id === valorSelecionadoId)
  const classeMenu = `${estilos.menu} ${alinhamento === 'direita' ? estilos.menuDireita : ''}`

  return (
    <div className={estilos.envoltorio} ref={envoltorioRef}>
      <button
        type="button"
        ref={botaoRef}
        className={estilos.gatilho}
        aria-haspopup="menu"
        aria-expanded={aberto}
        aria-controls={idMenu}
        onClick={() => setAberto((valor) => !valor)}
        onKeyDown={aoTeclaNoBotao}
      >
        <span>{rotulo}</span>
        {opcaoSelecionada && <span className={estilos.valorAtual}>{opcaoSelecionada.rotulo}</span>}
        <span className={`${estilos.seta} ${aberto ? estilos.setaAberta : ''}`} aria-hidden="true">
          ▾
        </span>
      </button>

      {/* Sem opções, a mensagem fica fora de role="menu" (que só admite itens de menu como filhos). */}
      {aberto && opcoes.length === 0 && (
        <div id={idMenu} className={classeMenu}>
          <p className={estilos.vazio}>Nenhuma opção disponível</p>
        </div>
      )}

      {aberto && opcoes.length > 0 && (
        <ul id={idMenu} role="menu" aria-label={rotulo} className={classeMenu}>
          {opcoes.map((opcao, indice) => {
            const selecionada = opcao.id === valorSelecionadoId
            return (
              <li key={opcao.id} role="none">
                <button
                  type="button"
                  role="menuitemradio"
                  aria-checked={selecionada}
                  className={`${estilos.item} ${selecionada ? estilos.itemSelecionado : ''}`}
                  tabIndex={-1}
                  ref={(elemento) => {
                    itensRef.current[indice] = elemento
                  }}
                  onClick={() => selecionar(opcao)}
                  onKeyDown={(evento) => aoTeclaNoMenu(evento, indice)}
                >
                  {opcao.rotulo}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
