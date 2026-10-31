import { useCallback, useMemo, useRef, useState } from 'react'
import ToastContainer from '../components/Toast/ToastContainer.jsx'
import { ToastContext } from './ToastContext.js'

const TIPOS_VALIDOS = ['sucesso', 'erro', 'info']
const LIMITE_TOASTS = 5
const DURACAO_PADRAO_MS = 4000

/**
 * Provedor de notificações. Qualquer componente da árvore pode chamar
 * `adicionarToast` sem receber callbacks por props — caso de uso clássico de
 * estado global com Context API (desafio extra).
 */
export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  // Contador incremental garante ids únicos e previsíveis (sem depender de Math.random).
  const proximoId = useRef(1)

  const removerToast = useCallback((id) => {
    setToasts((atuais) => atuais.filter((toast) => toast.id !== id))
  }, [])

  const adicionarToast = useCallback(({ tipo = 'info', mensagem, duracao = DURACAO_PADRAO_MS }) => {
    if (typeof mensagem !== 'string' || mensagem.trim() === '') {
      // Entrada inválida: ignora silenciosamente em produção e avisa no console em dev.
      if (import.meta.env.DEV) {
        console.warn('adicionarToast: "mensagem" deve ser um texto não vazio.')
      }
      return null
    }

    const tipoSeguro = TIPOS_VALIDOS.includes(tipo) ? tipo : 'info'
    const duracaoSegura = Number.isFinite(duracao) ? duracao : DURACAO_PADRAO_MS
    const id = proximoId.current
    proximoId.current += 1

    setToasts((atuais) => {
      const novaLista = [...atuais, { id, tipo: tipoSeguro, mensagem, duracao: duracaoSegura }]
      // Mantém no máximo LIMITE_TOASTS na tela, descartando os mais antigos.
      return novaLista.slice(-LIMITE_TOASTS)
    })

    return id
  }, [])

  const valor = useMemo(
    () => ({ toasts, adicionarToast, removerToast }),
    [toasts, adicionarToast, removerToast],
  )

  return (
    <ToastContext.Provider value={valor}>
      {children}
      <ToastContainer toasts={toasts} aoFechar={removerToast} />
    </ToastContext.Provider>
  )
}
