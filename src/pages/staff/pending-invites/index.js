import PendingInvites from '@app/components/pages/staff/pending-invites'
import Page from '@app/permissions/page'

function PendingInvitesPage() {
  return (
    <Page
      route="/staff"
      nestedRoute="/staff/pending-invites"
      page={<PendingInvites />}
    />
  )
}

export default PendingInvitesPage
