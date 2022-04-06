import { RolesPermissions } from '@app/components/rolespermissions'
import Staff from '@app/components/pages/staff'

function StaffPage() {
  return (
    <RolesPermissions roleName="accounts">
      <Staff />
    </RolesPermissions>
  )
}

export default StaffPage
