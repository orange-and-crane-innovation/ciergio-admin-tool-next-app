import Posts from '@app/components/pages/posts'
import { RolesPermissions } from '@app/components/rolespermissions'

function PostsPage() {
  return (
    <RolesPermissions roleName="post" permission="bulletinBoard">
      <Posts />
    </RolesPermissions>
  )
}

export default PostsPage
