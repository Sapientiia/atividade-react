# Atividade ReactJS — Loja Aurora

Aplicação web responsiva desenvolvida em **React.js** para a disciplina
*Tópicos Avançados em Engenharia de Software* (UCSAL, 2026.2).
Ela reúne os seis componentes visuais exigidos na atividade, cada um
implementado como componente React próprio, além do desafio extra
(**Context API** e **React Router**), dentro de uma loja fictícia completa:
catálogo com filtro e ordenação, página de detalhe do produto, carrinho com
contador global, FAQ, perfil e upload simulado. Sem bibliotecas de UI: CSS
Modules, tokens de design próprios e ícones SVG inline.

## Como executar

Pré-requisitos: Node.js 20.19 ou superior (o GitHub Codespaces já traz o Node 22).

```bash
npm install        # instala as dependências
npm run dev        # servidor de desenvolvimento em http://localhost:5173
npm test           # executa a suíte de testes (Vitest + Testing Library)
npm run lint       # verificação de código (ESLint)
npm run build      # gera a versão de produção em dist/
```

### GitHub Codespaces

O repositório possui `.devcontainer/devcontainer.json`. Ao abrir o Codespace:

1. O `npm install` roda automaticamente ao criar o ambiente.
2. Execute `npm run dev` no terminal.
3. A porta 5173 é encaminhada automaticamente e o navegador abre a aplicação.

O Vite está configurado com `server.host = true`, necessário para o
encaminhamento de portas do Codespaces.

## Estrutura

```
src/
├── App.jsx                     # componente principal: provedores + rotas
├── main.jsx                    # ponto de entrada (ReactDOM)
├── index.css                   # variáveis de tema, reset e utilitários
├── components/
│   ├── Accordion/              # Acordeão
│   ├── Pagination/             # Paginação (+ calcularPaginasVisiveis.js)
│   ├── ProgressBar/            # Barra de Progresso (+ normalizarProgresso.js)
│   ├── Tabs/                   # Abas
│   ├── Dropdown/               # Menu Suspenso
│   ├── Toast/                  # Notificação Toast + ToastContainer
│   ├── Icone/                  # ícones SVG inline (sem biblioteca)
│   ├── Produto/                # CartaoProduto, ImagemProduto, Estrelas, EsqueletoProduto
│   └── Layout/                 # Cabeçalho (nav + tema + carrinho), Rodapé e Layout (Outlet)
├── context/
│   ├── ToastContext.js         # contexto + hook useToast
│   ├── ToastProvider.jsx       # provider de notificações globais
│   ├── PreferenciasContext.js  # contexto + hook usePreferencias
│   ├── PreferenciasProvider.jsx# provider do tema (claro/escuro/sistema)
│   ├── CarrinhoContext.js      # contexto + hook useCarrinho
│   └── CarrinhoProvider.jsx    # provider do carrinho (itens, subtotal)
├── data/                       # conteúdo fictício (FAQ e catálogo de produtos)
└── pages/                      # uma página por rota (inclui detalhe do produto e carrinho)
```

Cada componente fica em sua própria pasta com o arquivo `.jsx`, um
`*.module.css` (CSS Modules, sem biblioteca de UI externa) e um `*.test.jsx`.

## Componentes e onde são usados

| Componente | Página | Props principais | Estado interno |
|---|---|---|---|
| `Accordion` | `/faq` | `itens`, `permitirMultiplos`, `abertoInicialId`, `nivelTitulo` | ids dos itens abertos |
| `Pagination` | `/produtos` | `paginaAtual`, `totalPaginas`, `aoMudarPagina` | nenhum (controlado pelo pai) |
| `ProgressBar` | `/upload` e `/carrinho` (meta de frete grátis) | `valor` (0–100), `rotulo`, `mostrarPercentual`, `cor` | nenhum (deriva de `valor`) |
| `Tabs` | `/perfil` e `/produtos/:id` | `abas`, `abaInicialId`, `aoMudarAba`, `rotulo` | aba ativa |
| `Dropdown` | cabeçalho (tema) e `/produtos` (categoria e ordem) | `rotulo`, `opcoes`, `aoSelecionar`, `valorSelecionadoId`, `icone` | aberto/fechado |
| `Toast` | todas (via contexto) | `tipo`, `mensagem`, `duracao`, `aoFechar` | temporizador de fechamento |

## Conceitos de React demonstrados

