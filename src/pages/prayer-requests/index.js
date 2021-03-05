import PrayerRequests from '@app/components/pages/prayer-requests'
import Page from '@app/permissions/page'

export default function PrayerRequestsPage() {
  return <Page route="/prayer-requests" page={<PrayerRequests />} />
}
