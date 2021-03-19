import InvitesRequests from '@app/components/pages/residents/invites-requests'
import Page from '@app/permissions/page'

function InvitesRequestsPage() {
  return (
    <Page
      route="/residents"
      nestedRoute="/residents/invite-requests"
      page={<InvitesRequests />}
    />
  )
}

export default InvitesRequestsPage
