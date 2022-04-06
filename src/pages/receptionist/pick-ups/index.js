import PickUps from '@app/components/pages/receptionist'
import { RolesPermissions } from '@app/components/rolespermissions'

function ReceptionistPickUpsPage() {
  return (
    <RolesPermissions permission="guestAndDelivery">
      <PickUps />
    </RolesPermissions>
  )
}

export default ReceptionistPickUpsPage
