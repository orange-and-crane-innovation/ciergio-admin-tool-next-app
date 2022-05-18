import Group from '@app/components/pages/members/groups/view'
import { RolesPermissions } from '@app/components/rolespermissions'

function GroupPage() {
  return (
    <RolesPermissions permissionGroup="accounts" moduleName="myMembers">
      <Group />
    </RolesPermissions>
  )
}

export default GroupPage
