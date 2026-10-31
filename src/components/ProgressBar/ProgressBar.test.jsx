import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import ProgressBar from './ProgressBar.jsx'
import { normalizarProgresso } from './normalizarProgresso.js'

describe('normalizarProgresso', () => {
  it('mantém valores dentro de 0..100', () => {
    expect(normalizarProgresso(0)).toBe(0)
    expect(normalizarProgresso(42.5)).toBe(42.5)
    expect(normalizarProgresso(100)).toBe(100)
  })

  it('limita valores fora do intervalo', () => {
    expect(normalizarProgresso(150)).toBe(100)
    expect(normalizarProgresso(-20)).toBe(0)
  })

  it('trata entradas inválidas como 0', () => {
    expect(normalizarProgresso('abc')).toBe(0)
    expect(normalizarProgresso(NaN)).toBe(0)
    expect(normalizarProgresso(undefined)).toBe(0)
    expect(normalizarProgresso(Infinity)).toBe(0)
  })
})

describe('ProgressBar', () => {
  it('preenche a barra conforme o valor e expõe os atributos ARIA', () => {
    render(<ProgressBar valor={45} rotulo="Enviando arquivo" />)

    const barra = screen.getByRole('progressbar', { name: 'Enviando arquivo' })
    expect(barra).toHaveAttribute('aria-valuenow', '45')
    expect(barra).toHaveAttribute('aria-valuemin', '0')
    expect(barra).toHaveAttribute('aria-valuemax', '100')
    expect(screen.getByTestId('preenchimento')).toHaveStyle({ width: '45%' })
    expect(screen.getByTestId('percentual')).toHaveTextContent('45%')
  })

  it('limita valores acima de 100 e abaixo de 0', () => {
    const { rerender } = render(<ProgressBar valor={250} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100')
    expect(screen.getByTestId('preenchimento')).toHaveStyle({ width: '100%' })

    rerender(<ProgressBar valor={-10} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0')
    expect(screen.getByTestId('preenchimento')).toHaveStyle({ width: '0%' })
  })

  it('arredonda o percentual exibido mas mantém a largura exata', () => {
    render(<ProgressBar valor={33.6} />)
    expect(screen.getByTestId('percentual')).toHaveTextContent('34%')
    expect(screen.getByTestId('preenchimento')).toHaveStyle({ width: '33.6%' })
  })

  it('oculta o percentual quando mostrarPercentual=false', () => {
    render(<ProgressBar valor={10} mostrarPercentual={false} />)
    expect(screen.queryByTestId('percentual')).not.toBeInTheDocument()
  })

  it('usa o rótulo padrão quando nenhum é informado', () => {
    render(<ProgressBar />)
    expect(screen.getByRole('progressbar', { name: 'Progresso' })).toHaveAttribute('aria-valuenow', '0')
  })
})
