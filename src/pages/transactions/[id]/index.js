import Donations from '@app/components/pages/donations'
import { RolesPermissions } from '@app/components/rolespermissions'

export default function TransactionsPage() {
  return (
    <RolesPermissions permissionGroup="payments" moduleName="donations">
      <Donations />
    </RolesPermissions>
  )
}
