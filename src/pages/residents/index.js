import Page from '@app/permissions/page'
import Residents from '@app/components/pages/residents'

function ResidentsPage() {
  return <Page route="/residents" page={<Residents />} />
}

export default ResidentsPage
