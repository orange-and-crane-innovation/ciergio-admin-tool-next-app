import Company from '@app/components/pages/maintenance/company'
import Page from '@app/permissions/page'

function ComplexesPage() {
  return (
    <Page
      route="/residents"
      nestedRoute="/residents/all-residents/company"
      page={<Company />}
    />
  )
}

export default ComplexesPage
