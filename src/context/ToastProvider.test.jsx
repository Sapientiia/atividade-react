import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { useToast } from './ToastContext.js'
import ToastProvider from './ToastProvider.jsx'

/** Componente auxiliar que expõe o hook por meio de botões. */
function Disparador({ toast }) {
  const { adicionarToast, toasts } = useToast()
  return (
    <>
      <button type="button" onClick={() => adicionarToast(toast)}>
        disparar
      </button>
      <span data-testid="quantidade">{toasts.length}</span>
    </>
  )
}

describe('ToastProvider / useToast', () => {
  it('lança erro quando useToast é usado fora do provider', () => {
    const erroConsole = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<Disparador toast={{ mensagem: 'x' }} />)).toThrow(/dentro de <ToastProvider>/)
    erroConsole.mockRestore()
  })

  it('exibe um toast ao chamar adicionarToast e remove ao fechar', async () => {
    const usuario = userEvent.setup()
    render(
      <ToastProvider>
        <Disparador toast={{ tipo: 'sucesso', mensagem: 'Pedido salvo', duracao: 0 }} />
      </ToastProvider>,
    )

    await usuario.click(screen.getByRole('button', { name: 'disparar' }))
    expect(screen.getByRole('status')).toHaveTextContent('Pedido salvo')
    expect(screen.getByTestId('quantidade')).toHaveTextContent('1')

    await usuario.click(screen.getByRole('button', { name: /fechar notificação/i }))
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(screen.getByTestId('quantidade')).toHaveTextContent('0')
  })

  it('ignora mensagens vazias ou não textuais', async () => {
    const usuario = userEvent.setup()
    const avisoConsole = vi.spyOn(console, 'warn').mockImplementation(() => {})
    render(
      <ToastProvider>
        <Disparador toast={{ mensagem: '   ' }} />
      </ToastProvider>,
    )

    await usuario.click(screen.getByRole('button', { name: 'disparar' }))

    expect(screen.queryByTestId('toast')).not.toBeInTheDocument()
    expect(screen.getByTestId('quantidade')).toHaveTextContent('0')
    avisoConsole.mockRestore()
  })

  it('converte tipo desconhecido em "info"', async () => {
    const usuario = userEvent.setup()
    render(
      <ToastProvider>
        <Disparador toast={{ tipo: 'invalido', mensagem: 'Olá', duracao: 0 }} />
      </ToastProvider>,
    )

    await usuario.click(screen.getByRole('button', { name: 'disparar' }))

    expect(screen.getByRole('status')).toHaveTextContent('Olá')
  })

  it('mantém no máximo 5 toasts, descartando os mais antigos', async () => {
    const usuario = userEvent.setup()
    render(
      <ToastProvider>
        <Disparador toast={{ mensagem: 'Repetido', duracao: 0 }} />
      </ToastProvider>,
    )

    const botao = screen.getByRole('button', { name: 'disparar' })
    for (let i = 0; i < 7; i += 1) {
      await usuario.click(botao)
    }

    expect(screen.getAllByTestId('toast')).toHaveLength(5)
    expect(screen.getByTestId('quantidade')).toHaveTextContent('5')
  })
})

describe('ToastProvider — regressões', () => {
  it('substitui duração inválida pelo padrão em vez de fechar imediatamente', async () => {
    const usuario = userEvent.setup()
    render(
      <ToastProvider>
        <Disparador toast={{ mensagem: 'Com duração inválida', duracao: 'abc' }} />
      </ToastProvider>,
    )

    await usuario.click(screen.getByRole('button', { name: 'disparar' }))

    expect(screen.getByRole('status')).toHaveTextContent('Com duração inválida')
    expect(screen.getByTestId('quantidade')).toHaveTextContent('1')
  })
})
