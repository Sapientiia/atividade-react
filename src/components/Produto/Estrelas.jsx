import Icone from '../Icone/Icone.jsx'
import estilos from './Produto.module.css'

/** Avaliação em estrelas (0 a 5), com texto acessível em vez de cinco ícones soltos. */
export default function Estrelas({ valor = 0, total, tamanho = 14 }) {
  const nota = Math.max(0, Math.min(5, Math.round(valor)))
  return (
    <span className={estilos.estrelas} role="img" aria-label={`Avaliação ${nota} de 5${total ? `, ${total} avaliações` : ''}`}>
      {Array.from({ length: 5 }, (_, indice) => (
        <Icone
          key={indice}
          nome="estrela"
          tamanho={tamanho}
          className={indice < nota ? estilos.estrelaCheia : estilos.estrelaVazia}
        />
      ))}
      {total !== undefined && <span className={estilos.estrelasTotal}>({total})</span>}
    </span>
  )
}
