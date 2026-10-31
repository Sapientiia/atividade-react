import estilos from './Layout.module.css'

export default function Rodape() {
  return (
    <footer className={estilos.rodape}>
      <div className="container">
        <p className="texto-suave">
          Atividade ReactJS — Tópicos Avançados em Engenharia de Software · UCSAL 2026.2. Conteúdo fictício para
          fins didáticos.
        </p>
      </div>
    </footer>
  )
}
