import EditPosts from '@app/components/pages/posts/Edit'
import { RolesPermissions } from '@app/components/rolespermissions'

function EditBulletinPage() {
  return (
    <RolesPermissions permissionGroup="post" moduleName="qrCode">
      <EditPosts />
    </RolesPermissions>
  )
}

export default EditBulletinPage
