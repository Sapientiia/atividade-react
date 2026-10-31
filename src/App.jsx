import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout/Layout.jsx'
import PreferenciasProvider from './context/PreferenciasProvider.jsx'
import ToastProvider from './context/ToastProvider.jsx'
import PaginaFaq from './pages/PaginaFaq.jsx'
import PaginaInicial from './pages/PaginaInicial.jsx'
import PaginaNaoEncontrada from './pages/PaginaNaoEncontrada.jsx'
import PaginaPerfil from './pages/PaginaPerfil.jsx'
import PaginaProdutos from './pages/PaginaProdutos.jsx'
import PaginaUpload from './pages/PaginaUpload.jsx'

/**
 * Componente principal: orquestra os provedores de estado global (Context API)
 * e as rotas da aplicação (React Router). Cada página demonstra um ou mais
 * dos seis componentes visuais obrigatórios.
 */
export default function App() {
  return (
    <PreferenciasProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<PaginaInicial />} />
              <Route path="faq" element={<PaginaFaq />} />
              <Route path="produtos" element={<PaginaProdutos />} />
              <Route path="perfil" element={<PaginaPerfil />} />
              <Route path="upload" element={<PaginaUpload />} />
              <Route path="*" element={<PaginaNaoEncontrada />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </PreferenciasProvider>
  )
}
