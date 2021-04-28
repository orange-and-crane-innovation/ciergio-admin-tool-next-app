import Visitors from '@app/components/pages/receptionist'
import Page from '@app/permissions/page'

function ReceptionistVistorsPage() {
  return (
    <Page
      route="/receptionist"
      nestedRoute="/receptionist/visitors"
      page={<Visitors />}
    />
  )
}

export default ReceptionistVistorsPage
