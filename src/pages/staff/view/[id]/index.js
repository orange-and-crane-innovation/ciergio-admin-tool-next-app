import StaffProfile from '@app/components/pages/staff/profile'
import Page from '@app/permissions/page'

function StaffProfilePage() {
  return <Page route="/staff" page={<StaffProfile />} />
}

export default StaffProfilePage
