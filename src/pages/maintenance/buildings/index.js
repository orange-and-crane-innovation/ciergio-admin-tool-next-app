import Buildings from '@app/components/pages/maintenance/buildings'
import { RolesPermissions } from '@app/components/rolespermissions'

function BuildingsPage() {
  return (
    <RolesPermissions roleName="issues" permission="maintenanceAndRepairs">
      <Buildings />
    </RolesPermissions>
  )
}

export default BuildingsPage
