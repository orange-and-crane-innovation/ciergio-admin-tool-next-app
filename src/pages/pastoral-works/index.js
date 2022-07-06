import Posts from '@app/components/pages/posts'
import { RolesPermissions } from '@app/components/rolespermissions'

function PastoralWorksPage() {
  return (
    <RolesPermissions permissionGroup="post" moduleName="pastoralWorks">
      <Posts />
    </RolesPermissions>
  )
}

export default PastoralWorksPage
