import MyMembers from '@app/components/pages/members'
import { RolesPermissions } from '@app/components/rolespermissions'

function MyMembersPage() {
  return (
    <RolesPermissions permissionGroup="accounts" moduleName="myMembers">
      <MyMembers />
    </RolesPermissions>
  )
}

export default MyMembersPage
