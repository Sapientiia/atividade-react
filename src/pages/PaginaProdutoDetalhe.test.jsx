import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import CarrinhoProvider from '../context/CarrinhoProvider.jsx'
import ToastProvider from '../context/ToastProvider.jsx'
import { produtos } from '../data/produtos.js'
import PaginaProdutoDetalhe from './PaginaProdutoDetalhe.jsx'

function renderizarEm(caminho) {
  return render(
    <MemoryRouter initialEntries={[caminho]}>
      <ToastProvider>
        <CarrinhoProvider>
          <Routes>
            <Route path="/produtos/:id" element={<PaginaProdutoDetalhe />} />
          </Routes>
        </CarrinhoProvider>
      </ToastProvider>
    </MemoryRouter>,
  )
}

describe('PaginaProdutoDetalhe', () => {
  it('mostra o produto da rota com abas de descrição, especificações e avaliações', () => {
    const produto = produtos[0]
    renderizarEm(`/produtos/${produto.id}`)

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(produto.nome)
    expect(screen.getByRole('tab', { name: 'Descrição' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'Especificações' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /avaliações/i })).toBeInTheDocument()
    expect(screen.getByRole('tabpanel')).toHaveTextContent(produto.descricao)
  })

  it('exibe a página 404 para um id inexistente', () => {
    renderizarEm('/produtos/9999')
    expect(screen.getByRole('heading', { level: 1, name: /página não encontrada/i })).toBeInTheDocument()
  })

  it('controla a quantidade entre 1 e 10 e adiciona ao carrinho com toast', async () => {
    const usuario = userEvent.setup()
    renderizarEm('/produtos/1')
    const menos = screen.getByRole('button', { name: /diminuir quantidade/i })
    const mais = screen.getByRole('button', { name: /aumentar quantidade/i })

    expect(menos).toBeDisabled()
    await usuario.click(mais)
    await usuario.click(mais)
    expect(screen.getByRole('group', { name: 'Quantidade' })).toHaveTextContent('3')

    for (let i = 0; i < 10; i += 1) await usuario.click(mais)
    expect(screen.getByRole('group', { name: 'Quantidade' })).toHaveTextContent('10')
    expect(mais).toBeDisabled()

    await usuario.click(screen.getByRole('button', { name: /adicionar ao carrinho/i }))
    expect(screen.getByRole('status')).toHaveTextContent(/10x .* adicionado ao carrinho/i)
  })
})

describe('PaginaProdutoDetalhe — regressões', () => {
  it('avisa quando o limite de 10 unidades é atingido em vez de confirmar uma adição falsa', async () => {
    const usuario = userEvent.setup()
    renderizarEm('/produtos/1')
    const mais = screen.getByRole('button', { name: /aumentar quantidade/i })
    for (let i = 0; i < 9; i += 1) await usuario.click(mais)

    await usuario.click(screen.getByRole('button', { name: /adicionar ao carrinho/i }))
    expect(screen.getByRole('status')).toHaveTextContent(/10x .* adicionado/i)

    await usuario.click(screen.getByRole('button', { name: /adicionar ao carrinho/i }))
    expect(screen.getByRole('alert')).toHaveTextContent(/limite de 10 unidades/i)
  })

  it('mostra 404 para id não numérico e atualiza o título da aba com o nome do produto', () => {
    renderizarEm('/produtos/abc')
    expect(screen.getByRole('heading', { level: 1, name: /página não encontrada/i })).toBeInTheDocument()

    renderizarEm('/produtos/7')
    expect(document.title).toBe(`${produtos[6].nome} · Loja Aurora`)
  })

  it('abre a aba Especificações e lista os pares chave/valor', async () => {
    const usuario = userEvent.setup()
    renderizarEm('/produtos/1')
    await usuario.click(screen.getByRole('tab', { name: 'Especificações' }))
    const painel = screen.getByRole('tabpanel')
    produtos[0].especificacoes.forEach(([chave, valor]) => {
      expect(within(painel).getByText(chave)).toBeInTheDocument()
      expect(within(painel).getByText(valor)).toBeInTheDocument()
    })
  })
})
