import EditPosts from '@app/components/pages/posts/Edit'
import { RolesPermissions } from '@app/components/rolespermissions'

function EditBulletinPage() {
  return (
    <RolesPermissions permissionGroup="post" moduleName="bulletinBoard">
      <EditPosts />
    </RolesPermissions>
  )
}

export default EditBulletinPage
