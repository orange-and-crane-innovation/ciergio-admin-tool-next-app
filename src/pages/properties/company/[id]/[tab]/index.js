import CompanyDataComponent from '@app/components/pages/properties/company/companyData'
import Page from '@app/permissions/page'

function CompanySinglePropertiesPage() {
  return (
    <Page
      route="/properties"
      nestedRoute="/properties/company"
      page={<CompanyDataComponent />}
    />
  )
}

export default CompanySinglePropertiesPage
