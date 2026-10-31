/**
 * Calcula quais páginas aparecem na barra, inserindo reticências quando a
 * sequência é longa. Exemplo (atual=5, total=10): [1, '…', 4, 5, 6, '…', 10].
 * Fica em arquivo próprio para ser testada isoladamente.
 */
export function calcularPaginasVisiveis(atual, total, vizinhos = 1) {
  if (!Number.isInteger(total) || total <= 0) return []
  if (total <= 5 + 2 * vizinhos) {
    return Array.from({ length: total }, (_, indice) => indice + 1)
  }

  const conjunto = new Set([1, total])
  for (let pagina = atual - vizinhos; pagina <= atual + vizinhos; pagina += 1) {
    if (pagina >= 1 && pagina <= total) conjunto.add(pagina)
  }

  const ordenadas = [...conjunto].sort((a, b) => a - b)
  const resultado = []
  ordenadas.forEach((pagina, indice) => {
    if (indice > 0 && pagina - ordenadas[indice - 1] > 1) {
      resultado.push({ tipo: 'reticencias', chave: `reticencias-${pagina}` })
    }
    resultado.push(pagina)
  })
  return resultado
}
