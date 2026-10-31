import { Link } from 'react-router-dom'

export default function PaginaNaoEncontrada() {
  return (
    <section className="cartao" aria-labelledby="titulo-404">
      <h1 id="titulo-404">Página não encontrada</h1>
      <p className="texto-suave">O endereço acessado não existe nesta aplicação.</p>
      <Link to="/" className="botao">
        Voltar para o início
      </Link>
    </section>
  )
}
