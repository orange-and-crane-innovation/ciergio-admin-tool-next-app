import Posts from '@app/components/pages/posts'
import { RolesPermissions } from '@app/components/rolespermissions'

function PastoralWorksPage() {
  return (
    <RolesPermissions roleName="pastoralWorks" permission="pastoralWorks">
      <Posts />
    </RolesPermissions>
  )
}

export default PastoralWorksPage
