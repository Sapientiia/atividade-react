/** Garante um número entre 0 e 100; valores inválidos (NaN, texto, null) viram 0. */
export function normalizarProgresso(valor) {
  const numero = Number(valor)
  if (!Number.isFinite(numero)) return 0
  return Math.min(100, Math.max(0, numero))
}
