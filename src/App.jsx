import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/layout/Layout'
import PrivateRoute from './components/auth/PrivateRoute'
import LoginPage from './pages/LoginPage'
import ListaImoveisPage from './pages/ListaImoveisPage'
import NovoImovelPage from './pages/NovoImovelPage'
import DetalheImovelPage from './pages/DetalheImovelPage'
import SimulacoesPage from './pages/SimulacoesPage'
import { Toaster } from 'sonner'

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <Routes>
        {/* Rota pública */}
        <Route path="/login" element={<LoginPage />} />

        {/* Rotas protegidas */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="/imoveis" replace />} />
          <Route path="imoveis" element={<ListaImoveisPage />} />
          <Route path="imoveis/novo" element={<NovoImovelPage />} />
          <Route path="imoveis/:id" element={<DetalheImovelPage />} />
          <Route path="simulacoes" element={<SimulacoesPage />} />
        </Route>

        {/* Qualquer rota desconhecida vai para /imoveis */}
        <Route path="*" element={<Navigate to="/imoveis" replace />} />
      </Routes>
    </BrowserRouter>
  )
}