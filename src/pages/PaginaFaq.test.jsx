import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { perguntasFrequentes } from '../data/faq.js'
import PaginaFaq from './PaginaFaq.jsx'

describe('PaginaFaq', () => {
  it('lista todas as perguntas do FAQ', () => {
    render(<PaginaFaq />)
    perguntasFrequentes.forEach((pergunta) => {
      expect(screen.getByRole('button', { name: pergunta.titulo })).toBeInTheDocument()
    })
  })

  it('alterna entre "uma por vez" e "várias abertas" pela caixa de seleção', async () => {
    const usuario = userEvent.setup()
    render(<PaginaFaq />)
    const [primeira, segunda] = perguntasFrequentes

    await usuario.click(screen.getByRole('button', { name: primeira.titulo }))
    await usuario.click(screen.getByRole('button', { name: segunda.titulo }))
    expect(screen.getByRole('button', { name: primeira.titulo })).toHaveAttribute('aria-expanded', 'false')

    await usuario.click(screen.getByRole('checkbox', { name: /permitir várias/i }))
    await usuario.click(screen.getByRole('button', { name: primeira.titulo }))
    await usuario.click(screen.getByRole('button', { name: segunda.titulo }))
    expect(screen.getByRole('button', { name: primeira.titulo })).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('button', { name: segunda.titulo })).toHaveAttribute('aria-expanded', 'true')
  })
})
