import { describe, expect, it } from 'vitest'
import { calcularPaginasVisiveis } from './calcularPaginasVisiveis.js'

/** Converte o resultado em uma forma legível: números ficam, reticências viram '…'. */
const simplificar = (lista) => lista.map((item) => (typeof item === 'number' ? item : '…'))

describe('calcularPaginasVisiveis', () => {
  it('retorna lista vazia para total 0, negativo ou inválido', () => {
    expect(calcularPaginasVisiveis(1, 0)).toEqual([])
    expect(calcularPaginasVisiveis(1, -3)).toEqual([])
    expect(calcularPaginasVisiveis(1, NaN)).toEqual([])
  })

  it('lista todas as páginas quando o total é pequeno', () => {
    expect(calcularPaginasVisiveis(1, 1)).toEqual([1])
    expect(calcularPaginasVisiveis(3, 7)).toEqual([1, 2, 3, 4, 5, 6, 7])
  })

  it('insere reticências dos dois lados quando a página está no meio', () => {
    expect(simplificar(calcularPaginasVisiveis(5, 10))).toEqual([1, '…', 4, 5, 6, '…', 10])
  })

  it('insere reticências apenas à direita no início', () => {
    expect(simplificar(calcularPaginasVisiveis(1, 10))).toEqual([1, 2, '…', 10])
  })

  it('insere reticências apenas à esquerda no fim', () => {
    expect(simplificar(calcularPaginasVisiveis(10, 10))).toEqual([1, '…', 9, 10])
  })

  it('não insere reticências quando a lacuna é de uma única página', () => {
    // atual=3: vizinhos 2 e 4; 1 e 2 são consecutivos, logo sem reticências à esquerda.
    expect(simplificar(calcularPaginasVisiveis(3, 10))).toEqual([1, 2, 3, 4, '…', 10])
  })

  it('gera chaves únicas para as reticências', () => {
    const chaves = calcularPaginasVisiveis(5, 10)
      .filter((item) => typeof item !== 'number')
      .map((item) => item.chave)
    expect(new Set(chaves).size).toBe(chaves.length)
  })
})
