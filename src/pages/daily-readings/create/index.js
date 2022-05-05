import CreatePosts from '@app/components/pages/posts/create'
import { RolesPermissions } from '@app/components/rolespermissions'

function CreateBulletinPage() {
  return (
    <RolesPermissions permissionGroup="post" moduleName="dailyReading">
      <CreatePosts />
    </RolesPermissions>
  )
}

export default CreateBulletinPage
