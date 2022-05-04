import { RolesPermissions } from '@app/components/rolespermissions'
import Visitors from '@app/components/pages/receptionist'

function ReceptionistVistorsPage() {
  return (
    <RolesPermissions permissionGroup="registry" moduleName="guestAndDelivery">
      <Visitors />
    </RolesPermissions>
  )
}

export default ReceptionistVistorsPage
