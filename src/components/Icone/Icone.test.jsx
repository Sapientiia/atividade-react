import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Icone from './Icone.jsx'

describe('Icone', () => {
  it('é decorativo por padrão (aria-hidden) e informativo quando recebe rotulo', () => {
    const { container, rerender } = render(<Icone nome="carrinho" />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('aria-hidden', 'true')
    expect(svg).not.toHaveAttribute('role')

    rerender(<Icone nome="carrinho" rotulo="Carrinho" />)
    const informativo = container.querySelector('svg')
    expect(informativo).toHaveAttribute('role', 'img')
    expect(informativo).toHaveAttribute('aria-label', 'Carrinho')
    expect(informativo).not.toHaveAttribute('aria-hidden')
  })

  it('usa o tamanho informado e cai no ícone "info" para nomes desconhecidos', () => {
    const { container } = render(<Icone nome="nao-existe" tamanho={32} />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('width', '32')
    expect(svg.querySelectorAll('path').length).toBeGreaterThan(0)
  })
})
