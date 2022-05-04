import { RolesPermissions } from '@app/components/rolespermissions'
import Services from '@app/components/pages/receptionist'

function ReceptionistServicesPage() {
  return (
    <RolesPermissions permission="guestAndDelivery" roleName="registry">
      <Services />
    </RolesPermissions>
  )
}

export default ReceptionistServicesPage
