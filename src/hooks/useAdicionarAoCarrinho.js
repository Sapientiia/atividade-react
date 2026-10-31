import { useCallback } from 'react'
import { useCarrinho } from '../context/CarrinhoContext.js'
import { QUANTIDADE_MAXIMA } from '../context/CarrinhoProvider.jsx'
import { useToast } from '../context/ToastContext.js'

/**
 * Combina o carrinho e as notificações: adiciona o produto e avisa o usuário
 * com a quantidade que realmente entrou (ou que o limite foi atingido).
 */
export default function useAdicionarAoCarrinho() {
  const { adicionar } = useCarrinho()
  const { adicionarToast } = useToast()

  return useCallback(
    (produto, quantidade = 1) => {
      const adicionadas = adicionar(produto, quantidade)

      if (adicionadas === 0) {
        adicionarToast({ tipo: 'erro', mensagem: `Limite de ${QUANTIDADE_MAXIMA} unidades de ${produto.nome} atingido.` })
        return
      }
      if (adicionadas < quantidade) {
        adicionarToast({
          tipo: 'info',
          mensagem: `Apenas ${adicionadas} unidade(s) de ${produto.nome} adicionada(s): limite de ${QUANTIDADE_MAXIMA} por item.`,
        })
        return
      }
      const prefixo = adicionadas > 1 ? `${adicionadas}x ` : ''
      adicionarToast({ tipo: 'sucesso', mensagem: `${prefixo}${produto.nome} adicionado ao carrinho.` })
    },
    [adicionar, adicionarToast],
  )
}
