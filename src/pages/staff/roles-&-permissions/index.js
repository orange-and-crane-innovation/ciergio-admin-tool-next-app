import ManageRoles from '@app/components/pages/staff/manage-roles'
import { RolesPermissions } from '@app/components/rolespermissions'

const ManageRolesPage = () => {
  return (
    <RolesPermissions permissionGroup="accounts" moduleName="myStaff">
      <ManageRoles />
    </RolesPermissions>
  )
}

export default ManageRolesPage
