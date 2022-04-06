import PostViewPage from '@app/components/pages/posts/view'
import { RolesPermissions } from '@app/components/rolespermissions'

function PostViewComponent() {
  const permission = 'qrCode'
  return (
    <RolesPermissions permission={permission} roleName={permission}>
      <PostViewPage />
    </RolesPermissions>
  )
}

export default PostViewComponent
