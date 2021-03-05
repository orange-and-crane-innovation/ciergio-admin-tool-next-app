import Notifications from '@app/components/pages/notifications'
import Page from '@app/permissions/page'

function NotificationsPage() {
  return <Page route="/notifications" page={<Notifications />} />
}

export default NotificationsPage
