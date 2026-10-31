import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Icone from '../components/Icone/Icone.jsx'
import ImagemProduto from '../components/Produto/ImagemProduto.jsx'
import ProgressBar from '../components/ProgressBar/ProgressBar.jsx'
import { useCarrinho } from '../context/CarrinhoContext.js'
import { useToast } from '../context/ToastContext.js'
import { formatadorMoeda } from '../data/produtos.js'
import estilos from './Paginas.module.css'

const FRETE_GRATIS_A_PARTIR_DE = 300
const FRETE_PADRAO = 24.9

/** Carrinho: lê o contexto global, reutiliza a Barra de Progresso para a meta de frete grátis. */
export default function PaginaCarrinho() {
  const { itens, subtotal, quantidadeTotal, alterarQuantidade, remover, limpar } = useCarrinho()
  const { adicionarToast } = useToast()
  const tituloRef = useRef(null)
  const [focarTitulo, setFocarTitulo] = useState(false)

  // Quando um botão focado some do DOM (item removido, compra finalizada), o foco
  // iria para o <body>. Em vez disso, levamos o foco para o título da página.
  useEffect(() => {
    if (!focarTitulo) return
    tituloRef.current?.focus()
    setFocarTitulo(false)
  }, [focarTitulo, itens.length])

  const freteGratis = subtotal >= FRETE_GRATIS_A_PARTIR_DE
  const frete = itens.length === 0 || freteGratis ? 0 : FRETE_PADRAO
  const total = subtotal + frete
  const progressoFrete = Math.min(100, (subtotal / FRETE_GRATIS_A_PARTIR_DE) * 100)
  const faltaParaFrete = Math.max(0, FRETE_GRATIS_A_PARTIR_DE - subtotal)

  function finalizar() {
    limpar()
    setFocarTitulo(true)
    adicionarToast({ tipo: 'sucesso', mensagem: 'Pedido realizado com sucesso! Obrigado pela compra.' })
  }

  function removerItem(produto) {
    remover(produto.id)
    setFocarTitulo(true)
    adicionarToast({ tipo: 'info', mensagem: `${produto.nome} removido do carrinho.` })
  }

  function diminuir(produto, quantidade) {
    if (quantidade <= 1) {
      removerItem(produto)
      return
    }
    alterarQuantidade(produto.id, quantidade - 1)
  }

  if (itens.length === 0) {
    return (
      <section className={`cartao ${estilos.estadoVazio}`} aria-labelledby="titulo-carrinho">
        <span className={estilos.estadoVazioIcone}>
          <Icone nome="carrinho" tamanho={36} />
        </span>
        <h1 id="titulo-carrinho" ref={tituloRef} tabIndex={-1}>
          Seu carrinho está vazio
        </h1>
        <p className="texto-suave">Adicione produtos pelo catálogo para vê-los aqui.</p>
        <Link to="/produtos" className="botao">
          Ir para os produtos <Icone nome="setaDireita" tamanho={18} />
        </Link>
      </section>
    )
  }

  return (
    <>
      <div className={estilos.cabecalhoPagina}>
        <div>
          <span className="sobretitulo">
            <Icone nome="carrinho" tamanho={14} /> Compras
          </span>
          <h1 ref={tituloRef} tabIndex={-1}>
            Carrinho
          </h1>
        </div>
        <p className="texto-suave">{quantidadeTotal} item(ns)</p>
      </div>

      <div className={estilos.carrinhoLayout}>
        <ul className={estilos.listaCarrinho} aria-label="Itens do carrinho">
          {itens.map(({ produto, quantidade }) => (
            <li key={produto.id} className={`cartao ${estilos.itemCarrinho}`}>
              <ImagemProduto produto={produto} tamanhoIcone={28} className={estilos.itemImagem} decorativa />
              <div className={estilos.itemInfo}>
                <Link to={`/produtos/${produto.id}`} className={estilos.itemNome}>
                  {produto.nome}
                </Link>
                <span className="texto-fraco">{produto.categoria}</span>
              </div>
              <div className={estilos.quantidade} role="group" aria-label={`Quantidade de ${produto.nome}`}>
                <button
                  type="button"
                  className="botao botao--secundario botao--icone botao--pequeno"
                  onClick={() => diminuir(produto, quantidade)}
                  aria-label={`Diminuir quantidade de ${produto.nome}`}
                >
                  <Icone nome="menos" tamanho={14} />
                </button>
                <span className={estilos.quantidadeValor}>{quantidade}</span>
                <button
                  type="button"
                  className="botao botao--secundario botao--icone botao--pequeno"
                  onClick={() => alterarQuantidade(produto.id, quantidade + 1)}
                  aria-label={`Aumentar quantidade de ${produto.nome}`}
                  disabled={quantidade >= 10}
                >
                  <Icone nome="mais" tamanho={14} />
                </button>
              </div>
              <span className={estilos.itemPreco}>{formatadorMoeda.format(produto.preco * quantidade)}</span>
              <button
                type="button"
                className={`botao botao--fantasma botao--icone ${estilos.itemRemover}`}
                onClick={() => removerItem(produto)}
                aria-label={`Remover ${produto.nome} do carrinho`}
              >
                <Icone nome="lixeira" tamanho={18} />
              </button>
            </li>
          ))}
        </ul>

        <aside className={`cartao ${estilos.resumo}`} aria-labelledby="titulo-resumo">
          <h2 id="titulo-resumo">Resumo</h2>
          <ProgressBar
            valor={progressoFrete}
            rotulo={freteGratis ? 'Você ganhou frete grátis!' : `Faltam ${formatadorMoeda.format(faltaParaFrete)} para o frete grátis`}
            cor={freteGratis ? 'sucesso' : 'primaria'}
            mostrarPercentual={false}
          />
          <dl className={estilos.resumoLinhas}>
            <div>
              <dt>Subtotal</dt>
              <dd>{formatadorMoeda.format(subtotal)}</dd>
            </div>
            <div>
              <dt>Frete</dt>
              <dd>{frete === 0 ? 'Grátis' : formatadorMoeda.format(frete)}</dd>
            </div>
            <div className={estilos.resumoTotal}>
              <dt>Total</dt>
              <dd>{formatadorMoeda.format(total)}</dd>
            </div>
          </dl>
          <button type="button" className="botao" onClick={finalizar}>
            <Icone nome="check" tamanho={18} /> Finalizar compra
          </button>
          <Link to="/produtos" className="botao botao--fantasma">
            Continuar comprando
          </Link>
        </aside>
      </div>
    </>
  )
}
