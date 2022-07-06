import CreateNotification from '@app/components/pages/notifications/create'
import { RolesPermissions } from '@app/components/rolespermissions'

function CreateNotificationPage() {
  return (
    <RolesPermissions permissionGroup="notifications" moduleName="notifications">
      <CreateNotification />
    </RolesPermissions>
  )
}
export default CreateNotificationPage
