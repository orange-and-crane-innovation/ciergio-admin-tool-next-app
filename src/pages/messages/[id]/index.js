import Messages from '@app/components/pages/messages'
import { RolesPermissions } from '@app/components/rolespermissions'

function MessagesPage() {
  return (
    <RolesPermissions roleName="messaging" permission="messages">
      <Messages />
    </RolesPermissions>
  )
}

export default MessagesPage
