import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import Tabs from './Tabs.jsx'

const ABAS = [
  { id: 'dados', titulo: 'Dados', conteudo: 'Conteúdo de dados' },
  { id: 'endereco', titulo: 'Endereço', conteudo: 'Conteúdo de endereço' },
  { id: 'pedidos', titulo: 'Pedidos', conteudo: 'Conteúdo de pedidos' },
]

describe('Tabs', () => {
  it('ativa a primeira aba por padrão e renderiza apenas o painel dela', () => {
    render(<Tabs abas={ABAS} />)

    expect(screen.getByRole('tab', { name: 'Dados' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'Endereço' })).toHaveAttribute('aria-selected', 'false')
    expect(screen.getAllByRole('tabpanel')).toHaveLength(1)
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Conteúdo de dados')
  })

  it('respeita abaInicialId e usa a primeira aba quando o id não existe', () => {
    const { unmount } = render(<Tabs abas={ABAS} abaInicialId="pedidos" />)
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Conteúdo de pedidos')
    unmount()

    render(<Tabs abas={ABAS} abaInicialId="inexistente" />)
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Conteúdo de dados')
  })

  it('troca de aba ao clicar e dispara aoMudarAba', async () => {
    const usuario = userEvent.setup()
    const aoMudar = vi.fn()
    render(<Tabs abas={ABAS} aoMudarAba={aoMudar} />)

    await usuario.click(screen.getByRole('tab', { name: 'Endereço' }))

    expect(screen.getByRole('tab', { name: 'Endereço' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Conteúdo de endereço')
    expect(aoMudar).toHaveBeenCalledWith('endereco')
  })

  it('não dispara aoMudarAba ao clicar na aba já ativa', async () => {
    const usuario = userEvent.setup()
    const aoMudar = vi.fn()
    render(<Tabs abas={ABAS} aoMudarAba={aoMudar} />)

    await usuario.click(screen.getByRole('tab', { name: 'Dados' }))

    expect(aoMudar).not.toHaveBeenCalled()
  })

  it('navega com as setas do teclado, com ciclo nas extremidades', async () => {
    const usuario = userEvent.setup()
    render(<Tabs abas={ABAS} />)

    screen.getByRole('tab', { name: 'Dados' }).focus()
    await usuario.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: 'Endereço' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'Endereço' })).toHaveFocus()

    await usuario.keyboard('{ArrowLeft}{ArrowLeft}')
    expect(screen.getByRole('tab', { name: 'Pedidos' })).toHaveAttribute('aria-selected', 'true')

    await usuario.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: 'Dados' })).toHaveAttribute('aria-selected', 'true')
  })

  it('Home e End vão para a primeira e última aba', async () => {
    const usuario = userEvent.setup()
    render(<Tabs abas={ABAS} abaInicialId="endereco" />)

    screen.getByRole('tab', { name: 'Endereço' }).focus()
    await usuario.keyboard('{End}')
    expect(screen.getByRole('tab', { name: 'Pedidos' })).toHaveAttribute('aria-selected', 'true')
    await usuario.keyboard('{Home}')
    expect(screen.getByRole('tab', { name: 'Dados' })).toHaveAttribute('aria-selected', 'true')
  })

  it('usa tabindex itinerante: só a aba ativa entra na ordem de Tab', () => {
    render(<Tabs abas={ABAS} />)
    expect(screen.getByRole('tab', { name: 'Dados' })).toHaveAttribute('tabindex', '0')
    expect(screen.getByRole('tab', { name: 'Endereço' })).toHaveAttribute('tabindex', '-1')
  })

  it('exibe mensagem de vazio sem abas', () => {
    render(<Tabs abas={[]} />)
    expect(screen.getByText(/nenhuma aba para exibir/i)).toBeInTheDocument()
  })
})

describe('Tabs — regressões', () => {
  it('só a aba ativa aponta para o painel via aria-controls, e o painel aponta de volta', () => {
    render(<Tabs abas={ABAS} />)
    const abaAtiva = screen.getByRole('tab', { name: 'Dados' })
    const painel = screen.getByRole('tabpanel')
    expect(abaAtiva).toHaveAttribute('aria-controls', painel.id)
    expect(painel).toHaveAttribute('aria-labelledby', abaAtiva.id)
    expect(screen.getByRole('tab', { name: 'Endereço' })).not.toHaveAttribute('aria-controls')
  })

  it('não quebra quando a lista de abas muda e a aba ativa deixa de existir', async () => {
    const usuario = userEvent.setup()
    const { rerender } = render(<Tabs abas={ABAS} abaInicialId="pedidos" />)
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Conteúdo de pedidos')

    const novasAbas = ABAS.filter((aba) => aba.id !== 'pedidos')
    rerender(<Tabs abas={novasAbas} abaInicialId="pedidos" />)
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Conteúdo de dados')

    screen.getByRole('tab', { name: 'Dados' }).focus()
    await usuario.keyboard('{ArrowLeft}')
    expect(screen.getByRole('tab', { name: 'Endereço' })).toHaveAttribute('aria-selected', 'true')
  })

  it('usa o rótulo informado na lista de abas', () => {
    render(<Tabs abas={ABAS} rotulo="Seções do perfil" />)
    expect(screen.getByRole('tablist', { name: 'Seções do perfil' })).toBeInTheDocument()
  })
})
