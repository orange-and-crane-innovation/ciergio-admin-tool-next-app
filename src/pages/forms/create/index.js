import CreateForms from '@app/components/pages/forms/Create'
import { RolesPermissions } from '@app/components/rolespermissions'

function CreateFormsPage() {
  return (
    <RolesPermissions roleName="post" permission="forms">
      <CreateForms />
    </RolesPermissions>
  )
}

export default CreateFormsPage
