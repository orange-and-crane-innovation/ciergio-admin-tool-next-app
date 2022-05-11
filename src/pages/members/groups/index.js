import Groups from '@app/components/pages/members/groups'
import { RolesPermissions } from '@app/components/rolespermissions'

function GroupsPage() {
  return (
    <RolesPermissions permissionGroup="accounts" moduleName="myMembers">
      <Groups />
    </RolesPermissions>
  )
}

export default GroupsPage
