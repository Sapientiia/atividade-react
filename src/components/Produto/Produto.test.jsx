import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import CartaoProduto from './CartaoProduto.jsx'
import Estrelas from './Estrelas.jsx'
import ImagemProduto from './ImagemProduto.jsx'

const PRODUTO = {
  id: 9,
  nome: 'Padrões de Projeto',
  categoria: 'Livros',
  preco: 139.9,
  precoAntigo: 159.9,
  avaliacao: 4,
  avaliacoes: 150,
  destaque: 'oferta',
}

describe('Estrelas', () => {
  it('arredonda e limita a nota entre 0 e 5 no texto acessível', () => {
    const { rerender } = render(<Estrelas valor={4.6} total={12} />)
    expect(screen.getByRole('img')).toHaveAccessibleName('Avaliação 5 de 5, 12 avaliações')

    rerender(<Estrelas valor={7} />)
    expect(screen.getByRole('img')).toHaveAccessibleName('Avaliação 5 de 5')

    rerender(<Estrelas valor={-1} />)
    expect(screen.getByRole('img')).toHaveAccessibleName('Avaliação 0 de 5')
  })
})

describe('ImagemProduto', () => {
  it('é uma imagem nomeada por padrão e decorativa quando pedido', () => {
    const { rerender } = render(<ImagemProduto produto={PRODUTO} />)
    expect(screen.getByRole('img', { name: `Ilustração de ${PRODUTO.nome}` })).toBeInTheDocument()

    rerender(<ImagemProduto produto={PRODUTO} decorativa />)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('usa o estilo padrão para categoria desconhecida sem quebrar', () => {
    render(<ImagemProduto produto={{ ...PRODUTO, categoria: 'Inexistente' }} />)
    expect(screen.getByRole('img')).toBeInTheDocument()
  })
})

describe('CartaoProduto', () => {
  const renderizar = (props = {}) =>
    render(
      <MemoryRouter>
        <CartaoProduto produto={PRODUTO} aoAdicionar={() => {}} {...props} />
      </MemoryRouter>,
    )

  it('mostra nome, categoria, etiqueta, preços e anuncia o preço anterior', () => {
    renderizar()
    expect(screen.getByRole('heading', { level: 2, name: PRODUTO.nome })).toBeInTheDocument()
    expect(screen.getByText('Livros')).toBeInTheDocument()
    expect(screen.getByText('Oferta')).toBeInTheDocument()
    expect(screen.getByText('R$ 139,90')).toBeInTheDocument()
    expect(screen.getByText(/preço anterior:/i)).toBeInTheDocument()
  })

  it('respeita nivelTitulo e expõe um único link focável para o produto', () => {
    renderizar({ nivelTitulo: 3 })
    expect(screen.getByRole('heading', { level: 3, name: PRODUTO.nome })).toBeInTheDocument()
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(1)
    expect(links[0]).toHaveAttribute('href', `/produtos/${PRODUTO.id}`)
  })

  it('chama aoAdicionar com o produto', async () => {
    const usuario = userEvent.setup()
    const aoAdicionar = vi.fn()
    renderizar({ aoAdicionar })
    await usuario.click(screen.getByRole('button', { name: `Adicionar ${PRODUTO.nome} ao carrinho` }))
    expect(aoAdicionar).toHaveBeenCalledWith(PRODUTO)
  })
})
