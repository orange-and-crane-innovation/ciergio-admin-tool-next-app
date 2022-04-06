import Delveries from '@app/components/pages/receptionist'
import { RolesPermissions } from '@app/components/rolespermissions'

function ReceptionistDeliveriesPage() {
  return (
    <RolesPermissions permission="guestAndDelivery">
      <Delveries />
    </RolesPermissions>
  )
}
export default ReceptionistDeliveriesPage
