import EditPosts from '@app/components/pages/posts/Edit'
import { RolesPermissions } from '@app/components/rolespermissions'

function PastoralWorksEditBulletinPage() {
  return (
    <RolesPermissions roleName="post" permission="pastoralWorks">
      <EditPosts />
    </RolesPermissions>
  )
}

export default PastoralWorksEditBulletinPage
