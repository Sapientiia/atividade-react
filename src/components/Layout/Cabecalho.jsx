import { NavLink } from 'react-router-dom'
import Dropdown from '../Dropdown/Dropdown.jsx'
import { usePreferencias } from '../../context/PreferenciasContext.js'
import { useToast } from '../../context/ToastContext.js'
import estilos from './Layout.module.css'

const LINKS = [
  { para: '/', texto: 'Início' },
  { para: '/faq', texto: 'FAQ' },
  { para: '/produtos', texto: 'Produtos' },
  { para: '/perfil', texto: 'Perfil' },
  { para: '/upload', texto: 'Upload' },
]

const OPCOES_TEMA = [
  { id: 'claro', rotulo: 'Claro' },
  { id: 'escuro', rotulo: 'Escuro' },
  { id: 'sistema', rotulo: 'Automático (sistema)' },
]

/**
 * Cabeçalho com a navegação principal (React Router) e o Menu Suspenso de tema.
 * O tema escolhido aqui é lido em outras páginas através do contexto global.
 */
export default function Cabecalho() {
  const { tema, setTema } = usePreferencias()
  const { adicionarToast } = useToast()

  function aoEscolherTema(opcao) {
    setTema(opcao.id)
    adicionarToast({ tipo: 'info', mensagem: `Tema alterado para "${opcao.rotulo}".` })
  }

  return (
    <header className={estilos.cabecalho}>
      <div className={`container ${estilos.cabecalhoInterno}`}>
        <NavLink to="/" className={estilos.marca}>
          <span aria-hidden="true">◆</span> Loja Aurora
        </NavLink>

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
            opcoes={OPCOES_TEMA}
            valorSelecionadoId={tema}
            aoSelecionar={aoEscolherTema}
            alinhamento="direita"
          />
        </div>
      </div>
    </header>
  )
}
