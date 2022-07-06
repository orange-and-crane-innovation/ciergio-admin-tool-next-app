import CompanyDataComponent from '@app/components/pages/properties/company/companyData'
import { RolesPermissions } from '@app/components/rolespermissions'

function CompanySinglePropertiesPage() {
  return (
    <RolesPermissions permissionGroup="accounts" moduleName="myProperties">
      <CompanyDataComponent />
    </RolesPermissions>
  )
}

export default CompanySinglePropertiesPage
