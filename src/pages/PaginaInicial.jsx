import { Link } from 'react-router-dom'
import { useToast } from '../context/ToastContext.js'
import estilos from './Paginas.module.css'

const DEMONSTRACOES = [
  { para: '/faq', titulo: 'Acordeão', descricao: 'Perguntas frequentes com seções expansíveis.' },
  { para: '/produtos', titulo: 'Paginação + Menu Suspenso', descricao: 'Catálogo com filtro por categoria e páginas.' },
  { para: '/perfil', titulo: 'Abas', descricao: 'Perfil do cliente organizado em painéis.' },
  { para: '/upload', titulo: 'Barra de Progresso', descricao: 'Upload simulado com progresso em tempo real.' },
]

/** Página inicial: apresenta a aplicação e demonstra o Toast com os três tipos. */
export default function PaginaInicial() {
  const { adicionarToast } = useToast()

  return (
    <>
      <section className={estilos.heroi} aria-labelledby="titulo-inicial">
        <h1 id="titulo-inicial">Loja Aurora</h1>
        <p className={estilos.subtitulo}>
          Aplicação React responsiva que reúne seis componentes visuais: Acordeão, Paginação, Barra de Progresso,
          Abas, Menu Suspenso e Notificação Toast. Navegue pelas páginas para ver cada um em uso.
        </p>
      </section>

      <section aria-labelledby="titulo-demos">
        <h2 id="titulo-demos">Demonstrações</h2>
        <ul className={estilos.grade}>
          {DEMONSTRACOES.map((demo) => (
            <li key={demo.para} className={`cartao ${estilos.cartaoDemo}`}>
              <h3>{demo.titulo}</h3>
              <p className="texto-suave">{demo.descricao}</p>
              <Link to={demo.para} className="botao botao--secundario">
                Abrir
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="cartao" aria-labelledby="titulo-toast">
        <h2 id="titulo-toast">Notificação Toast</h2>
        <p className="texto-suave">
          As notificações são disparadas de qualquer componente por meio de um contexto global e somem sozinhas após
          alguns segundos (ou ao clicar em fechar).
        </p>
        <div className={estilos.grupoBotoes}>
          <button
            type="button"
            className="botao botao--sucesso"
            onClick={() => adicionarToast({ tipo: 'sucesso', mensagem: 'Pedido salvo com sucesso!' })}
          >
            Toast de sucesso
          </button>
          <button
            type="button"
            className="botao botao--erro"
            onClick={() => adicionarToast({ tipo: 'erro', mensagem: 'Erro ao salvar: tente novamente.' })}
          >
            Toast de erro
          </button>
          <button
            type="button"
            className="botao"
            onClick={() => adicionarToast({ tipo: 'info', mensagem: 'Você tem 3 itens no carrinho.' })}
          >
            Toast de informação
          </button>
        </div>
      </section>
    </>
  )
}
