import Dues from '@app/components/pages/dues/'
import { RolesPermissions } from '@app/components/rolespermissions'

export default function DuesPage() {
  return (
    <RolesPermissions roleName="myDues" permission="myDues">
      <Dues />
    </RolesPermissions>
  )
}
