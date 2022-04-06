import EditPosts from '@app/components/pages/posts/Edit'
import { RolesPermissions } from '@app/components/rolespermissions'

function EditBulletinPage() {
  const permission = 'qrCode'
  return (
    <RolesPermissions permission={permission} roleName={permission}>
      <EditPosts />
    </RolesPermissions>
  )
}

export default EditBulletinPage
