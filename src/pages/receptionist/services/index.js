import Services from '@app/components/pages/receptionist'
import Page from '@app/permissions/page'

function ReceptionistServicesPage() {
  return (
    <Page
      route="/receptionist"
      nestedRoute="/receptionist/services"
      page={<Services />}
    />
  )
}

export default ReceptionistServicesPage
