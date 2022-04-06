import { RolesPermissions } from '@app/components/rolespermissions'
import StaffProfile from '@app/components/pages/staff/profile'

function StaffProfilePage() {
  return (
    <RolesPermissions roleName="accounts">
      <StaffProfile />
    </RolesPermissions>
  )
}

export default StaffProfilePage
