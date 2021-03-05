import Messages from '@app/components/pages/messages'
import Page from '@app/permissions/page'

function MessagesPage() {
  return <Page route="/message" page={<Messages />} />
}

export default MessagesPage
