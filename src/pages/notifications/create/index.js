import CreateNotification from '@app/components/pages/notifications/create'
import Page from '@app/permissions/page'

function CreateNotificationPage() {
  return (
    <Page
      route="/notifications"
      nestedRoute="/notifications/create"
      page={<CreateNotification />}
    />
  )
}
export default CreateNotificationPage
