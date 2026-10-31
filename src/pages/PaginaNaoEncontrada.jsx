import { Link } from 'react-router-dom'
import Icone from '../components/Icone/Icone.jsx'
import estilos from './Paginas.module.css'

export default function PaginaNaoEncontrada() {
  return (
    <section className={`cartao ${estilos.estadoVazio}`} aria-labelledby="titulo-404">
      <span className={estilos.estadoVazioIcone}>
        <Icone nome="alerta" tamanho={36} />
      </span>
      <h1 id="titulo-404">Página não encontrada</h1>
      <p className="texto-suave">O endereço acessado não existe nesta aplicação.</p>
      <Link to="/" className="botao">
        <Icone nome="casa" tamanho={18} /> Voltar para o início
      </Link>
    </section>
  )
}
