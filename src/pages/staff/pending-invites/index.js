import PendingInvites from '@app/components/pages/staff/pending-invites'
import { RolesPermissions } from '@app/components/rolespermissions'

function PendingInvitesPage() {
  return (
    <RolesPermissions permission="directory">
      <PendingInvites />
    </RolesPermissions>
  )
}

export default PendingInvitesPage
