import EditForms from '@app/components/pages/forms/edit'
import { RolesPermissions } from '@app/components/rolespermissions'

function EditFormsPage() {
  return (
    <RolesPermissions roleName="post" permission="forms">
      <EditForms />
    </RolesPermissions>
  )
}

export default EditFormsPage