- **Componentes funcionais** em todos os arquivos de `src/components` e `src/pages`.
- **Props** para passar dados e callbacks (ex.: `Pagination` recebe `totalPaginas` e `aoMudarPagina`).
- **State local** com `useState` (ex.: item aberto no `Accordion`, aba ativa em `Tabs`).
- **Hooks**: `useState`, `useEffect` (temporizador do `Toast`, intervalo do upload, clique fora
  do `Dropdown`, aplicação do tema no `<html>`), `useRef`, `useId`, `useMemo`, `useCallback`, `useContext`.
- **Eventos**: `onClick`, `onChange`, `onKeyDown`, listeners de `mousedown`/`touchstart` no documento.

## Desafio extra

- **Context API**: `ToastProvider` permite que qualquer componente dispare notificações;
  `PreferenciasProvider` guarda o tema escolhido no Menu Suspenso do cabeçalho e o
  disponibiliza para a aba "Preferências" da página de Perfil; `CarrinhoProvider` recebe
  itens do catálogo e do detalhe do produto e alimenta o contador do cabeçalho e a página
  do carrinho. Nenhum desses pares de componentes tem relação direta na árvore.
- **React Router**: rotas `/`, `/produtos`, `/produtos/:id` (parâmetro de rota), `/carrinho`,
  `/faq`, `/perfil`, `/upload` e página 404, com layout compartilhado via `<Outlet>`,
  links ativos com `NavLink` e animação de entrada por rota.

## Visual

A linguagem visual segue a de um tema de loja virtual real: fonte **Poppins** (Google Fonts),
fundo branco, texto cinza-escuro (`#212529`/`#333`/`#666`), acento teal (`#0E606C`, links
`#0C5D6A`), bordas finas (`#ddd`/`#efefef`) e cantos de 6px. Botões seguem o padrão
Bootstrap (peso 500, raio 4px); as abas têm sublinhado teal; a paginação usa fundo cinza
com a página atual em teal; os cartões de produto são planos, com imagem quadrada sobre
`#F8F9FB` e botão em caixa alta. Há um tema escuro (`#363c40`) e a opção automática
(segue o sistema). A escolha fica salva no `localStorage`.

- Tokens em `src/index.css`; nenhuma biblioteca de UI.
- Ícones SVG inline em `src/components/Icone/Icone.jsx`, decorativos por padrão.
- Imagens de produto são o ícone da categoria sobre fundo cinza claro, sem arquivos externos.
- Esqueleto de carregamento ao trocar filtro ou ordenação e transição discreta por rota,
  desligados com `prefers-reduced-motion`.

## Responsividade

Breakpoints definidos em CSS: celular (até 599px), tablet (600–899px) e desktop (900px+).
A grade de produtos tem 2 colunas no celular, 3 no tablet e 4 no desktop; o cabeçalho reorganiza a
navegação em uma segunda linha no celular; o detalhe do produto e o carrinho passam de
uma para duas colunas; a Paginação mostra apenas setas em telas pequenas; os toasts
ocupam a largura da tela no celular e o canto inferior direito no desktop.

## Acessibilidade

- Tags semânticas: `header`, `nav`, `main`, `section`, `footer`, `address`, `dl`.
- Acordeão: `button` com `aria-expanded` e `aria-controls`, painel com `role="region"` e `inert` quando fechado.
- Abas: padrão WAI-ARIA (`tablist`, `tab`, `tabpanel`, `aria-selected`), navegação por setas, Home e End.
- Menu Suspenso: `aria-haspopup`, `aria-expanded`, `role="menu"` / `menuitemradio`, fecha com Escape e devolve o foco.
- Paginação: `nav` rotulado, `aria-current="page"`, botões desabilitados nos limites.
- Barra de Progresso: `role="progressbar"` com `aria-valuenow/min/max` e `aria-valuetext`.
- Toast: região `aria-live` sempre montada, `role="status"` (sucesso/info) ou `role="alert"` (erro), botão de fechar rotulado.
- Link "Pular para o conteúdo", foco visível em todos os elementos interativos e
  respeito a `prefers-reduced-motion`.

## Testes

A suíte cobre cada componente (caminho feliz, erro e casos de borda), os três contextos,
as páginas com lógica (Produtos, Detalhe do produto, Upload, FAQ) e testes de integração
do `App` (navegação por rotas, tema compartilhado via contexto e fluxo completo do carrinho).

```bash
npm test
```
