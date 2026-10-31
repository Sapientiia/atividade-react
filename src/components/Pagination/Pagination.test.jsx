import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import Pagination from './Pagination.jsx'

describe('Pagination', () => {
  it('não renderiza nada quando totalPaginas é 0 ou inválido', () => {
    const { container } = render(<Pagination paginaAtual={1} totalPaginas={0} aoMudarPagina={() => {}} />)
    expect(container).toBeEmptyDOMElement()
    const { container: outro } = render(<Pagination paginaAtual={1} totalPaginas="x" aoMudarPagina={() => {}} />)
    expect(outro).toBeEmptyDOMElement()
  })

  it('desabilita "Anterior" na primeira página e "Próxima" na última', () => {
    const { rerender } = render(<Pagination paginaAtual={1} totalPaginas={3} aoMudarPagina={() => {}} />)
    expect(screen.getByRole('button', { name: /página anterior/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /próxima página/i })).toBeEnabled()

    rerender(<Pagination paginaAtual={3} totalPaginas={3} aoMudarPagina={() => {}} />)
    expect(screen.getByRole('button', { name: /página anterior/i })).toBeEnabled()
    expect(screen.getByRole('button', { name: /próxima página/i })).toBeDisabled()
  })

  it('marca a página atual com aria-current="page" e exibe o resumo', () => {
    render(<Pagination paginaAtual={2} totalPaginas={4} aoMudarPagina={() => {}} />)
    expect(screen.getByRole('button', { name: 'Página 2' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('button', { name: 'Página 1' })).not.toHaveAttribute('aria-current')
    expect(screen.getByText('Página 2 de 4')).toBeInTheDocument()
  })

  it('chama o callback com a página clicada, anterior e próxima', async () => {
    const usuario = userEvent.setup()
    const aoMudar = vi.fn()
    render(<Pagination paginaAtual={2} totalPaginas={5} aoMudarPagina={aoMudar} />)

    await usuario.click(screen.getByRole('button', { name: 'Página 4' }))
    await usuario.click(screen.getByRole('button', { name: /página anterior/i }))
    await usuario.click(screen.getByRole('button', { name: /próxima página/i }))

    expect(aoMudar.mock.calls).toEqual([[4], [1], [3]])
  })

  it('não chama o callback ao clicar na página já selecionada', async () => {
    const usuario = userEvent.setup()
    const aoMudar = vi.fn()
    render(<Pagination paginaAtual={2} totalPaginas={5} aoMudarPagina={aoMudar} />)

    await usuario.click(screen.getByRole('button', { name: 'Página 2' }))

    expect(aoMudar).not.toHaveBeenCalled()
  })

  it('limita paginaAtual ao intervalo válido', () => {
    render(<Pagination paginaAtual={99} totalPaginas={3} aoMudarPagina={() => {}} />)
    expect(screen.getByRole('button', { name: 'Página 3' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('button', { name: /próxima página/i })).toBeDisabled()
  })

  it('exibe reticências em listas longas sem renderizar todas as páginas', () => {
    render(<Pagination paginaAtual={10} totalPaginas={20} aoMudarPagina={() => {}} />)
    const numeros = screen.getAllByRole('button', { name: /^Página \d+$/ }).map((b) => b.textContent)
    expect(numeros).toEqual(['1', '9', '10', '11', '20'])
    expect(screen.getAllByText('…')).toHaveLength(2)
  })

  it('usa o rótulo acessível informado no <nav>', () => {
    render(<Pagination paginaAtual={1} totalPaginas={2} aoMudarPagina={() => {}} rotulo="Páginas de produtos" />)
    expect(screen.getByRole('navigation', { name: 'Páginas de produtos' })).toBeInTheDocument()
  })
})
