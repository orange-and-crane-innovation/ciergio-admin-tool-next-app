import PendingMemberInvites from '@app/components/pages/members/pending-member-invites'
import { RolesPermissions } from '@app/components/rolespermissions'

function MyMembersPage() {
  return (
    <RolesPermissions permissionGroup="accounts" moduleName="myMembers">
      <PendingMemberInvites />
    </RolesPermissions>
  )
}

export default MyMembersPage
