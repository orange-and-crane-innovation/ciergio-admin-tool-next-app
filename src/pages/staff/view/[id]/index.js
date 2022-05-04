import { RolesPermissions } from '@app/components/rolespermissions'
import StaffProfile from '@app/components/pages/staff/profile'

function StaffProfilePage() {
  return (
    <RolesPermissions permissionGroup="accounts" moduleName="myStaff">
      <StaffProfile />
    </RolesPermissions>
  )
}

export default StaffProfilePage
