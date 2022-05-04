import Complexes from './complex-list'
import PrayerRequests from '@app/components/pages/prayer-requests'
import { RolesPermissions } from '@app/components/rolespermissions'

export default function PrayerRequestsPage() {
  const profile = JSON.parse(window.localStorage.getItem('profile'))
  const accountType = profile?.accounts?.data[0]?.accountType

  const isComplexAdmin = accountType === 'complex_admin'
  return (
    <RolesPermissions permissionGroup="issues" moduleName="prayerRequests">
      {isComplexAdmin ? <PrayerRequests /> : <Complexes />}
    </RolesPermissions>
  )
}
