import CreatePosts from '@app/components/pages/posts/Create'
import { RolesPermissions } from '@app/components/rolespermissions'

function CreateBulletinPage() {
  return (
    <RolesPermissions permissionGroup="post" moduleName="bulletinBoard">
      <CreatePosts />
    </RolesPermissions>
  )
}

export default CreateBulletinPage
