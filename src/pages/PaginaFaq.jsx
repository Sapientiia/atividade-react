import { useState } from 'react'
import Accordion from '../components/Accordion/Accordion.jsx'
import { perguntasFrequentes } from '../data/faq.js'
import estilos from './Paginas.module.css'

/** Página de FAQ: demonstra o Acordeão e a troca de comportamento via props. */
export default function PaginaFaq() {
  const [permitirMultiplos, setPermitirMultiplos] = useState(false)

  return (
    <>
      <h1>Perguntas frequentes</h1>
      <p className="texto-suave">Clique em uma pergunta para ver a resposta. Por padrão, apenas uma fica aberta por vez.</p>

      <label className={estilos.opcao}>
        <input
          type="checkbox"
          checked={permitirMultiplos}
          onChange={(evento) => setPermitirMultiplos(evento.target.checked)}
        />
        Permitir várias perguntas abertas ao mesmo tempo
      </label>

      {/* A key força um acordeão novo ao trocar o modo, evitando estados inconsistentes. */}
      <Accordion
        key={String(permitirMultiplos)}
        itens={perguntasFrequentes}
        permitirMultiplos={permitirMultiplos}
        nivelTitulo={2}
      />
    </>
  )
}
