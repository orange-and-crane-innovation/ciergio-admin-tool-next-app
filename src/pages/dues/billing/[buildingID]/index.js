import Billing from '@app/components/pages/dues'
import { RolesPermissions } from '@app/components/rolespermissions'

export default function DynamicUnsentPage() {
  const user = JSON.parse(localStorage.getItem('profile'))
  const complexID = user?.accounts?.data[0]?.complex?._id
  return (
    <RolesPermissions permissionGroup="dues" moduleName="myDues">
      <Billing complexId={complexID} />
    </RolesPermissions>
  )
}
