import { useId, useState } from 'react'
import estilos from './Accordion.module.css'

/**
 * Acordeão: seções expansíveis/colapsáveis.
 *
 * Props:
 * - itens            : [{ id, titulo, conteudo }]
 * - permitirMultiplos: se true, vários itens podem ficar abertos; por padrão, só um
 * - abertoInicialId  : id do item que começa aberto (opcional)
 * - nivelTitulo      : nível do título de cada item (2 a 6), para manter a hierarquia da página
 *
 * O componente é dono do estado "quais itens estão abertos"; os dados vêm por props.
 */
export default function Accordion({ itens = [], permitirMultiplos = false, abertoInicialId = null, nivelTitulo = 3 }) {
  const [abertos, setAbertos] = useState(() => (abertoInicialId ? [abertoInicialId] : []))
  const prefixoId = useId()
  const nivelSeguro = Number.isInteger(nivelTitulo) && nivelTitulo >= 2 && nivelTitulo <= 6 ? nivelTitulo : 3
  const Titulo = `h${nivelSeguro}`

  function alternarItem(id) {
    setAbertos((atuais) => {
      const jaAberto = atuais.includes(id)
      if (jaAberto) return atuais.filter((itemId) => itemId !== id)
      return permitirMultiplos ? [...atuais, id] : [id]
    })
  }

  if (itens.length === 0) {
    return <p className="texto-suave">Nenhum item para exibir.</p>
  }

  return (
    <div className={estilos.acordeao}>
      {itens.map((item) => {
        const aberto = abertos.includes(item.id)
        const idBotao = `${prefixoId}-botao-${item.id}`
        const idPainel = `${prefixoId}-painel-${item.id}`

        return (
          <div key={item.id} className={estilos.item}>
            <Titulo className={estilos.titulo}>
              <button
                type="button"
                id={idBotao}
                className={estilos.botao}
                aria-expanded={aberto}
                aria-controls={idPainel}
                onClick={() => alternarItem(item.id)}
              >
                <span>{item.titulo}</span>
                <span className={`${estilos.seta} ${aberto ? estilos.setaAberta : ''}`} aria-hidden="true">
                  ▾
                </span>
              </button>
            </Titulo>
            {/* A transição suave usa grid-template-rows (0fr -> 1fr), que anima altura automática.
                "inert" tira o painel fechado da ordem de foco e da árvore de acessibilidade. */}
            <div
              id={idPainel}
              role="region"
              aria-labelledby={idBotao}
              className={`${estilos.painel} ${aberto ? estilos.painelAberto : ''}`}
              inert={!aberto}
            >
              <div className={estilos.painelInterno}>
                <div className={estilos.conteudo}>{item.conteudo}</div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
