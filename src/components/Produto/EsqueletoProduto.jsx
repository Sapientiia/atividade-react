import estilos from './Produto.module.css'

/** Placeholder animado exibido enquanto a listagem "carrega". */
export default function EsqueletoProduto() {
  return (
    <div className={`cartao ${estilos.cartao}`} aria-hidden="true" data-testid="esqueleto-produto">
      <div className={`esqueleto ${estilos.imagem}`} />
      <div className={estilos.corpo}>
        <div className="esqueleto" style={{ width: '40%', height: 12 }} />
        <div className="esqueleto" style={{ width: '85%', height: 18 }} />
        <div className="esqueleto" style={{ width: '55%', height: 12 }} />
        <div className="esqueleto" style={{ width: '35%', height: 22 }} />
      </div>
    </div>
  )
}
