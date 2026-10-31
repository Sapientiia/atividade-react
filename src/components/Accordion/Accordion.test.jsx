import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import Accordion from './Accordion.jsx'

const ITENS = [
  { id: 'a', titulo: 'Pergunta A', conteudo: 'Resposta A' },
  { id: 'b', titulo: 'Pergunta B', conteudo: 'Resposta B' },
  { id: 'c', titulo: 'Pergunta C', conteudo: 'Resposta C' },
]

describe('Accordion', () => {
  it('renderiza todos os títulos fechados por padrão', () => {
    render(<Accordion itens={ITENS} />)
    const botoes = screen.getAllByRole('button')
    expect(botoes).toHaveLength(3)
    botoes.forEach((botao) => expect(botao).toHaveAttribute('aria-expanded', 'false'))
  })

  it('abre um item ao clicar e liga botão e painel via aria-controls', async () => {
    const usuario = userEvent.setup()
    render(<Accordion itens={ITENS} />)

    const botaoA = screen.getByRole('button', { name: /pergunta a/i })
    await usuario.click(botaoA)

    expect(botaoA).toHaveAttribute('aria-expanded', 'true')
    const painel = document.getElementById(botaoA.getAttribute('aria-controls'))
    expect(painel).not.toHaveAttribute('inert')
    expect(painel).toHaveTextContent('Resposta A')
  })

  it('mantém apenas um item aberto por vez no modo padrão', async () => {
    const usuario = userEvent.setup()
    render(<Accordion itens={ITENS} />)

    await usuario.click(screen.getByRole('button', { name: /pergunta a/i }))
    await usuario.click(screen.getByRole('button', { name: /pergunta b/i }))

    expect(screen.getByRole('button', { name: /pergunta a/i })).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByRole('button', { name: /pergunta b/i })).toHaveAttribute('aria-expanded', 'true')
  })

  it('fecha o item aberto ao clicar nele novamente', async () => {
    const usuario = userEvent.setup()
    render(<Accordion itens={ITENS} />)
    const botaoA = screen.getByRole('button', { name: /pergunta a/i })

    await usuario.click(botaoA)
    await usuario.click(botaoA)

    expect(botaoA).toHaveAttribute('aria-expanded', 'false')
  })

  it('permite vários itens abertos quando permitirMultiplos=true', async () => {
    const usuario = userEvent.setup()
    render(<Accordion itens={ITENS} permitirMultiplos />)

    await usuario.click(screen.getByRole('button', { name: /pergunta a/i }))
    await usuario.click(screen.getByRole('button', { name: /pergunta c/i }))

    expect(screen.getByRole('button', { name: /pergunta a/i })).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('button', { name: /pergunta c/i })).toHaveAttribute('aria-expanded', 'true')
  })

  it('respeita abertoInicialId', () => {
    render(<Accordion itens={ITENS} abertoInicialId="b" />)
    expect(screen.getByRole('button', { name: /pergunta b/i })).toHaveAttribute('aria-expanded', 'true')
  })

  it('exibe mensagem de vazio quando não há itens', () => {
    render(<Accordion itens={[]} />)
    expect(screen.getByText(/nenhum item para exibir/i)).toBeInTheDocument()
    expect(screen.queryAllByRole('button')).toHaveLength(0)
  })
})

describe('Accordion — regressões', () => {
  it('painel fechado fica inerte e o aberto não', async () => {
    const usuario = userEvent.setup()
    render(<Accordion itens={ITENS} />)
    const botaoA = screen.getByRole('button', { name: /pergunta a/i })
    const painelA = document.getElementById(botaoA.getAttribute('aria-controls'))

    expect(painelA).toHaveAttribute('inert')
    await usuario.click(botaoA)
    expect(painelA).not.toHaveAttribute('inert')
  })

  it('usa o nível de título informado e cai para h3 se inválido', () => {
    const { unmount } = render(<Accordion itens={ITENS} nivelTitulo={2} />)
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(3)
    unmount()

    render(<Accordion itens={ITENS} nivelTitulo={9} />)
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(3)
  })
})
