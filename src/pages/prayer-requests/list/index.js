import PrayerRequests from '@app/components/pages/prayer-requests'
import { RolesPermissions } from '@app/components/rolespermissions'

function PrayerRequestsPage() {
  return (
    <RolesPermissions permission="prayerRequests" roleName="issues">
      <PrayerRequests />
    </RolesPermissions>
  )
}

export default PrayerRequestsPage
