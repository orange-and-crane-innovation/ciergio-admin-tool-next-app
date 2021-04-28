import PickUps from '@app/components/pages/receptionist'
import Page from '@app/permissions/page'

function ReceptionistPickUpsPage() {
  return (
    <Page
      route="/receptionist"
      nestedRoute="/receptionist/pick-ups"
      page={<PickUps />}
    />
  )
}

export default ReceptionistPickUpsPage
