import { RolesPermissions } from '@app/components/rolespermissions'
import UnitTypePage from '@app/components/pages/properties/manage/unit-types'

function ManageUnitTypePage() {
  return (
    <RolesPermissions permissionGroup="accounts" moduleName="myProperties">
      <UnitTypePage />
    </RolesPermissions>
  )
}

export default ManageUnitTypePage
