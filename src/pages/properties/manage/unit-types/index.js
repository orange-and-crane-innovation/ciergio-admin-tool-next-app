import { RolesPermissions } from '@app/components/rolespermissions'
import UnitTypePage from '@app/components/pages/properties/manage/unit-types'

function ManageUnitTypePage() {
  return (
    <RolesPermissions roleName="accounts">
      <UnitTypePage />
    </RolesPermissions>
  )
}

export default ManageUnitTypePage
