import { useCallback, useMemo, useState } from 'react'
import { CarrinhoContext } from './CarrinhoContext.js'

export const QUANTIDADE_MAXIMA = 10

/** Converte a entrada em inteiro seguro; devolve null para valores não numéricos. */
function paraInteiro(valor) {
  const numero = Math.trunc(Number(valor))
  return Number.isFinite(numero) ? numero : null
}

export default function CarrinhoProvider({ children }) {
  // itens: [{ produto, quantidade }]
  const [itens, setItens] = useState([])

  /**
   * Adiciona `quantidade` unidades do produto, respeitando o limite por item.
   * Devolve quantas unidades entraram de fato (0 quando o limite já foi atingido),
   * para que a interface avise corretamente o usuário.
   */
  const adicionar = useCallback(
    (produto, quantidade = 1) => {
      const pedida = paraInteiro(quantidade)
      const qtd = pedida && pedida > 0 ? pedida : 1
      const existente = itens.find((item) => item.produto.id === produto.id)
      const atual = existente ? existente.quantidade : 0
      const adicionadas = Math.max(0, Math.min(QUANTIDADE_MAXIMA, atual + qtd) - atual)

      if (adicionadas === 0) return 0

      setItens((atuais) => {
        const jaExiste = atuais.some((item) => item.produto.id === produto.id)
        if (jaExiste) {
          return atuais.map((item) =>
            item.produto.id === produto.id ? { ...item, quantidade: atual + adicionadas } : item,
          )
        }
        return [...atuais, { produto, quantidade: adicionadas }]
      })
      return adicionadas
    },
    [itens],
  )

  /** Define a quantidade de um item (1..máximo). Zero ou menos remove o item; entrada inválida é ignorada. */
  const alterarQuantidade = useCallback((produtoId, quantidade) => {
    const nova = paraInteiro(quantidade)
    if (nova === null) return
    setItens((atuais) =>
      atuais
        .map((item) =>
          item.produto.id === produtoId ? { ...item, quantidade: Math.min(QUANTIDADE_MAXIMA, nova) } : item,
        )
        .filter((item) => item.quantidade > 0),
    )
  }, [])

  const remover = useCallback((produtoId) => {
    setItens((atuais) => atuais.filter((item) => item.produto.id !== produtoId))
  }, [])

  const limpar = useCallback(() => setItens([]), [])

  const valor = useMemo(() => {
    const quantidadeTotal = itens.reduce((soma, item) => soma + item.quantidade, 0)
    const subtotal = itens.reduce((soma, item) => soma + item.produto.preco * item.quantidade, 0)
    return { itens, quantidadeTotal, subtotal, adicionar, alterarQuantidade, remover, limpar }
  }, [itens, adicionar, alterarQuantidade, remover, limpar])

  return <CarrinhoContext.Provider value={valor}>{children}</CarrinhoContext.Provider>
}
