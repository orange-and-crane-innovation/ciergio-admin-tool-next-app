import Posts from '@app/components/pages/posts'
import { RolesPermissions } from '@app/components/rolespermissions'

function PostsPage() {
  const permission = 'qrCode'
  return (
    <RolesPermissions permission={permission} roleName={permission}>
      <Posts />
    </RolesPermissions>
  )
}

export default PostsPage
