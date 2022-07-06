import CategoriesPage from '@app/components/pages/properties/manage/categories'
import { RolesPermissions } from '@app/components/rolespermissions'

function ManageCategoriesPage() {
  return (
    <RolesPermissions permissionGroup="accounts" moduleName="myProperties">
      <CategoriesPage />
    </RolesPermissions>
  )
}

export default ManageCategoriesPage
