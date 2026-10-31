import { useEffect } from 'react'
import Icone from '../Icone/Icone.jsx'
import estilos from './Toast.module.css'

const ICONES = {
  sucesso: 'check',
  erro: 'alerta',
  info: 'info',
}

/**
 * Notificação Toast.
 *
 * Props:
 * - id        : identificador usado no callback de fechamento
 * - tipo      : 'sucesso' | 'erro' | 'info'
 * - mensagem  : texto breve exibido ao usuário
 * - duracao   : ms até fechar sozinho (0 ou negativo = não fecha automaticamente)
 * - aoFechar  : callback(id) chamado ao expirar ou ao clicar em "Fechar"
 */
export default function Toast({ id, tipo = 'info', mensagem, duracao = 4000, aoFechar }) {
  // Efeito com limpeza: agenda o fechamento automático e cancela se o toast
  // for desmontado antes (ex.: fechado manualmente).
  useEffect(() => {
    if (!duracao || duracao <= 0) return undefined
    const temporizador = setTimeout(() => aoFechar(id), duracao)
    return () => clearTimeout(temporizador)
  }, [id, duracao, aoFechar])

  const tipoSeguro = ICONES[tipo] ? tipo : 'info'
  // Erros são anunciados imediatamente por leitores de tela; os demais, de forma educada.
  const papel = tipoSeguro === 'erro' ? 'alert' : 'status'

  return (
    <div className={`${estilos.toast} ${estilos[tipoSeguro]}`} role={papel} data-testid="toast">
      <span className={estilos.icone} aria-hidden="true">
        <Icone nome={ICONES[tipoSeguro]} tamanho={16} espessura={2.5} />
      </span>
      <p className={estilos.mensagem}>{mensagem}</p>
      <button
        type="button"
        className={estilos.fechar}
        onClick={() => aoFechar(id)}
        aria-label="Fechar notificação"
      >
        <Icone nome="x" tamanho={18} />
      </button>
    </div>
  )
}
