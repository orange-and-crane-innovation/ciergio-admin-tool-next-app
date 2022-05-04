import NotificationsList from '@app/components/pages/notifications/list'
import { RolesPermissions } from '@app/components/rolespermissions'

function NotificationsListPage() {
  return (
    <RolesPermissions permissionGroup="notifications" moduleName="notifications">
      <NotificationsList />
    </RolesPermissions>
  )
}

export default NotificationsListPage
