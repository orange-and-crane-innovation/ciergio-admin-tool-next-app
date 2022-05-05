import EditForms from '@app/components/pages/forms/edit'
import { RolesPermissions } from '@app/components/rolespermissions'

function EditFormsPage() {
  return (
    <RolesPermissions permissionGroup="post" moduleName="forms">
      <EditForms />
    </RolesPermissions>
  )
}

export default EditFormsPage
