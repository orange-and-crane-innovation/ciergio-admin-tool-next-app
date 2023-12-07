import CreatePosts from '@app/components/pages/posts/Create'
import { RolesPermissions } from '@app/components/rolespermissions'

function PastoralWorksCreateBulletinPage() {
  return (
    <RolesPermissions permissionGroup="post" moduleName="ePrayers">
      <CreatePosts />
    </RolesPermissions>
  )
}

export default PastoralWorksCreateBulletinPage
