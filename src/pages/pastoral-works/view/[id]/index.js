import PostViewPage from '@app/components/pages/posts/view'
import { RolesPermissions } from '@app/components/rolespermissions'

function PastoralWorksPostViewComponent() {
  return (
    <RolesPermissions permissionGroup="post" moduleName="pastoralWorks">
      <PostViewPage />
    </RolesPermissions>
  )
}

export default PastoralWorksPostViewComponent
