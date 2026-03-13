import ImovelForm from './ImovelForm'

export default function ImovelPatchForm(props) {
  return <ImovelForm mode="patch" submitLabel="Salvar alterações" {...props} />
}
