import CompanyDataComponent from '@app/components/pages/properties/company/companyData'
import { RolesPermissions } from '@app/components/rolespermissions'

function CompanySinglePropertiesPage() {
  return (
    <RolesPermissions roleName="accounts">
      <CompanyDataComponent />
    </RolesPermissions>
  )
}

export default CompanySinglePropertiesPage
