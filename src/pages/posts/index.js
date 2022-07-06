import Posts from '@app/components/pages/posts'
import { RolesPermissions } from '@app/components/rolespermissions'

function PostsPage() {
  return (
    <RolesPermissions permissionGroup="post" moduleName="bulletinBoard">
      <Posts />
    </RolesPermissions>
  )
}

export default PostsPage
