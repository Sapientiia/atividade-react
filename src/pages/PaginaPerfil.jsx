import Icone from '../components/Icone/Icone.jsx'
import Tabs from '../components/Tabs/Tabs.jsx'
import { usePreferencias } from '../context/PreferenciasContext.js'
import estilos from './Paginas.module.css'

const NOMES_TEMA = { claro: 'Claro', escuro: 'Escuro', sistema: 'Automático (sistema)' }
const STATUS_PEDIDO = { Entregue: 'etiqueta--sucesso', 'Em transporte': 'etiqueta--primaria' }

const PEDIDOS = [
  { numero: '#1042', item: 'Teclado mecânico compacto', data: '12/10/2026', status: 'Entregue', valor: 'R$ 389,00' },
  { numero: '#1038', item: 'Código Limpo', data: '20/10/2026', status: 'Em transporte', valor: 'R$ 89,90' },
  { numero: '#1031', item: 'Tapete de yoga', data: '02/09/2026', status: 'Entregue', valor: 'R$ 89,00' },
]

/** Conteúdo da aba de preferências: lê o tema do contexto global, sem relação direta com o cabeçalho. */
function PainelPreferencias() {
  const { tema, temaEfetivo, setTema } = usePreferencias()

  return (
    <>
      <h2>Preferências</h2>
      <dl className={estilos.listaDefinicoes}>
        <div className={estilos.definicao}>
          <dt>Tema escolhido</dt>
          <dd>{NOMES_TEMA[tema]}</dd>
        </div>
        <div className={estilos.definicao}>
          <dt>Tema em uso</dt>
          <dd>{NOMES_TEMA[temaEfetivo]}</dd>
        </div>
      </dl>
      <button
        type="button"
        className="botao botao--secundario"
        onClick={() => setTema(temaEfetivo === 'escuro' ? 'claro' : 'escuro')}
      >
        <Icone nome={temaEfetivo === 'escuro' ? 'sol' : 'lua'} tamanho={18} />
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
          <div className={estilos.definicao}>
            <dt>Nome</dt>
            <dd>Cliente de Exemplo</dd>
          </div>
          <div className={estilos.definicao}>
            <dt>E-mail</dt>
            <dd>cliente@exemplo.com</dd>
          </div>
          <div className={estilos.definicao}>
            <dt>Cliente desde</dt>
            <dd>Março de 2024</dd>
          </div>
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
        <ul className={estilos.listaPedidos}>
          {PEDIDOS.map((pedido) => (
            <li key={pedido.numero}>
              <div>
                <strong>
                  {pedido.numero} · {pedido.item}
                </strong>
                <span className="texto-fraco">{pedido.data}</span>
              </div>
              <span className={`etiqueta ${STATUS_PEDIDO[pedido.status] ?? ''}`}>{pedido.status}</span>
              <span className={estilos.itemPreco}>{pedido.valor}</span>
            </li>
          ))}
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
      <section className={`cartao ${estilos.perfilCabecalho}`} aria-label="Resumo do cliente">
        <span className={estilos.avatar} aria-hidden="true">
          CE
        </span>
        <div>
          <h1 className={estilos.perfilNome}>Cliente de Exemplo</h1>
          <p className="texto-suave">Cliente desde março de 2024 · 3 pedidos</p>
        </div>
        <span className="etiqueta etiqueta--acento">
          <Icone nome="estrela" tamanho={14} /> Cliente ouro
        </span>
      </section>

      <p className="texto-suave">Use as setas do teclado para navegar entre as abas.</p>
      <Tabs abas={ABAS} abaInicialId="dados" rotulo="Seções do perfil" />
    </>
  )
}
