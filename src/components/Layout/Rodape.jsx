import { Link } from 'react-router-dom'
import Icone from '../Icone/Icone.jsx'
import estilos from './Layout.module.css'

const COLUNAS = [
  {
    titulo: 'Loja',
    links: [
      { para: '/produtos', texto: 'Todos os produtos' },
      { para: '/carrinho', texto: 'Meu carrinho' },
      { para: '/perfil', texto: 'Minha conta' },
    ],
  },
  {
    titulo: 'Ajuda',
    links: [
      { para: '/faq', texto: 'Perguntas frequentes' },
      { para: '/upload', texto: 'Enviar comprovante' },
      { para: '/faq', texto: 'Trocas e devoluções' },
    ],
  },
]

export default function Rodape() {
  return (
    <footer className={estilos.rodape}>
      <div className={`container ${estilos.rodapeInterno}`}>
        <div className={estilos.rodapeMarca}>
          <span className={estilos.marcaIcone}>
            <Icone nome="raio" tamanho={18} espessura={2.5} />
          </span>
          <div>
            <strong>Loja Aurora</strong>
            <p className="texto-suave">Loja fictícia criada para a Atividade ReactJS.</p>
          </div>
        </div>

        {COLUNAS.map((coluna) => (
          <nav key={coluna.titulo} aria-label={`Links de ${coluna.titulo}`}>
            <h2 className={estilos.rodapeTitulo}>{coluna.titulo}</h2>
            <ul className={estilos.rodapeLista}>
              {coluna.links.map((link) => (
                <li key={link.texto}>
                  <Link to={link.para}>{link.texto}</Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div>
          <h2 className={estilos.rodapeTitulo}>Garantias</h2>
          <ul className={`${estilos.rodapeLista} ${estilos.rodapeGarantias}`}>
            <li>
              <Icone nome="caminhao" tamanho={18} /> Entrega em todo o Brasil
            </li>
            <li>
              <Icone nome="escudo" tamanho={18} /> Compra protegida
            </li>
            <li>
              <Icone nome="cartao" tamanho={18} /> Até 10x sem juros
            </li>
          </ul>
        </div>
      </div>
      <div className={`container ${estilos.rodapeBase}`}>
        <p className="texto-fraco">
          Tópicos Avançados em Engenharia de Software · UCSAL 2026.2 · Conteúdo fictício para fins didáticos.
        </p>
      </div>
    </footer>
  )
}
