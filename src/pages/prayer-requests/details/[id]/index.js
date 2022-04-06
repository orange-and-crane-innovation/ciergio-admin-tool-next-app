import PrayerRequestDetails from '@app/components/pages/prayer-requests/components/details'
import { RolesPermissions } from '@app/components/rolespermissions'

export default function PrayerRequestDetailsPage() {
  return (
    <RolesPermissions permission="prayerRequests" roleName="issues">
      <PrayerRequestDetails />
    </RolesPermissions>
  )
}
