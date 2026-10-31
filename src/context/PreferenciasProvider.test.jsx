import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { usePreferencias } from './PreferenciasContext.js'
import PreferenciasProvider from './PreferenciasProvider.jsx'

function Leitor() {
  const { tema, temaEfetivo, setTema } = usePreferencias()
  return (
    <>
      <span data-testid="tema">{tema}</span>
      <span data-testid="efetivo">{temaEfetivo}</span>
      <button type="button" onClick={() => setTema('escuro')}>
        escuro
      </button>
      <button type="button" onClick={() => setTema('invalido')}>
        invalido
      </button>
    </>
  )
}

/** Simula window.matchMedia com controle manual do evento "change". */
function simularMatchMedia(escuroInicial) {
  const ouvintes = new Set()
  const consulta = {
    matches: escuroInicial,
    addEventListener: (_, ouvinte) => ouvintes.add(ouvinte),
    removeEventListener: (_, ouvinte) => ouvintes.delete(ouvinte),
  }
  window.matchMedia = vi.fn().mockReturnValue(consulta)
  return {
    disparar(matches) {
      consulta.matches = matches
      ouvintes.forEach((ouvinte) => ouvinte({ matches }))
    },
    ouvintes,
  }
}

describe('PreferenciasProvider / usePreferencias', () => {
  afterEach(() => {
    delete window.matchMedia
    delete document.documentElement.dataset.tema
  })

  it('lança erro fora do provider', () => {
    const erroConsole = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<Leitor />)).toThrow(/dentro de <PreferenciasProvider>/)
    erroConsole.mockRestore()
  })

  it('começa em "sistema" e cai para "claro" quando matchMedia não existe', () => {
    render(
      <PreferenciasProvider>
        <Leitor />
      </PreferenciasProvider>,
    )
    expect(screen.getByTestId('tema')).toHaveTextContent('sistema')
    expect(screen.getByTestId('efetivo')).toHaveTextContent('claro')
    expect(document.documentElement.dataset.tema).toBe('claro')
  })

  it('aplica o tema escolhido no <html> e ignora valores inválidos', async () => {
    const usuario = userEvent.setup()
    render(
      <PreferenciasProvider>
        <Leitor />
      </PreferenciasProvider>,
    )

    await usuario.click(screen.getByRole('button', { name: 'escuro' }))
    expect(screen.getByTestId('efetivo')).toHaveTextContent('escuro')
    expect(document.documentElement.dataset.tema).toBe('escuro')

    await usuario.click(screen.getByRole('button', { name: 'invalido' }))
    expect(screen.getByTestId('tema')).toHaveTextContent('escuro')
  })

  it('respeita temaInicial válido e substitui inválido por "sistema"', () => {
    const { unmount } = render(
      <PreferenciasProvider temaInicial="escuro">
        <Leitor />
      </PreferenciasProvider>,
    )
    expect(screen.getByTestId('tema')).toHaveTextContent('escuro')
    unmount()

    render(
      <PreferenciasProvider temaInicial="neon">
        <Leitor />
      </PreferenciasProvider>,
    )
    expect(screen.getByTestId('tema')).toHaveTextContent('sistema')
  })

  it('segue o tema do sistema e reage a mudanças enquanto "sistema" está ativo', () => {
    const media = simularMatchMedia(true)
    render(
      <PreferenciasProvider>
        <Leitor />
      </PreferenciasProvider>,
    )
    expect(screen.getByTestId('efetivo')).toHaveTextContent('escuro')

    act(() => media.disparar(false))
    expect(screen.getByTestId('efetivo')).toHaveTextContent('claro')
  })

  it('remove o ouvinte do sistema ao sair do modo "sistema"', async () => {
    const usuario = userEvent.setup()
    const media = simularMatchMedia(false)
    render(
      <PreferenciasProvider>
        <Leitor />
      </PreferenciasProvider>,
    )
    expect(media.ouvintes.size).toBe(1)

    await usuario.click(screen.getByRole('button', { name: 'escuro' }))

    expect(media.ouvintes.size).toBe(0)
  })
})

describe('PreferenciasProvider — persistência', () => {
  it('salva a escolha no localStorage e a recupera em uma nova montagem', async () => {
    const usuario = userEvent.setup()
    const { unmount } = render(
      <PreferenciasProvider>
        <Leitor />
      </PreferenciasProvider>,
    )
    await usuario.click(screen.getByRole('button', { name: 'escuro' }))
    expect(window.localStorage.getItem('loja-aurora:tema')).toBe('escuro')
    unmount()

    render(
      <PreferenciasProvider temaInicial="claro">
        <Leitor />
      </PreferenciasProvider>,
    )
    expect(screen.getByTestId('tema')).toHaveTextContent('escuro')
  })

  it('ignora valores inválidos salvos e continua funcionando sem localStorage', () => {
    window.localStorage.setItem('loja-aurora:tema', 'neon')
    const { unmount } = render(
      <PreferenciasProvider>
        <Leitor />
      </PreferenciasProvider>,
    )
    expect(screen.getByTestId('tema')).toHaveTextContent('sistema')
    unmount()

    const getItem = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('bloqueado')
    })
    render(
      <PreferenciasProvider>
        <Leitor />
      </PreferenciasProvider>,
    )
    expect(screen.getByTestId('tema')).toHaveTextContent('sistema')
    getItem.mockRestore()
  })
})
