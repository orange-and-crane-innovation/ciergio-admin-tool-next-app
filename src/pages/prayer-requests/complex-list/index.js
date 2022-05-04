import Complexes from '@app/components/pages/prayer-requests/components/complexes'
import { RolesPermissions } from '@app/components/rolespermissions'

function ComplexesPage() {
  return (
    <RolesPermissions permissionGroup="issues" moduleName="prayerRequests">
      <Complexes />
    </RolesPermissions>
  )
}

export default ComplexesPage
