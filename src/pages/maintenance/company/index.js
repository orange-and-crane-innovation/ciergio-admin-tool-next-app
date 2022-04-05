import Company from '@app/components/pages/maintenance/company'
import { RolesPermissions } from '@app/components/rolespermissions'

function ComplexesPage() {
  return (
    <RolesPermissions roleName="issues" permission="maintenanceAndRepairs">
      <Company />
    </RolesPermissions>
  )
}

export default ComplexesPage
