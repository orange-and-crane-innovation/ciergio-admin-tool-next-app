import Residents from '@app/components/pages/residents'
import Page from '@app/permissions/page'

function ResidentsPage() {
  return <Page route="/residents" page={<Residents />} />
}

export default ResidentsPage
