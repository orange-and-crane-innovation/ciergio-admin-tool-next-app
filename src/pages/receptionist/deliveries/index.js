import Delveries from '@app/components/pages/receptionist'
import Page from '@app/permissions/page'

function ReceptionistDeliveriesPage() {
  return (
    <Page
      route="/receptionist"
      nestedRoute="/receptionist/deliveries"
      page={<Delveries />}
    />
  )
}
export default ReceptionistDeliveriesPage
