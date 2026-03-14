import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import { useAuth } from '@/contexts/AuthContext'
import { loginComGoogle } from '@/api/auth'

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [erro, setErro] = useState(null)
  const [carregando, setCarregando] = useState(false)

  const destino = location.state?.from?.pathname || '/imoveis'

  // Se já está logado, redireciona direto
  useEffect(() => {
    if (isAuthenticated) navigate(destino, { replace: true })
  }, [isAuthenticated, navigate, destino])

  async function handleSuccess(credentialResponse) {
    setErro(null)
    setCarregando(true)
    try {
      const { data } = await loginComGoogle(credentialResponse.credential)
      login(data.token, data.user)
      navigate(destino, { replace: true })
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        'Falha ao autenticar. Tente novamente.'
      setErro(msg)
    } finally {
      setCarregando(false)
    }
  }

  function handleError() {
    setErro('Login com Google cancelado ou falhou.')
  }

  return (
    <div
      className="flex min-h-svh items-center justify-center p-4"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-8 flex flex-col items-center gap-6"
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          boxShadow: '0 4px 32px rgba(0,0,0,0.08)',
        }}
      >
        {/* Logo / título */}
        <div className="text-center flex flex-col gap-1">
          <span
            className="font-display font-bold tracking-tight"
            style={{ fontSize: '2rem', color: 'var(--color-text)' }}
          >
            Sacada
          </span>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)' }}>
            Cadastro e análise de imóveis
          </p>
        </div>

        <div
          style={{
            width: '100%',
            height: '1px',
            backgroundColor: 'var(--color-border)',
          }}
        />

        <div className="flex flex-col items-center gap-4 w-full">
          <p
            className="text-sm font-medium"
            style={{ color: 'var(--color-text)' }}
          >
            Entre com sua conta Google
          </p>

          {carregando ? (
            <div
              className="flex items-center gap-2 text-sm"
              style={{ color: 'var(--color-muted)' }}
            >
              <span
                className="inline-block h-4 w-4 animate-spin rounded-full border-2"
                style={{
                  borderColor: 'var(--color-border)',
                  borderTopColor: 'var(--color-accent)',
                }}
              />
              Autenticando…
            </div>
          ) : (
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={handleError}
              useOneTap
              shape="rectangular"
              theme="outline"
              text="signin_with"
              locale="pt-BR"
            />
          )}

          {erro && (
            <p
              className="text-sm text-center rounded-lg px-4 py-2 w-full"
              style={{
                color: '#ef4444',
                backgroundColor: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.2)',
              }}
            >
              {erro}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
