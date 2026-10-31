import Tabs from '../components/Tabs/Tabs.jsx'
import { usePreferencias } from '../context/PreferenciasContext.js'
import estilos from './Paginas.module.css'

const NOMES_TEMA = { claro: 'Claro', escuro: 'Escuro', sistema: 'Automático (sistema)' }

/** Conteúdo da aba de preferências: lê o tema do contexto global, sem relação direta com o cabeçalho. */
function PainelPreferencias() {
  const { tema, temaEfetivo, setTema } = usePreferencias()

  return (
    <>
      <h2>Preferências</h2>
      <dl className={estilos.listaDefinicoes}>
        <dt>Tema escolhido</dt>
        <dd>{NOMES_TEMA[tema]}</dd>
        <dt>Tema em uso</dt>
        <dd>{NOMES_TEMA[temaEfetivo]}</dd>
      </dl>
      <button
        type="button"
        className="botao botao--secundario"
        onClick={() => setTema(temaEfetivo === 'escuro' ? 'claro' : 'escuro')}
      >
        Alternar para tema {temaEfetivo === 'escuro' ? 'claro' : 'escuro'}
      </button>
    </>
  )
}

const ABAS = [
  {
    id: 'dados',
    titulo: 'Dados pessoais',
    conteudo: (
      <>
        <h2>Dados pessoais</h2>
        <dl className={estilos.listaDefinicoes}>
          <dt>Nome</dt>
          <dd>Cliente de Exemplo</dd>
          <dt>E-mail</dt>
          <dd>cliente@exemplo.com</dd>
          <dt>Cliente desde</dt>
          <dd>Março de 2024</dd>
        </dl>
      </>
    ),
  },
  {
    id: 'endereco',
    titulo: 'Endereço',
    conteudo: (
      <>
        <h2>Endereço de entrega</h2>
        <address className={estilos.endereco}>
          Rua das Flores, 123 — Apto 45
          <br />
          Salvador, BA — CEP 40000-000
        </address>
      </>
    ),
  },
  {
    id: 'pedidos',
    titulo: 'Pedidos',
    conteudo: (
      <>
        <h2>Últimos pedidos</h2>
        <ul>
          <li>#1042 — Teclado mecânico compacto — Entregue</li>
          <li>#1038 — Código Limpo — Em transporte</li>
          <li>#1031 — Tapete de yoga — Entregue</li>
        </ul>
      </>
    ),
  },
  {
    id: 'preferencias',
    titulo: 'Preferências',
    conteudo: <PainelPreferencias />,
  },
]

/** Página de perfil: demonstra as Abas e a leitura do estado global de tema. */
export default function PaginaPerfil() {
  return (
    <>
      <h1>Meu perfil</h1>
      <p className="texto-suave">Use as setas do teclado para navegar entre as abas.</p>
      <Tabs abas={ABAS} abaInicialId="dados" />
    </>
  )
}
