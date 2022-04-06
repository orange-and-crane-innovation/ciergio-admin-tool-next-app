import CreatePosts from '@app/components/pages/posts/create'
import { RolesPermissions } from '@app/components/rolespermissions'

function CreateBulletinPage() {
  const permission = 'qrCode'
  return (
    <RolesPermissions permission={permission} roleName={permission}>
      <CreatePosts />
    </RolesPermissions>
  )
}

export default CreateBulletinPage
