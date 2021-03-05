import PendingInvites from '@app/components/pages/staff/pending-invites'
import Page from '@app/permissions/page'

function PendingInvitesPage() {
  return <Page route="/staff" page={<PendingInvites />} />
}

export default PendingInvitesPage
