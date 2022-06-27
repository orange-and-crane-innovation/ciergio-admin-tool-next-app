import CreatePosts from '@app/components/pages/posts/Create'
import { RolesPermissions } from '@app/components/rolespermissions'

function CreateBulletinPage() {
  return (
    <RolesPermissions permissionGroup="post" moduleName="dailyReading">
      <CreatePosts />
    </RolesPermissions>
  )
}

export default CreateBulletinPage
