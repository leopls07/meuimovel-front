import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/layout/Layout'
import ListaImoveisPage from './pages/ListaImoveisPage'
import NovoImovelPage from './pages/NovoImovelPage'
import DetalheImovelPage from './pages/DetalheImovelPage'
import { Toaster } from 'sonner'

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/imoveis" replace />} />
          <Route path="imoveis" element={<ListaImoveisPage />} />
          <Route path="imoveis/novo" element={<NovoImovelPage />} />
          <Route path="imoveis/:id" element={<DetalheImovelPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
