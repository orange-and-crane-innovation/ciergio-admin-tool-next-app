import AllStaff from '@app/components/pages/staff/all-staff'
import Page from '@app/permissions/page'
import { RolesPermissions } from '@app/components/rolespermissions'

function AllStaffPage() {
  return (
    <RolesPermissions permissionGroup="accounts" moduleName="myStaff">
      <AllStaff />
    </RolesPermissions>
  )
  // return (
  //   <Page route="/staff" nestedRoute="/staff/all-staff" page={<AllStaff />} />
  // )
}

export default AllStaffPage
