import { createContext, useContext } from 'react'

/**
 * Contexto global do carrinho de compras.
 * Alimentado pela página de produtos e lido pelo contador do cabeçalho e pela página do carrinho.
 */
export const CarrinhoContext = createContext(null)

export function useCarrinho() {
  const contexto = useContext(CarrinhoContext)
  if (!contexto) {
    throw new Error('useCarrinho deve ser usado dentro de <CarrinhoProvider>.')
  }
  return contexto
}
