import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import ToastProvider from '../context/ToastProvider.jsx'
import { produtos } from '../data/produtos.js'
import PaginaProdutos from './PaginaProdutos.jsx'

function renderizar() {
  return render(
    <ToastProvider>
      <PaginaProdutos />
    </ToastProvider>,
  )
}

const nomesNaTela = () =>
  within(screen.getByRole('list', { name: /lista de produtos/i }))
    .getAllByRole('heading', { level: 2 })
    .map((h) => h.textContent)

describe('PaginaProdutos', () => {
  it('mostra 6 produtos por página e o total de páginas correto', () => {
    renderizar()
    expect(nomesNaTela()).toHaveLength(6)
    expect(screen.getByText(`${produtos.length} produto(s) encontrado(s)`)).toBeInTheDocument()
    expect(screen.getByText(`Página 1 de ${Math.ceil(produtos.length / 6)}`)).toBeInTheDocument()
  })

  it('troca os produtos exibidos ao navegar para a próxima página', async () => {
    const usuario = userEvent.setup()
    renderizar()
    const primeiraPagina = nomesNaTela()

    await usuario.click(screen.getByRole('button', { name: /próxima página/i }))

    expect(nomesNaTela()).not.toEqual(primeiraPagina)
    expect(screen.getByRole('button', { name: 'Página 2' })).toHaveAttribute('aria-current', 'page')
  })

  it('filtra por categoria, volta para a página 1 e avisa com um toast', async () => {
    const usuario = userEvent.setup()
    renderizar()

    await usuario.click(screen.getByRole('button', { name: /próxima página/i }))
    await usuario.click(screen.getByRole('button', { name: /categoria/i }))
    await usuario.click(screen.getByRole('menuitemradio', { name: 'Livros' }))

    const totalLivros = produtos.filter((p) => p.categoria === 'Livros').length
    expect(screen.getByText(`${totalLivros} produto(s) encontrado(s)`)).toBeInTheDocument()
    expect(nomesNaTela()).toHaveLength(Math.min(6, totalLivros))
    expect(screen.getByRole('button', { name: 'Página 1' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('status')).toHaveTextContent('Filtro aplicado: Livros.')
  })
})
