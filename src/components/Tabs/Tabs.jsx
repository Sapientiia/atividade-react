import { useId, useRef, useState } from 'react'
import estilos from './Tabs.module.css'

/**
 * Abas (Tabs).
 *
 * Props:
 * - abas         : [{ id, titulo, conteudo }]
 * - abaInicialId : id da aba que começa ativa (padrão: a primeira)
 * - aoMudarAba   : callback(id) opcional, chamado quando a aba ativa muda
 * - rotulo       : nome acessível da lista de abas (padrão "Seções")
 *
 * O componente controla qual aba está ativa no próprio state e segue o padrão
 * WAI-ARIA "Tabs": setas esquerda/direita, Home e End navegam pelo teclado.
 */
export default function Tabs({ abas = [], abaInicialId, aoMudarAba, rotulo = 'Seções' }) {
  const [abaAtivaId, setAbaAtivaId] = useState(() => {
    const existe = abas.some((aba) => aba.id === abaInicialId)
    return existe ? abaInicialId : abas[0]?.id ?? null
  })
  const prefixoId = useId()
  const referenciasBotoes = useRef({})

  if (abas.length === 0) {
    return <p className="texto-suave">Nenhuma aba para exibir.</p>
  }

  // Se o id guardado não existir mais (lista de abas mudou), usa a primeira aba.
  const abaAtiva = abas.find((aba) => aba.id === abaAtivaId) ?? abas[0]

  function ativarAba(id) {
    if (id === abaAtiva.id) return
    setAbaAtivaId(id)
    if (typeof aoMudarAba === 'function') aoMudarAba(id)
  }

  function focarEAtivar(indice) {
    const aba = abas[indice]
    ativarAba(aba.id)
    referenciasBotoes.current[aba.id]?.focus()
  }

  function aoPressionarTecla(evento) {
    const indiceAtual = abas.findIndex((aba) => aba.id === abaAtiva.id)
    const ultimo = abas.length - 1
    const acoes = {
      ArrowRight: () => focarEAtivar(indiceAtual === ultimo ? 0 : indiceAtual + 1),
      ArrowLeft: () => focarEAtivar(indiceAtual === 0 ? ultimo : indiceAtual - 1),
      Home: () => focarEAtivar(0),
      End: () => focarEAtivar(ultimo),
    }
    const acao = acoes[evento.key]
    if (acao) {
      evento.preventDefault()
      acao()
    }
  }

  const idPainelAtivo = `${prefixoId}-painel-${abaAtiva.id}`

  return (
    <div className={estilos.abas}>
      <div className={estilos.lista} role="tablist" aria-label={rotulo} onKeyDown={aoPressionarTecla}>
        {abas.map((aba) => {
          const ativa = aba.id === abaAtiva.id
          return (
            <button
              key={aba.id}
              type="button"
              role="tab"
              id={`${prefixoId}-aba-${aba.id}`}
              aria-selected={ativa}
              // Só o painel ativo existe no DOM, então só a aba ativa aponta para um painel.
              aria-controls={ativa ? idPainelAtivo : undefined}
              tabIndex={ativa ? 0 : -1}
              className={`${estilos.aba} ${ativa ? estilos.abaAtiva : ''}`}
              onClick={() => ativarAba(aba.id)}
              ref={(elemento) => {
                referenciasBotoes.current[aba.id] = elemento
              }}
            >
              {aba.titulo}
            </button>
          )
        })}
      </div>

      {/* Apenas o painel ativo é renderizado: menos DOM e sem conteúdo oculto acessível por engano. */}
      <div
        role="tabpanel"
        id={idPainelAtivo}
        aria-labelledby={`${prefixoId}-aba-${abaAtiva.id}`}
        className={estilos.painel}
        tabIndex={0}
      >
        {abaAtiva.conteudo}
      </div>
    </div>
  )
}
