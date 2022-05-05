import Complexes from '@app/components/pages/maintenance/complexes'
import { RolesPermissions } from '@app/components/rolespermissions'

function ComplexesPage() {
  return (
    <RolesPermissions permissionGroup="issues" moduleName="maintenanceAndRepairs">
      <Complexes />
    </RolesPermissions>
  )
}

export default ComplexesPage
