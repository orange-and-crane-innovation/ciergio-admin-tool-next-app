import AllStaff from '@app/components/pages/staff/all-staff'
import Page from '@app/permissions/page'

function AllStaffPage() {
  return <Page route="/staff" page={<AllStaff />} />
}

export default AllStaffPage
