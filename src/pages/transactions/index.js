import Transactions from '@app/components/pages/donations/Transactions'
import { RolesPermissions } from '@app/components/rolespermissions'

export default function TransactionsPage() {
  return (
    <RolesPermissions permissionGroup="payments" moduleName="donations">
      <Transactions />
    </RolesPermissions>
  )
}
