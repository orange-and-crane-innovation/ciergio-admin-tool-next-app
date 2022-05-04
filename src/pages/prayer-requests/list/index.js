import PrayerRequests from '@app/components/pages/prayer-requests'
import { RolesPermissions } from '@app/components/rolespermissions'

function PrayerRequestsPage() {
  return (
    <RolesPermissions permissionGroup="issues" moduleName="prayerRequests">
      <PrayerRequests />
    </RolesPermissions>
  )
}

export default PrayerRequestsPage
