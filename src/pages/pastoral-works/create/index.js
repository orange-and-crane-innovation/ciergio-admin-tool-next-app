import CreatePosts from '@app/components/pages/posts/create'
import { RolesPermissions } from '@app/components/rolespermissions'

function PastoralWorksCreateBulletinPage() {
  return (
    <RolesPermissions roleName="post" permission="pastoralWorks">
      <CreatePosts />
    </RolesPermissions>
  )
}

export default PastoralWorksCreateBulletinPage
