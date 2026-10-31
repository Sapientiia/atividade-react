import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import ToastProvider from '../context/ToastProvider.jsx'
import PaginaUpload from './PaginaUpload.jsx'

function renderizar() {
  return render(
    <ToastProvider>
      <PaginaUpload />
    </ToastProvider>,
  )
}

// Cliques com fireEvent (síncrono): userEvent trava sob vi.useFakeTimers().
describe('PaginaUpload', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('começa em 0% com "Cancelar" desabilitado', () => {
    renderizar()
    expect(screen.getByRole('progressbar', { name: 'Aguardando envio' })).toHaveAttribute('aria-valuenow', '0')
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeDisabled()
  })

  it('avança o progresso até 100% e mostra toast de sucesso', () => {
    renderizar()

    fireEvent.click(screen.getByRole('button', { name: /iniciar upload/i }))
    expect(screen.getByRole('button', { name: /iniciar upload/i })).toBeDisabled()

    act(() => {
      vi.advanceTimersByTime(150 * 3)
    })
    expect(screen.getByRole('progressbar', { name: 'Enviando arquivo' })).toHaveAttribute('aria-valuenow', '12')

    act(() => {
      vi.advanceTimersByTime(150 * 30)
    })
    expect(screen.getByRole('progressbar', { name: 'Envio concluído' })).toHaveAttribute('aria-valuenow', '100')
    expect(screen.getByRole('status')).toHaveTextContent('Upload concluído com sucesso!')
    expect(screen.getByRole('button', { name: /enviar novamente/i })).toBeEnabled()
  })

  it('cancelar zera o progresso e mostra toast de erro', () => {
    renderizar()

    fireEvent.click(screen.getByRole('button', { name: /iniciar upload/i }))
    act(() => {
      vi.advanceTimersByTime(150 * 5)
    })
    expect(screen.getByRole('progressbar', { name: 'Enviando arquivo' })).toHaveAttribute('aria-valuenow', '20')

    fireEvent.click(screen.getByRole('button', { name: /cancelar/i }))

    expect(screen.getByRole('progressbar', { name: 'Aguardando envio' })).toHaveAttribute('aria-valuenow', '0')
    expect(screen.getByRole('alert')).toHaveTextContent('Upload cancelado pelo usuário.')

    // O intervalo foi cancelado: o progresso não volta a subir.
    act(() => {
      vi.advanceTimersByTime(150 * 10)
    })
    expect(screen.getByRole('progressbar', { name: 'Aguardando envio' })).toHaveAttribute('aria-valuenow', '0')
  })
})
