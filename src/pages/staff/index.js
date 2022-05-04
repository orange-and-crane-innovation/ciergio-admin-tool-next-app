import { RolesPermissions } from '@app/components/rolespermissions'
import Staff from '@app/components/pages/staff'

function StaffPage() {
  return (
    <RolesPermissions permissionGroup="accounts" moduleName="myStaff">
      <Staff />
    </RolesPermissions>
  )
}

export default StaffPage
