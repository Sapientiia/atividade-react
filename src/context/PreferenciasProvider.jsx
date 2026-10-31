import { useCallback, useEffect, useMemo, useState } from 'react'
import { PreferenciasContext, TEMAS } from './PreferenciasContext.js'

/** Lê a preferência de cor do sistema operacional, com fallback seguro para 'claro'. */
function obterTemaDoSistema() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return 'claro'
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'escuro' : 'claro'
}

/**
 * Provedor de preferências. A preferência é alterada pelo Menu Suspenso no
 * cabeçalho e lida por componentes sem relação direta com ele (ex.: aba
 * "Preferências" da página de Perfil) — compartilhamento de estado global.
 */
export default function PreferenciasProvider({ children, temaInicial = 'sistema' }) {
  const [tema, setTemaInterno] = useState(TEMAS.includes(temaInicial) ? temaInicial : 'sistema')
  const [temaDoSistema, setTemaDoSistema] = useState(obterTemaDoSistema)

  // Efeito 1: acompanha mudanças do tema do sistema operacional enquanto 'sistema' estiver ativo.
  useEffect(() => {
    if (tema !== 'sistema') return undefined
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return undefined

    const consulta = window.matchMedia('(prefers-color-scheme: dark)')
    const aoMudar = (evento) => setTemaDoSistema(evento.matches ? 'escuro' : 'claro')
    consulta.addEventListener('change', aoMudar)
    return () => consulta.removeEventListener('change', aoMudar)
  }, [tema])

  const temaEfetivo = tema === 'sistema' ? temaDoSistema : tema

  // Efeito 2: aplica o tema efetivo no <html>, onde o CSS lê o atributo data-tema.
  useEffect(() => {
    document.documentElement.dataset.tema = temaEfetivo
  }, [temaEfetivo])

  const setTema = useCallback((novoTema) => {
    if (TEMAS.includes(novoTema)) {
      setTemaInterno(novoTema)
    }
  }, [])

  const valor = useMemo(() => ({ tema, temaEfetivo, setTema }), [tema, temaEfetivo, setTema])

  return <PreferenciasContext.Provider value={valor}>{children}</PreferenciasContext.Provider>
}
