import Dues from '@app/components/pages/dues/'
import { RolesPermissions } from '@app/components/rolespermissions'

export default function DuesPage() {
  return (
    <RolesPermissions roleName="dues" permission="myDues">
      <Dues />
    </RolesPermissions>
  )
}
