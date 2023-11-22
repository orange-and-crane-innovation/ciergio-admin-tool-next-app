import CreatePosts from '@app/components/pages/posts/Create'
import { RolesPermissions } from '@app/components/rolespermissions'

function PastoralWorksCreateBulletinPage() {
  return (
    <RolesPermissions permissionGroup="post" moduleName="pastoralWorks">
      <CreatePosts />
    </RolesPermissions>
  )
}

export default PastoralWorksCreateBulletinPage
