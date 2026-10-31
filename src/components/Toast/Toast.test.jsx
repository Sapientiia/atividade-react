import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Toast from './Toast.jsx'
import ToastContainer from './ToastContainer.jsx'

// Estes testes usam timers falsos. Os cliques usam fireEvent (síncrono) porque
// userEvent aguarda temporizadores internos e trava com vi.useFakeTimers().
describe('Toast', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('exibe a mensagem com role="status" para sucesso e info', () => {
    const { rerender } = render(<Toast id={1} tipo="sucesso" mensagem="Salvo!" aoFechar={() => {}} />)
    expect(screen.getByRole('status')).toHaveTextContent('Salvo!')

    rerender(<Toast id={1} tipo="info" mensagem="Aviso" aoFechar={() => {}} />)
    expect(screen.getByRole('status')).toHaveTextContent('Aviso')
  })

  it('usa role="alert" para erro', () => {
    render(<Toast id={1} tipo="erro" mensagem="Falhou" aoFechar={() => {}} />)
    expect(screen.getByRole('alert')).toHaveTextContent('Falhou')
  })

  it('trata tipo desconhecido como info', () => {
    render(<Toast id={1} tipo="qualquer" mensagem="Teste" aoFechar={() => {}} />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('fecha sozinho após a duração informada', () => {
    const aoFechar = vi.fn()
    render(<Toast id={7} mensagem="Temporário" duracao={3000} aoFechar={aoFechar} />)

    act(() => {
      vi.advanceTimersByTime(2999)
    })
    expect(aoFechar).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(aoFechar).toHaveBeenCalledWith(7)
  })

  it('não fecha sozinho quando duracao é 0', () => {
    const aoFechar = vi.fn()
    render(<Toast id={1} mensagem="Fixo" duracao={0} aoFechar={aoFechar} />)

    act(() => {
      vi.advanceTimersByTime(60000)
    })
    expect(aoFechar).not.toHaveBeenCalled()
  })

  it('cancela o temporizador ao desmontar', () => {
    const aoFechar = vi.fn()
    const { unmount } = render(<Toast id={1} mensagem="X" duracao={1000} aoFechar={aoFechar} />)

    unmount()
    act(() => {
      vi.advanceTimersByTime(5000)
    })
    expect(aoFechar).not.toHaveBeenCalled()
  })

  it('fecha ao clicar no botão de fechar', () => {
    const aoFechar = vi.fn()
    render(<Toast id={3} mensagem="Fechável" aoFechar={aoFechar} />)

    fireEvent.click(screen.getByRole('button', { name: /fechar notificação/i }))

    expect(aoFechar).toHaveBeenCalledWith(3)
  })
})

describe('ToastContainer', () => {
  it('mantém a região ao vivo montada mesmo sem toasts (leitores de tela só anunciam em regiões já existentes)', () => {
    render(<ToastContainer toasts={[]} aoFechar={() => {}} />)
    const regiao = screen.getByRole('region', { name: 'Notificações' })
    expect(regiao).toHaveAttribute('aria-live', 'polite')
    expect(regiao).toBeEmptyDOMElement()
  })

  it('renderiza uma região "Notificações" com todos os toasts', () => {
    const toasts = [
      { id: 1, tipo: 'info', mensagem: 'Um', duracao: 0 },
      { id: 2, tipo: 'erro', mensagem: 'Dois', duracao: 0 },
    ]
    render(<ToastContainer toasts={toasts} aoFechar={() => {}} />)

    expect(screen.getByRole('region', { name: 'Notificações' })).toBeInTheDocument()
    expect(screen.getAllByTestId('toast')).toHaveLength(2)
  })
})
