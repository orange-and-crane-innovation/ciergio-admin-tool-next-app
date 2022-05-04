import CreateForms from '@app/components/pages/forms/Create'
import { RolesPermissions } from '@app/components/rolespermissions'

function CreateFormsPage() {
  return (
    <RolesPermissions permissionGroup="post" moduleName="forms">
      <CreateForms />
    </RolesPermissions>
  )
}

export default CreateFormsPage
