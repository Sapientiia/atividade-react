import { Link } from 'react-router-dom'
import CartaoProduto from '../components/Produto/CartaoProduto.jsx'
import Icone from '../components/Icone/Icone.jsx'
import { useToast } from '../context/ToastContext.js'
import useAdicionarAoCarrinho from '../hooks/useAdicionarAoCarrinho.js'
import { produtos } from '../data/produtos.js'
import estilos from './Paginas.module.css'

const COMPONENTES = [
  { para: '/faq', icone: 'lista', titulo: 'Acordeão', descricao: 'Perguntas frequentes com seções expansíveis e transição suave.' },
  { para: '/produtos', icone: 'setaDireita', titulo: 'Paginação', descricao: 'Catálogo dividido em páginas com indicação da página atual.' },
  { para: '/upload', icone: 'atividade', titulo: 'Barra de Progresso', descricao: 'Upload simulado com percentual atualizado em tempo real.' },
  { para: '/perfil', icone: 'camadas', titulo: 'Abas', descricao: 'Perfil do cliente organizado em painéis navegáveis por teclado.' },
  { para: '/produtos', icone: 'filtro', titulo: 'Menu Suspenso', descricao: 'Filtro por categoria e seleção de tema no cabeçalho.' },
  { para: '#titulo-toast', icone: 'sino', titulo: 'Notificação Toast', descricao: 'Feedback de sucesso, erro e informação disparado de qualquer tela.' },
]

const GARANTIAS = [
  { icone: 'caminhao', titulo: 'Entrega rápida', texto: 'Capitais em até 5 dias úteis' },
  { icone: 'escudo', titulo: 'Compra protegida', texto: '7 dias para troca ou devolução' },
  { icone: 'cartao', titulo: 'Até 10x sem juros', texto: 'Ou 5% de desconto no PIX' },
]

/** Página inicial: hero, garantias, destaques do catálogo, mapa dos componentes e demonstração do Toast. */
export default function PaginaInicial() {
  const { adicionarToast } = useToast()
  const adicionarAoCarrinho = useAdicionarAoCarrinho()
  const destaques = produtos.filter((produto) => produto.destaque === 'oferta').slice(0, 3)

  return (
    <>
      <section className={estilos.heroi} aria-labelledby="titulo-inicial">
        <div className={estilos.heroiConteudo}>
          <span className="etiqueta etiqueta--primaria">
            <Icone nome="raio" tamanho={14} /> Coleção 2026
          </span>
          <h1 id="titulo-inicial">
            Tudo o que você precisa, <span className={estilos.heroiDestaque}>em um só lugar</span>.
          </h1>
          <p className={estilos.subtitulo}>
            Eletrônicos, livros, casa e esportes com entrega rápida e pagamento facilitado. Uma loja fictícia que
            demonstra seis componentes React em uso real.
          </p>
          <div className={estilos.grupoBotoes}>
            <Link to="/produtos" className="botao">
              Ver produtos <Icone nome="setaDireita" tamanho={18} />
            </Link>
            <Link to="/faq" className="botao botao--secundario">
              Tirar dúvidas
            </Link>
          </div>
        </div>
        <ul className={estilos.garantias} aria-label="Garantias da loja">
          {GARANTIAS.map((item) => (
            <li key={item.titulo} className={estilos.garantia}>
              <span className={estilos.garantiaIcone}>
                <Icone nome={item.icone} tamanho={22} />
              </span>
              <div>
                <strong>{item.titulo}</strong>
                <span className="texto-suave">{item.texto}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="secao" aria-labelledby="titulo-destaques">
        <div className="secao__cabecalho">
          <div>
            <span className="sobretitulo">
              <Icone nome="etiqueta" tamanho={14} /> Ofertas
            </span>
            <h2 id="titulo-destaques">Destaques da semana</h2>
          </div>
          <Link to="/produtos" className="botao botao--fantasma botao--pequeno">
            Ver catálogo completo <Icone nome="setaDireita" tamanho={16} />
          </Link>
        </div>
        <ul className={estilos.gradeProdutos}>
          {destaques.map((produto) => (
            <li key={produto.id}>
              <CartaoProduto produto={produto} aoAdicionar={adicionarAoCarrinho} nivelTitulo={3} />
            </li>
          ))}
        </ul>
      </section>

      <section className="secao" aria-labelledby="titulo-componentes">
        <div className="secao__cabecalho">
          <div>
            <span className="sobretitulo">
              <Icone nome="camadas" tamanho={14} /> Atividade
            </span>
            <h2 id="titulo-componentes">Os seis componentes</h2>
          </div>
          <p className="texto-suave">Cada card leva à página em que o componente é usado.</p>
        </div>
        <ul className={estilos.grade}>
          {COMPONENTES.map((item) => {
            // Âncora na própria página usa <a>; as demais usam o Link do React Router.
            const Elemento = item.para.startsWith('#') ? 'a' : Link
            const destino = item.para.startsWith('#') ? { href: item.para } : { to: item.para }
            return (
              <li key={item.titulo}>
                <Elemento {...destino} className={`cartao cartao--interativo ${estilos.cartaoComponente}`}>
                  <span className={estilos.cartaoIcone}>
                    <Icone nome={item.icone} tamanho={22} />
                  </span>
                  <h3>{item.titulo}</h3>
                  <p className="texto-suave">{item.descricao}</p>
                  <span className={estilos.cartaoLink}>
                    Abrir <Icone nome="setaDireita" tamanho={16} />
                  </span>
                </Elemento>
              </li>
            )
          })}
        </ul>
      </section>

      <section className={`cartao ${estilos.cartaoToast}`} aria-labelledby="titulo-toast">
        <div>
          <span className="sobretitulo">
            <Icone nome="sino" tamanho={14} /> Notificação Toast
          </span>
          <h2 id="titulo-toast">Experimente as notificações</h2>
          <p className="texto-suave">
            Disparadas de qualquer componente por um contexto global, somem após alguns segundos ou ao clicar em
            fechar.
          </p>
        </div>
        <div className={estilos.grupoBotoes}>
          <button
            type="button"
            className="botao botao--sucesso"
            onClick={() => adicionarToast({ tipo: 'sucesso', mensagem: 'Pedido salvo com sucesso!' })}
          >
            <Icone nome="check" tamanho={18} /> Toast de sucesso
          </button>
          <button
            type="button"
            className="botao botao--erro"
            onClick={() => adicionarToast({ tipo: 'erro', mensagem: 'Erro ao salvar: tente novamente.' })}
          >
            <Icone nome="alerta" tamanho={18} /> Toast de erro
          </button>
          <button
            type="button"
            className="botao"
            onClick={() => adicionarToast({ tipo: 'info', mensagem: 'Você tem 3 itens no carrinho.' })}
          >
            <Icone nome="info" tamanho={18} /> Toast de informação
          </button>
        </div>
      </section>
    </>
  )
}
