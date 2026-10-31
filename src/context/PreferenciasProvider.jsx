import { useCallback, useEffect, useMemo, useState } from 'react'
import { PreferenciasContext, TEMAS } from './PreferenciasContext.js'

const CHAVE_ARMAZENAMENTO = 'loja-aurora:tema'

/** Lê a preferência salva no navegador; qualquer falha (modo privado, bloqueio) devolve null. */
function lerTemaSalvo() {
  try {
    const salvo = window.localStorage.getItem(CHAVE_ARMAZENAMENTO)
    return TEMAS.includes(salvo) ? salvo : null
  } catch {
    return null
  }
}

/** Persiste a preferência; falhas são ignoradas porque a funcionalidade continua sem persistência. */
function salvarTema(tema) {
  try {
    window.localStorage.setItem(CHAVE_ARMAZENAMENTO, tema)
  } catch {
    // sem armazenamento disponível
  }
}

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
  // Prioridade: preferência salva pelo usuário > prop temaInicial > 'sistema'.
  const [tema, setTemaInterno] = useState(
    () => lerTemaSalvo() ?? (TEMAS.includes(temaInicial) ? temaInicial : 'sistema'),
  )
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
      salvarTema(novoTema)
    }
  }, [])

  const valor = useMemo(() => ({ tema, temaEfetivo, setTema }), [tema, temaEfetivo, setTema])

  return <PreferenciasContext.Provider value={valor}>{children}</PreferenciasContext.Provider>
}
