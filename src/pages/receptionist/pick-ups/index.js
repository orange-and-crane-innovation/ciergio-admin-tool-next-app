import PickUps from '@app/components/pages/receptionist'
import { RolesPermissions } from '@app/components/rolespermissions'

function ReceptionistPickUpsPage() {
  return (
    <RolesPermissions permissionGroup="registry" moduleName="guestAndDelivery">
      <PickUps />
    </RolesPermissions>
  )
}

export default ReceptionistPickUpsPage
