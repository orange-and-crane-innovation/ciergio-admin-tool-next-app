import CreatePosts from '@app/components/pages/posts/create'
import { RolesPermissions } from '@app/components/rolespermissions'

function CreateBulletinPage() {
  return (
    <RolesPermissions permissionGroup="post" moduleName="bulletinBoard">
      <CreatePosts />
    </RolesPermissions>
  )
}

export default CreateBulletinPage
