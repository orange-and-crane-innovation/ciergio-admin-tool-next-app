import Posts from '@app/components/pages/posts'
import { RolesPermissions } from '@app/components/rolespermissions'

function PastoralWorksPage() {
  return (
    <RolesPermissions permissionGroup="post" moduleName="ePrayers">
      <Posts />
    </RolesPermissions>
  )
}

export default PastoralWorksPage
