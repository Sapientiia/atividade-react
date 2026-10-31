import { createContext, useContext } from 'react'

/**
 * Contexto global de notificações (Toast).
 * O provider fica em ToastProvider.jsx; aqui ficam apenas o contexto e o hook,
 * mantendo os arquivos de componente compatíveis com o Fast Refresh.
 */
export const ToastContext = createContext(null)

/** Hook de conveniência. Falha cedo se usado fora do provider. */
export function useToast() {
  const contexto = useContext(ToastContext)
  if (!contexto) {
    throw new Error('useToast deve ser usado dentro de <ToastProvider>.')
  }
  return contexto
}
