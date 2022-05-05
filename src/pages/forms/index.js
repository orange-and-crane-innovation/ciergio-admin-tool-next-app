import Forms from '@app/components/pages/forms'
import { RolesPermissions } from '@app/components/rolespermissions'

function FormsPage() {
  return (
    <RolesPermissions permissionGroup="post" moduleName="forms">
      <Forms />
    </RolesPermissions>
  )
}

export default FormsPage
