import EditNotification from '@app/components/pages/notifications/edit'
import { RolesPermissions } from '@app/components/rolespermissions'

function EditNotificationPage() {
  return (
    <RolesPermissions permissionGroup="notifications" moduleName="notifications">
      <EditNotification />
    </RolesPermissions>
  )
}
export default EditNotificationPage
