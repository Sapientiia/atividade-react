import { useId, useState } from 'react'
import { Link } from 'react-router-dom'
import Icone from '../Icone/Icone.jsx'
import { useToast } from '../../context/ToastContext.js'
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

/** Faixa de newsletter: formulário controlado, validado pelo navegador; nada é enviado. */
function Newsletter() {
  const [email, setEmail] = useState('')
  const { adicionarToast } = useToast()
  const idCampo = useId()

  function aoEnviar(evento) {
    evento.preventDefault()
    adicionarToast({ tipo: 'sucesso', mensagem: 'Inscrição realizada! Você receberá nossas ofertas.' })
    setEmail('')
  }

  return (
    <section className={estilos.newsletter} aria-labelledby="titulo-newsletter">
      <div className={`container ${estilos.newsletterInterno}`}>
        <div>
          <h2 id="titulo-newsletter" className={estilos.newsletterTitulo}>
            Receba nossas ofertas
          </h2>
          <p className={estilos.newsletterDescricao}>Cadastre seu e-mail e fique por dentro das novidades.</p>
        </div>
        <form className={estilos.newsletterForm} onSubmit={aoEnviar}>
          <label htmlFor={idCampo} className="sr-only">
            Seu e-mail
          </label>
          <input
            id={idCampo}
            type="email"
            required
            className={estilos.newsletterCampo}
            placeholder="Seu e-mail"
            value={email}
            onChange={(evento) => setEmail(evento.target.value)}
            autoComplete="email"
          />
          <button type="submit" className={estilos.newsletterBotao}>
            Inscrever-se
          </button>
        </form>
      </div>
    </section>
  )
}

export default function Rodape() {
  return (
    <footer className={estilos.rodape}>
      <Newsletter />
      <div className={`container ${estilos.rodapeInterno}`}>
        <div className={estilos.rodapeMarca}>
          <span className={estilos.marcaIcone}>
            <Icone nome="raio" tamanho={22} espessura={2} />
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
