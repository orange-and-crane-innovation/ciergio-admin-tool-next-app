import Complexes from '@app/components/pages/maintenance/complexes'
import { RolesPermissions } from '@app/components/rolespermissions'

function ComplexesPage() {
  return (
    <RolesPermissions roleName="issues" permission="maintenanceAndRepairs">
      <Complexes />
    </RolesPermissions>
  )
}

export default ComplexesPage
