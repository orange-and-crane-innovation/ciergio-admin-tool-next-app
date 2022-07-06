import PostViewPage from '@app/components/pages/posts/view'
import { RolesPermissions } from '@app/components/rolespermissions'

function PostViewComponent() {
  return (
    <RolesPermissions permissionGroup="post" moduleName="bulletinBoard">
      <PostViewPage />
    </RolesPermissions>
  )
}

export default PostViewComponent
