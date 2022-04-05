import EditPosts from '@app/components/pages/posts/Edit'
import { RolesPermissions } from '@app/components/rolespermissions'

function EditBulletinPage() {
  return (
    <RolesPermissions roleName="post" permission="dailyReading">
      <EditPosts />
    </RolesPermissions>
  )
}

export default EditBulletinPage
