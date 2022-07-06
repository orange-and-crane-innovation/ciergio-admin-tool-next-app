import PrayerRequestDetails from '@app/components/pages/prayer-requests/components/details'
import { RolesPermissions } from '@app/components/rolespermissions'

export default function PrayerRequestDetailsPage() {
  return (
    <RolesPermissions permissionGroup="issues" moduleName="prayerRequests">
      <PrayerRequestDetails />
    </RolesPermissions>
  )
}
