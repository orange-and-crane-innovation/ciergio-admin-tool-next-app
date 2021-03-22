import AllResidents from '@app/components/pages/residents/all-residents'
import Page from '@app/permissions/page'

function AllResidentsPage() {
  return (
    <Page
      route="/residents"
      nestedRoute="/residents/all-residents"
      page={<AllResidents />}
    />
  )
}

export default AllResidentsPage
