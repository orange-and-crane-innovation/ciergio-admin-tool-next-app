import Donations from '@app/components/pages/donations'
import { RolesPermissions } from '@app/components/rolespermissions'

export default function DonationsPage() {
  return (
    <RolesPermissions permissionGroup="payments" moduleName="donations">
      <Donations />
    </RolesPermissions>
  )
}
