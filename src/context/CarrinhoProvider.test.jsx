import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { useCarrinho } from './CarrinhoContext.js'
import CarrinhoProvider from './CarrinhoProvider.jsx'

const PRODUTO_A = { id: 1, nome: 'A', preco: 10 }
const PRODUTO_B = { id: 2, nome: 'B', preco: 25.5 }

function Painel() {
  const { itens, quantidadeTotal, subtotal, adicionar, alterarQuantidade, remover, limpar } = useCarrinho()
  return (
    <>
      <span data-testid="qtd">{quantidadeTotal}</span>
      <span data-testid="subtotal">{subtotal.toFixed(2)}</span>
      <span data-testid="itens">{itens.map((i) => `${i.produto.id}x${i.quantidade}`).join(',')}</span>
      <button type="button" onClick={() => adicionar(PRODUTO_A)}>add A</button>
      <button type="button" onClick={() => adicionar(PRODUTO_B, 3)}>add B x3</button>
      <button type="button" onClick={() => adicionar(PRODUTO_A, 50)}>add A x50</button>
      <button type="button" onClick={() => adicionar(PRODUTO_A, -2)}>add A invalido</button>
      <button type="button" onClick={() => alterarQuantidade(1, 0)}>zerar A</button>
      <button type="button" onClick={() => remover(2)}>remover B</button>
      <button type="button" onClick={limpar}>limpar</button>
    </>
  )
}

const renderizar = () =>
  render(
    <CarrinhoProvider>
      <Painel />
    </CarrinhoProvider>,
  )

describe('CarrinhoProvider / useCarrinho', () => {
  it('lança erro fora do provider', () => {
    const erroConsole = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<Painel />)).toThrow(/dentro de <CarrinhoProvider>/)
    erroConsole.mockRestore()
  })

  it('adiciona itens, soma quantidades repetidas e calcula o subtotal', async () => {
    const usuario = userEvent.setup()
    renderizar()

    await usuario.click(screen.getByRole('button', { name: 'add A' }))
    await usuario.click(screen.getByRole('button', { name: 'add A' }))
    await usuario.click(screen.getByRole('button', { name: 'add B x3' }))

    expect(screen.getByTestId('itens')).toHaveTextContent('1x2,2x3')
    expect(screen.getByTestId('qtd')).toHaveTextContent('5')
    expect(screen.getByTestId('subtotal')).toHaveTextContent((10 * 2 + 25.5 * 3).toFixed(2))
  })

  it('limita a quantidade por item a 10 e trata quantidade inválida como 1', async () => {
    const usuario = userEvent.setup()
    renderizar()

    await usuario.click(screen.getByRole('button', { name: 'add A x50' }))
    expect(screen.getByTestId('itens')).toHaveTextContent('1x10')

    await usuario.click(screen.getByRole('button', { name: 'limpar' }))
    await usuario.click(screen.getByRole('button', { name: 'add A invalido' }))
    expect(screen.getByTestId('itens')).toHaveTextContent('1x1')
  })

  it('remove o item quando a quantidade chega a zero, remove por id e limpa tudo', async () => {
    const usuario = userEvent.setup()
    renderizar()

    await usuario.click(screen.getByRole('button', { name: 'add A' }))
    await usuario.click(screen.getByRole('button', { name: 'add B x3' }))
    await usuario.click(screen.getByRole('button', { name: 'zerar A' }))
    expect(screen.getByTestId('itens')).toHaveTextContent('2x3')

    await usuario.click(screen.getByRole('button', { name: 'remover B' }))
    expect(screen.getByTestId('itens')).toBeEmptyDOMElement()

    await usuario.click(screen.getByRole('button', { name: 'add A' }))
    await usuario.click(screen.getByRole('button', { name: 'limpar' }))
    expect(screen.getByTestId('qtd')).toHaveTextContent('0')
  })
})

describe('CarrinhoProvider — regressões', () => {
  function Sonda() {
    const { itens, quantidadeTotal, adicionar, alterarQuantidade } = useCarrinho()
    return (
      <>
        <span data-testid="itens">{itens.map((i) => `${i.produto.id}x${i.quantidade}`).join(',')}</span>
        <span data-testid="qtd">{quantidadeTotal}</span>
        <span data-testid="tipo-qtd">{typeof quantidadeTotal}</span>
        <button type="button" onClick={() => adicionar(PRODUTO_A, 8)}>add 8</button>
        <button type="button" onClick={() => adicionar(PRODUTO_A, 5)}>add 5</button>
        <button type="button" onClick={() => alterarQuantidade(1, 11)}>alterar 11</button>
        <button type="button" onClick={() => alterarQuantidade(1, '3')}>alterar "3"</button>
        <button type="button" onClick={() => alterarQuantidade(1, NaN)}>alterar NaN</button>
        <button type="button" onClick={() => alterarQuantidade(1, 'abc')}>alterar abc</button>
      </>
    )
  }

  it('adicionar devolve quantas unidades entraram de fato (parcial e zero no limite)', async () => {
    const usuario = userEvent.setup()
    const retornos = []
    function Captura() {
      const { adicionar } = useCarrinho()
      return (
        <>
          <button type="button" onClick={() => retornos.push(adicionar(PRODUTO_A, 8))}>r8</button>
          <button type="button" onClick={() => retornos.push(adicionar(PRODUTO_A, 5))}>r5</button>
        </>
      )
    }
    render(
      <CarrinhoProvider>
        <Captura />
      </CarrinhoProvider>,
    )

    await usuario.click(screen.getByRole('button', { name: 'r8' }))
    await usuario.click(screen.getByRole('button', { name: 'r5' }))
    await usuario.click(screen.getByRole('button', { name: 'r5' }))

    expect(retornos).toEqual([8, 2, 0])
  })

  it('alterarQuantidade limita a 10 em vez de remover, aceita string numérica e ignora inválidos', async () => {
    const usuario = userEvent.setup()
    render(
      <CarrinhoProvider>
        <Sonda />
      </CarrinhoProvider>,
    )

    await usuario.click(screen.getByRole('button', { name: 'add 8' }))
    await usuario.click(screen.getByRole('button', { name: 'alterar 11' }))
    expect(screen.getByTestId('itens')).toHaveTextContent('1x10')

    await usuario.click(screen.getByRole('button', { name: 'alterar "3"' }))
    expect(screen.getByTestId('itens')).toHaveTextContent('1x3')
    expect(screen.getByTestId('qtd')).toHaveTextContent('3')
    expect(screen.getByTestId('tipo-qtd')).toHaveTextContent('number')

    await usuario.click(screen.getByRole('button', { name: 'alterar NaN' }))
    await usuario.click(screen.getByRole('button', { name: 'alterar abc' }))
    expect(screen.getByTestId('itens')).toHaveTextContent('1x3')
  })
})
