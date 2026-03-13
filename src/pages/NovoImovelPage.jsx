import { useNavigate } from 'react-router-dom'
import ImovelForm from '@/components/imovel/ImovelForm'
import { useImoveis } from '@/hooks/useImoveis'

export default function NovoImovelPage() {
  const navigate = useNavigate()
  const { create } = useImoveis({ autoLoad: false })

  async function handleSubmit(payload, applyValidationErrors) {
    const created = await create(payload, {
      onValidationErrors: applyValidationErrors,
    })
    if (created?.id != null) {
      navigate(`/imoveis/${created.id}`)
    }
  }

  return (
    <div style={{
      backgroundColor: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: '20px',
      overflow: 'hidden',
      padding: '24px',
    }} className="mx-auto max-w-2xl" >
      <div className="mb-4">
        <div className="text-xl font-semibold text-slate-800">Cadastrar imóvel</div>
        <div className="text-sm text-slate-500">Preencha os dados para criar um novo cadastro</div>
      </div>
      <ImovelForm onSubmit={handleSubmit} onCancel={() => navigate('/imoveis')} submitLabel="Salvar" />
    </div>
  )
}
