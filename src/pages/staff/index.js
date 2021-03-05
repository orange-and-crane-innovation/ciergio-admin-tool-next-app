import Staff from '@app/components/pages/staff'
import Page from '@app/permissions/page'

function StaffPage() {
  return <Page route="/staff" page={<Staff />} />
}

export default StaffPage
