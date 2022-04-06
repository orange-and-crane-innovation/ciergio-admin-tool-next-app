import Complexes from '@app/components/pages/prayer-requests/components/complexes'
import { RolesPermissions } from '@app/components/rolespermissions'

function ComplexesPage() {
  return (
    <RolesPermissions permission="prayerRequests" roleName="issues">
      <Complexes />
    </RolesPermissions>
  )
}

export default ComplexesPage
