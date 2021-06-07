import Company from '@app/components/pages/maintenance/company'
import Page from '@app/permissions/page'

function CompaniesPage() {
  return (
    <Page
      route="/residents"
      nestedRoute="/residents/invites-requests/company"
      page={<Company />}
    />
  )
}

export default CompaniesPage
