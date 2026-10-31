import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import CarrinhoProvider from '../context/CarrinhoProvider.jsx'
import ToastProvider from '../context/ToastProvider.jsx'
import { produtos } from '../data/produtos.js'
import PaginaProdutos from './PaginaProdutos.jsx'

function renderizar() {
  return render(
    <MemoryRouter>
      <ToastProvider>
        <CarrinhoProvider>
          <PaginaProdutos />
        </CarrinhoProvider>
      </ToastProvider>
    </MemoryRouter>,
  )
}

const listaProdutos = () => screen.getByRole('list', { name: /lista de produtos/i })
const nomesNaTela = () =>
  within(listaProdutos())
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

  it('filtra por categoria com esqueleto de carregamento, volta para a página 1 e avisa com um toast', async () => {
    const usuario = userEvent.setup()
    renderizar()

    await usuario.click(screen.getByRole('button', { name: /próxima página/i }))
    await usuario.click(screen.getByRole('button', { name: /categoria/i }))
    await usuario.click(screen.getByRole('menuitemradio', { name: 'Livros' }))

    // Enquanto "carrega", a lista dá lugar ao esqueleto.
    expect(screen.getAllByTestId('esqueleto-produto')).toHaveLength(6)
    expect(screen.queryByRole('list', { name: /lista de produtos/i })).not.toBeInTheDocument()

    const totalLivros = produtos.filter((p) => p.categoria === 'Livros').length
    await waitFor(() => expect(listaProdutos()).toBeInTheDocument())
    expect(screen.getByText(`${totalLivros} produto(s) encontrado(s)`)).toBeInTheDocument()
    expect(nomesNaTela()).toHaveLength(Math.min(6, totalLivros))
    expect(screen.getByRole('button', { name: 'Página 1' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('status')).toHaveTextContent('Filtro aplicado: Livros.')
  })

  it('ordena por menor preço', async () => {
    const usuario = userEvent.setup()
    renderizar()

    await usuario.click(screen.getByRole('button', { name: /ordenar/i }))
    await usuario.click(screen.getByRole('menuitemradio', { name: 'Menor preço' }))
    await waitFor(() => expect(listaProdutos()).toBeInTheDocument())

    const maisBarato = [...produtos].sort((a, b) => a.preco - b.preco)[0]
    expect(nomesNaTela()[0]).toBe(maisBarato.nome)
  })

  it('adiciona um produto ao carrinho e avisa com um toast', async () => {
    const usuario = userEvent.setup()
    renderizar()
    const primeiro = within(listaProdutos()).getAllByRole('button', { name: /adicionar .* ao carrinho/i })[0]

    await usuario.click(primeiro)

    expect(screen.getByRole('status')).toHaveTextContent(/adicionado ao carrinho/i)
  })
})
