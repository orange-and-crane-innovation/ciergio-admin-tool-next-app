import Notifications from '@app/components/pages/notifications'
import { RolesPermissions } from '@app/components/rolespermissions'

function NotificationsPage() {
  return (
    <RolesPermissions roleName="notifications" permission="notifications">
      <Notifications />
    </RolesPermissions>
  )
}

export default NotificationsPage
