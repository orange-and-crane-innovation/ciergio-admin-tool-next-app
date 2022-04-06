import EditNotification from '@app/components/pages/notifications/edit'
import { RolesPermissions } from '@app/components/rolespermissions'

function EditNotificationPage() {
  return (
    <RolesPermissions roleName="notifications" permission="notifications">
      <EditNotification />
    </RolesPermissions>
  )
}
export default EditNotificationPage
