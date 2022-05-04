import ManageRoles from '@app/components/pages/staff/manage-roles'
import Page from '@app/permissions/page'
import { RolesPermissions } from '@app/components/rolespermissions'

const ManageRolesPage = () => {
  return (
    <RolesPermissions permissionGroup="accounts" moduleName="myStaff">
      <ManageRoles />
    </RolesPermissions>
  )

  // old checking of permisison
  // return (
  //   <Page
  //     route="/staff"
  //     nestedRoute="/staff/manage-roles"
  //     page={<ManageRoles />}
  //   />
  // )
}

export default ManageRolesPage
