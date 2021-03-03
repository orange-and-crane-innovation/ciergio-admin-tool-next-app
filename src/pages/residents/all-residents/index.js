import AllResidents from '@app/components/pages/residents/all-residents'
import Page from '@app/permissions/page'

function AllResidentsPage() {
  return <Page route="/residents" page={<AllResidents />} />
}

export default AllResidentsPage
