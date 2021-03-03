import Ticket from '@app/components/pages/maintenance/ticket'
import Page from '@app/permissions/page'

function TicketPage() {
  return <Page route="/maintenance" page={<Ticket />} />
}

export default TicketPage
