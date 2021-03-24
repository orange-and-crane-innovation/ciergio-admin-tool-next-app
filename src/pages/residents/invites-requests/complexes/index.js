import Complexes from '@app/components/pages/maintenance/complexes'
import Page from '@app/permissions/page'

function ComplexesPage() {
  return (
    <Page
      route="/residents"
      nestedRoute="/residents/invites-requests/complexes"
      page={<Complexes />}
    />
  )
}

export default ComplexesPage
