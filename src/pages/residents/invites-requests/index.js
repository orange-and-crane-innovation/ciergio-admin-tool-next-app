import InvitesRequests from '@app/components/pages/residents/invites-requests'
import Page from '@app/permissions/page'

function InvitesRequestsPage() {
  return <Page route="/residents" page={<InvitesRequests />} />
}

export default InvitesRequestsPage
