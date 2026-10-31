import { createContext, useContext } from 'react'

/**
 * Contexto global de preferências do usuário (tema visual).
 * O provider fica em PreferenciasProvider.jsx.
 */
export const PreferenciasContext = createContext(null)

export const TEMAS = ['claro', 'escuro', 'sistema']

export function usePreferencias() {
  const contexto = useContext(PreferenciasContext)
  if (!contexto) {
    throw new Error('usePreferencias deve ser usado dentro de <PreferenciasProvider>.')
  }
  return contexto
}
