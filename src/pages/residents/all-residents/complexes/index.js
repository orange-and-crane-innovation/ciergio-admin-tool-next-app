import Complexes from '@app/components/pages/maintenance/complexes'
import Page from '@app/permissions/page'

function ComplexesPage() {
  return (
    <Page
      route="/residents"
      nestedRoute="/residents/all-residents/complexes"
      page={<Complexes />}
    />
  )
}

export default ComplexesPage
