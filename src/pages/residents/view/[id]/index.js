import ResidentProfile from '@app/components/pages/residents/profile'
import Page from '@app/permissions/page'

function ResidentProfilePage() {
  return <Page route="/residents" page={<ResidentProfile />} />
}

export default ResidentProfilePage
