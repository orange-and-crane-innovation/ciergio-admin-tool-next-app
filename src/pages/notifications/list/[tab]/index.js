import NotificationsList from '@app/components/pages/notifications/list'
import Page from '@app/permissions/page'

function NotificationsListPage() {
  return (
    <Page
      route="/notifications"
      nestedRoute="/notifications/list"
      page={<NotificationsList />}
    />
  )
}

export default NotificationsListPage
