import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { useCarrinho } from '../context/CarrinhoContext.js'
import CarrinhoProvider from '../context/CarrinhoProvider.jsx'
import ToastProvider from '../context/ToastProvider.jsx'
import PaginaCarrinho from './PaginaCarrinho.jsx'

const BARATO = { id: 1, nome: 'Corda de pular', categoria: 'Esportes', preco: 39.9 }
const CARO = { id: 2, nome: 'Cadeira de escritório', categoria: 'Casa', preco: 849 }

/** Botões auxiliares para popular o carrinho antes de interagir com a página. */
function Semeador() {
  const { adicionar } = useCarrinho()
  return (
    <>
      <button type="button" onClick={() => adicionar(BARATO)}>semear barato</button>
      <button type="button" onClick={() => adicionar(CARO)}>semear caro</button>
    </>
  )
}

function renderizar() {
  return render(
    <MemoryRouter>
      <ToastProvider>
        <CarrinhoProvider>
          <Semeador />
          <PaginaCarrinho />
        </CarrinhoProvider>
      </ToastProvider>
    </MemoryRouter>,
  )
}

describe('PaginaCarrinho', () => {
  it('mostra o estado vazio com link para os produtos', () => {
    renderizar()
    expect(screen.getByRole('heading', { level: 1, name: /carrinho está vazio/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /ir para os produtos/i })).toHaveAttribute('href', '/produtos')
  })

  it('cobra frete abaixo de R$ 300 e informa quanto falta na barra de progresso', async () => {
    const usuario = userEvent.setup()
    renderizar()
    await usuario.click(screen.getByRole('button', { name: 'semear barato' }))

    const barra = screen.getByRole('progressbar')
    expect(barra).toHaveAccessibleName(/faltam R\$\s?260,10 para o frete grátis/i)
    expect(barra).toHaveAttribute('aria-valuenow', '13')
    expect(screen.getByText('R$ 24,90')).toBeInTheDocument()
    // total = 39,90 + 24,90
    expect(screen.getByText('R$ 64,80')).toBeInTheDocument()
  })

  it('libera o frete grátis a partir de R$ 300 e zera o frete no total', async () => {
    const usuario = userEvent.setup()
    renderizar()
    await usuario.click(screen.getByRole('button', { name: 'semear caro' }))

    expect(screen.getByRole('progressbar')).toHaveAccessibleName(/frete grátis/i)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100')
    expect(screen.getByText('Grátis')).toBeInTheDocument()
    expect(screen.getAllByText('R$ 849,00')).toHaveLength(3) // item, subtotal e total
  })

  it('"−" em 1 remove o item com aviso e devolve o foco ao título', async () => {
    const usuario = userEvent.setup()
    renderizar()
    await usuario.click(screen.getByRole('button', { name: 'semear barato' }))
    await usuario.click(screen.getByRole('button', { name: 'semear caro' }))

    const lista = screen.getByRole('list', { name: /itens do carrinho/i })
    expect(within(lista).getAllByRole('listitem')).toHaveLength(2)

    // Com quantidade 1, o "−" remove o item (mesmo efeito da lixeira).
    await usuario.click(screen.getByRole('button', { name: `Diminuir quantidade de ${BARATO.nome}` }))

    expect(within(lista).getAllByRole('listitem')).toHaveLength(1)
    expect(within(lista).getByText(CARO.nome)).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent(`${BARATO.nome} removido do carrinho.`)
    expect(screen.getByRole('heading', { level: 1, name: 'Carrinho' })).toHaveFocus()
  })

  it('"+" aumenta até 10 e então fica desabilitado', async () => {
    const usuario = userEvent.setup()
    renderizar()
    await usuario.click(screen.getByRole('button', { name: 'semear barato' }))
    const mais = screen.getByRole('button', { name: `Aumentar quantidade de ${BARATO.nome}` })

    for (let i = 0; i < 12; i += 1) {
      if (!mais.disabled) await usuario.click(mais)
    }

    expect(screen.getByRole('group', { name: `Quantidade de ${BARATO.nome}` })).toHaveTextContent('10')
    expect(mais).toBeDisabled()
  })

  it('finalizar compra esvazia o carrinho, avisa e foca o título do estado vazio', async () => {
    const usuario = userEvent.setup()
    renderizar()
    await usuario.click(screen.getByRole('button', { name: 'semear caro' }))

    await usuario.click(screen.getByRole('button', { name: /finalizar compra/i }))

    const titulo = screen.getByRole('heading', { level: 1, name: /carrinho está vazio/i })
    expect(titulo).toHaveFocus()
    expect(screen.getByRole('status')).toHaveTextContent(/pedido realizado com sucesso/i)
  })
})
