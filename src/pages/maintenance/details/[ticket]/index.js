import { RolesPermissions } from '@app/components/rolespermissions'
import Ticket from '@app/components/pages/maintenance/components/ticket'

function TicketPage() {
  return (
    <RolesPermissions roleName="issues" permission="maintenanceAndRepairs">
      <Ticket />
    </RolesPermissions>
  )
}

export default TicketPage
