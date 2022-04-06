import PostViewPage from '@app/components/pages/posts/view'
import { RolesPermissions } from '@app/components/rolespermissions'

function PostViewComponent() {
  return (
    <RolesPermissions roleName="post" permission="bulletinBoard">
      <PostViewPage />
    </RolesPermissions>
  )
}

export default PostViewComponent
