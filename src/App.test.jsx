import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from './App.jsx'

/** Define a URL antes de renderizar, já que o App usa BrowserRouter. */
function renderizarEm(caminho = '/') {
  window.history.pushState({}, '', caminho)
  return render(<App />)
}

describe('App (integração)', () => {
  afterEach(() => {
    window.history.pushState({}, '', '/')
    delete document.documentElement.dataset.tema
  })

  it('renderiza a página inicial com cabeçalho, navegação e rodapé', () => {
    renderizarEm('/')
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: /navegação principal/i })).toBeInTheDocument()
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/tudo o que você precisa/i)
  })

  it('navega entre as páginas pelos links (React Router)', async () => {
    const usuario = userEvent.setup()
    renderizarEm('/')
    const navegacao = screen.getByRole('navigation', { name: /navegação principal/i })

    await usuario.click(within(navegacao).getByRole('link', { name: 'FAQ' }))
    expect(screen.getByRole('heading', { level: 1, name: /perguntas frequentes/i })).toBeInTheDocument()

    await usuario.click(within(navegacao).getByRole('link', { name: 'Perfil' }))
    expect(screen.getByRole('tablist')).toBeInTheDocument()

    await usuario.click(within(navegacao).getByRole('link', { name: 'Upload' }))
    expect(screen.getAllByRole('progressbar').length).toBeGreaterThan(0)

    await usuario.click(within(navegacao).getByRole('link', { name: 'Produtos' }))
    expect(screen.getByRole('navigation', { name: 'Paginação' })).toBeInTheDocument()
  })

  it('mostra a página 404 para rotas desconhecidas', () => {
    renderizarEm('/nao-existe')
    expect(screen.getByRole('heading', { level: 1, name: /página não encontrada/i })).toBeInTheDocument()
  })

  it('compartilha o tema entre o cabeçalho e a aba Preferências via contexto global', async () => {
    const usuario = userEvent.setup()
    renderizarEm('/perfil')

    await usuario.click(screen.getByRole('button', { name: /^tema/i }))
    await usuario.click(screen.getByRole('menuitemradio', { name: 'Escuro' }))

    expect(document.documentElement.dataset.tema).toBe('escuro')
    expect(screen.getByRole('status')).toHaveTextContent('Tema alterado para "Escuro".')

    await usuario.click(screen.getByRole('tab', { name: 'Preferências' }))
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Tema escolhido')
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Escuro')
  })

  it('dispara os três tipos de toast na página inicial', async () => {
    const usuario = userEvent.setup()
    renderizarEm('/')

    await usuario.click(screen.getByRole('button', { name: /toast de sucesso/i }))
    await usuario.click(screen.getByRole('button', { name: /toast de erro/i }))
    await usuario.click(screen.getByRole('button', { name: /toast de informação/i }))

    expect(screen.getAllByRole('status')).toHaveLength(2)
    expect(screen.getByRole('alert')).toHaveTextContent('Erro ao salvar')
  })
})

describe('App (carrinho)', () => {
  it('adiciona produtos pelo catálogo, mostra o contador no cabeçalho e finaliza a compra', async () => {
    const usuario = userEvent.setup()
    renderizarEm('/produtos')

    const lista = screen.getByRole('list', { name: /lista de produtos/i })
    const [primeiro, segundo] = within(lista).getAllByRole('button', { name: /adicionar .* ao carrinho/i })
    await usuario.click(primeiro)
    await usuario.click(primeiro)
    await usuario.click(segundo)

    expect(screen.getByTestId('contador-carrinho')).toHaveTextContent('3')

    await usuario.click(screen.getByRole('link', { name: /carrinho, 3 item/i }))
    expect(screen.getByRole('heading', { level: 1, name: 'Carrinho' })).toBeInTheDocument()
    expect(within(screen.getByRole('list', { name: /itens do carrinho/i })).getAllByRole('listitem')).toHaveLength(2)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()

    await usuario.click(screen.getByRole('button', { name: /finalizar compra/i }))
    expect(screen.getByRole('heading', { level: 1, name: /carrinho está vazio/i })).toBeInTheDocument()
    expect(screen.queryByTestId('contador-carrinho')).not.toBeInTheDocument()
  })
})

describe('App (troca de rota)', () => {
  it('atualiza o título da aba, volta ao topo e move o foco para o conteúdo', async () => {
    const usuario = userEvent.setup()
    const rolagem = vi.spyOn(window, 'scrollTo')
    renderizarEm('/')
    expect(document.title).toBe('Início · Loja Aurora')

    const navegacao = screen.getByRole('navigation', { name: /navegação principal/i })
    await usuario.click(within(navegacao).getByRole('link', { name: 'FAQ' }))

    expect(document.title).toBe('Perguntas frequentes · Loja Aurora')
    expect(rolagem).toHaveBeenLastCalledWith(0, 0)
    expect(screen.getByRole('main')).toHaveFocus()
    rolagem.mockRestore()
  })
})
