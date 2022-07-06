import CreatePosts from '@app/components/pages/posts/Create'
import { RolesPermissions } from '@app/components/rolespermissions'

function CreateBulletinPage() {
  return (
    <RolesPermissions permissionGroup="post" moduleName="qrCode">
      <CreatePosts />
    </RolesPermissions>
  )
}

export default CreateBulletinPage
