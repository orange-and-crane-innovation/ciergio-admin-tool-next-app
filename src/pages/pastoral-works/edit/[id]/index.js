import EditPosts from '@app/components/pages/posts/Edit'
import { RolesPermissions } from '@app/components/rolespermissions'

function PastoralWorksEditBulletinPage() {
  return (
    <RolesPermissions permissionGroup="post" moduleName="pastoralWorks">
      <EditPosts />
    </RolesPermissions>
  )
}

export default PastoralWorksEditBulletinPage
