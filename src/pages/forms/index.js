import Forms from '@app/components/pages/forms'
import { RolesPermissions } from '@app/components/rolespermissions'

function FormsPage() {
  return (
    <RolesPermissions roleName="forms" permission="forms">
      <Forms />
    </RolesPermissions>
  )
}

export default FormsPage
