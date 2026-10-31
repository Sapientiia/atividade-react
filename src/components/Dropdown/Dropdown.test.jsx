import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import Dropdown from './Dropdown.jsx'

const OPCOES = [
  { id: 'claro', rotulo: 'Claro' },
  { id: 'escuro', rotulo: 'Escuro' },
  { id: 'sistema', rotulo: 'Sistema' },
]

describe('Dropdown', () => {
  it('começa fechado e abre ao clicar no botão', async () => {
    const usuario = userEvent.setup()
    render(<Dropdown rotulo="Tema" opcoes={OPCOES} />)

    const botao = screen.getByRole('button', { name: /tema/i })
    expect(botao).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()

    await usuario.click(botao)

    expect(botao).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('menu', { name: 'Tema' })).toBeInTheDocument()
    expect(screen.getAllByRole('menuitemradio')).toHaveLength(3)
  })

  it('chama o callback da opção e o geral, e fecha ao selecionar', async () => {
    const usuario = userEvent.setup()
    const aoSelecionarGeral = vi.fn()
    const aoSelecionarEscuro = vi.fn()
    const opcoes = OPCOES.map((o) => (o.id === 'escuro' ? { ...o, aoSelecionar: aoSelecionarEscuro } : o))
    render(<Dropdown rotulo="Tema" opcoes={opcoes} aoSelecionar={aoSelecionarGeral} />)

    await usuario.click(screen.getByRole('button', { name: /tema/i }))
    await usuario.click(screen.getByRole('menuitemradio', { name: 'Escuro' }))

    expect(aoSelecionarEscuro).toHaveBeenCalledTimes(1)
    expect(aoSelecionarGeral).toHaveBeenCalledWith(expect.objectContaining({ id: 'escuro', rotulo: 'Escuro' }))
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /tema/i })).toHaveFocus()
  })

  it('fecha ao clicar fora do componente', async () => {
    const usuario = userEvent.setup()
    render(
      <>
        <Dropdown rotulo="Tema" opcoes={OPCOES} />
        <p>Fora</p>
      </>,
    )

    await usuario.click(screen.getByRole('button', { name: /tema/i }))
    expect(screen.getByRole('menu')).toBeInTheDocument()

    fireEvent.mouseDown(screen.getByText('Fora'))

    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('não fecha ao clicar dentro do próprio menu', async () => {
    const usuario = userEvent.setup()
    render(<Dropdown rotulo="Tema" opcoes={OPCOES} />)

    await usuario.click(screen.getByRole('button', { name: /tema/i }))
    fireEvent.mouseDown(screen.getByRole('menu'))

    expect(screen.getByRole('menu')).toBeInTheDocument()
  })

  it('fecha com Escape e devolve o foco ao botão', async () => {
    const usuario = userEvent.setup()
    render(<Dropdown rotulo="Tema" opcoes={OPCOES} />)

    await usuario.click(screen.getByRole('button', { name: /tema/i }))
    screen.getByRole('menuitemradio', { name: 'Claro' }).focus()
    await usuario.keyboard('{Escape}')

    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /tema/i })).toHaveFocus()
  })

  it('abre com ArrowDown e foca o primeiro item; setas navegam com ciclo', async () => {
    const usuario = userEvent.setup()
    render(<Dropdown rotulo="Tema" opcoes={OPCOES} />)

    screen.getByRole('button', { name: /tema/i }).focus()
    await usuario.keyboard('{ArrowDown}')

    await waitFor(() => expect(screen.getByRole('menuitemradio', { name: 'Claro' })).toHaveFocus())

    await usuario.keyboard('{ArrowUp}')
    expect(screen.getByRole('menuitemradio', { name: 'Sistema' })).toHaveFocus()
    await usuario.keyboard('{ArrowDown}')
    expect(screen.getByRole('menuitemradio', { name: 'Claro' })).toHaveFocus()
    await usuario.keyboard('{End}')
    expect(screen.getByRole('menuitemradio', { name: 'Sistema' })).toHaveFocus()
    await usuario.keyboard('{Home}')
    expect(screen.getByRole('menuitemradio', { name: 'Claro' })).toHaveFocus()
  })

  it('marca a opção selecionada e mostra o rótulo dela no botão', async () => {
    const usuario = userEvent.setup()
    render(<Dropdown rotulo="Tema" opcoes={OPCOES} valorSelecionadoId="escuro" />)

    expect(screen.getByRole('button', { name: /tema/i })).toHaveTextContent('Escuro')
    await usuario.click(screen.getByRole('button', { name: /tema/i }))

    expect(screen.getByRole('menuitemradio', { name: 'Escuro' })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('menuitemradio', { name: 'Claro' })).toHaveAttribute('aria-checked', 'false')
  })

  it('exibe aviso quando não há opções', async () => {
    const usuario = userEvent.setup()
    render(<Dropdown rotulo="Vazio" opcoes={[]} />)

    await usuario.click(screen.getByRole('button', { name: /vazio/i }))

    expect(screen.getByText(/nenhuma opção disponível/i)).toBeInTheDocument()
    expect(screen.queryAllByRole('menuitemradio')).toHaveLength(0)
  })
})

describe('Dropdown — regressões', () => {
  it('fecha com Escape e com Tab quando o foco está no botão', async () => {
    const usuario = userEvent.setup()
    render(<Dropdown rotulo="Tema" opcoes={OPCOES} />)
    const botao = screen.getByRole('button', { name: /tema/i })

    await usuario.click(botao)
    expect(screen.getByRole('menu')).toBeInTheDocument()
    await usuario.keyboard('{Escape}')
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()

    await usuario.click(botao)
    expect(screen.getByRole('menu')).toBeInTheDocument()
    await usuario.tab()
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('não renderiza role="menu" vazio: a mensagem fica fora de um menu ARIA', async () => {
    const usuario = userEvent.setup()
    render(<Dropdown rotulo="Vazio" opcoes={[]} />)
    await usuario.click(screen.getByRole('button', { name: /vazio/i }))
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(screen.getByText(/nenhuma opção disponível/i)).toBeInTheDocument()
  })
})
