import Posts from '@app/components/pages/posts'
import { RolesPermissions } from '@app/components/rolespermissions'

function PastoralWorksPage() {
  return (
    <RolesPermissions roleName="post" permission="pastoralWorks">
      <Posts />
    </RolesPermissions>
  )
}

export default PastoralWorksPage
