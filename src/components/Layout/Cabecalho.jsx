import { Link, NavLink } from 'react-router-dom'
import Dropdown from '../Dropdown/Dropdown.jsx'
import Icone from '../Icone/Icone.jsx'
import { useCarrinho } from '../../context/CarrinhoContext.js'
import { usePreferencias } from '../../context/PreferenciasContext.js'
import { useToast } from '../../context/ToastContext.js'
import estilos from './Layout.module.css'

const LINKS = [
  { para: '/', texto: 'Início' },
  { para: '/produtos', texto: 'Produtos' },
  { para: '/faq', texto: 'FAQ' },
  { para: '/perfil', texto: 'Perfil' },
  { para: '/upload', texto: 'Upload' },
]

const OPCOES_TEMA = [
  { id: 'claro', rotulo: 'Claro' },
  { id: 'escuro', rotulo: 'Escuro' },
  { id: 'sistema', rotulo: 'Automático (sistema)' },
]

const ICONE_TEMA = { claro: 'sol', escuro: 'lua', sistema: 'monitor' }

/**
 * Cabeçalho com a navegação principal (React Router), o Menu Suspenso de tema e o
 * atalho do carrinho. Tema e carrinho vêm de contextos globais.
 */
export default function Cabecalho() {
  const { tema, temaEfetivo, setTema } = usePreferencias()
  const { quantidadeTotal } = useCarrinho()
  const { adicionarToast } = useToast()

  function aoEscolherTema(opcao) {
    setTema(opcao.id)
    adicionarToast({ tipo: 'info', mensagem: `Tema alterado para "${opcao.rotulo}".` })
  }

  return (
    <header className={estilos.cabecalho}>
      <div className={`container ${estilos.cabecalhoInterno}`}>
        <Link to="/" className={estilos.marca} aria-label="Loja Aurora, página inicial">
          <span className={estilos.marcaIcone}>
            <Icone nome="raio" tamanho={24} espessura={2} />
          </span>
          <span className={estilos.marcaTexto}>Loja Aurora</span>
        </Link>

        <nav className={estilos.navegacao} aria-label="Navegação principal">
          <ul className={estilos.listaLinks}>
            {LINKS.map((link) => (
              <li key={link.para}>
                <NavLink
                  to={link.para}
                  end={link.para === '/'}
                  className={({ isActive }) => `${estilos.link} ${isActive ? estilos.linkAtivo : ''}`}
                >
                  {link.texto}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className={estilos.acoes}>
          <Dropdown
            rotulo="Tema"
            icone={<Icone nome={ICONE_TEMA[tema] ?? ICONE_TEMA[temaEfetivo]} tamanho={18} />}
            opcoes={OPCOES_TEMA}
            valorSelecionadoId={tema}
            aoSelecionar={aoEscolherTema}
            alinhamento="direita"
          />
          <Link to="/carrinho" className={estilos.carrinho} aria-label={`Carrinho, ${quantidadeTotal} item(ns)`}>
            <Icone nome="carrinho" tamanho={24} espessura={1.75} />
            {quantidadeTotal > 0 && (
              <span className={estilos.carrinhoContador} data-testid="contador-carrinho">
                {quantidadeTotal}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  )
}
