import Forms from '@app/components/pages/forms'
import { RolesPermissions } from '@app/components/rolespermissions'

function FormsPage() {
  return (
    <RolesPermissions roleName="post" permission="forms">
      <Forms />
    </RolesPermissions>
  )
}

export default FormsPage
