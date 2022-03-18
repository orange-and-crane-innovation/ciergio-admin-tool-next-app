import ManageRoles from '@app/components/pages/staff/manage-roles'
import Page from '@app/permissions/page'

const ManageRolesPage = () => {
  return (
    <Page
      route="/staff"
      nestedRoute="/staff/manage-roles"
      page={<ManageRoles />}
    />
  )
}

export default ManageRolesPage
