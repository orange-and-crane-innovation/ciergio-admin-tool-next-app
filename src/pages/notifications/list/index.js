import NotificationsList from '@app/components/pages/notifications/list'
import Page from '@app/permissions/page'

function NotificationsListPage() {
  return <Page route="/notifications" page={<NotificationsList />} />
}

export default NotificationsListPage
