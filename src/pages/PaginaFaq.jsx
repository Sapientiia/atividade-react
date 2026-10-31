import { useState } from 'react'
import Accordion from '../components/Accordion/Accordion.jsx'
import Icone from '../components/Icone/Icone.jsx'
import { useToast } from '../context/ToastContext.js'
import { perguntasFrequentes } from '../data/faq.js'
import estilos from './Paginas.module.css'

/** Página de FAQ: demonstra o Acordeão e a troca de comportamento via props. */
export default function PaginaFaq() {
  const [permitirMultiplos, setPermitirMultiplos] = useState(false)
  const { adicionarToast } = useToast()

  return (
    <>
      <div className={estilos.cabecalhoPagina}>
        <div>
          <span className="sobretitulo">
            <Icone nome="pergunta" tamanho={14} /> Central de ajuda
          </span>
          <h1>Perguntas frequentes</h1>
        </div>
      </div>

      <div className={estilos.faqLayout}>
        <div>
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
        </div>

        <aside className={`cartao ${estilos.faqAjuda}`} aria-labelledby="titulo-ajuda">
          <span className={estilos.cartaoIcone}>
            <Icone nome="fone" tamanho={22} />
          </span>
          <h2 id="titulo-ajuda">Ainda com dúvidas?</h2>
          <p className="texto-suave">Nossa equipe responde em até 1 dia útil, de segunda a sexta.</p>
          <ul className={estilos.beneficios}>
            <li>
              <Icone nome="relogio" tamanho={18} /> 9h às 18h
            </li>
            <li>
              <Icone nome="mapa" tamanho={18} /> Salvador, BA
            </li>
          </ul>
          <button
            type="button"
            className="botao botao--secundario"
            onClick={() => adicionarToast({ tipo: 'info', mensagem: 'Chat de atendimento disponível em breve.' })}
          >
            Falar com atendimento
          </button>
        </aside>
      </div>
    </>
  )
}
