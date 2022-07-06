import Company from '@app/components/pages/maintenance/company'
import { RolesPermissions } from '@app/components/rolespermissions'

function ComplexesPage() {
  return (
    <RolesPermissions permissionGroup="issues" moduleName="maintenanceAndRepairs">
      <Company />
    </RolesPermissions>
  )
}

export default ComplexesPage
