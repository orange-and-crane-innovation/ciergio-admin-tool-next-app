import PrayerRequests from '@app/components/pages/prayer-requests'
import Complexes from './complex-list'

export default function PrayerRequestsPage() {
  const profile = JSON.parse(window.localStorage.getItem('profile'))
  const accountType = profile?.accounts?.data[0]?.accountType

  if (accountType === 'complex_admin') {
    return <PrayerRequests />
  }
  if (accountType === 'company_admin') {
    return <Complexes />
  }
}
