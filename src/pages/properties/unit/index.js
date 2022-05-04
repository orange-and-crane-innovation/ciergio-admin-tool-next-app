import { RolesPermissions } from '@app/components/rolespermissions'
import UnitPage from '@app/components/pages/properties/unit'

function UnitPropertiesPage() {
  return (
    <RolesPermissions permissionGroup="accounts" moduleName="myProperties">
      <UnitPage />
    </RolesPermissions>
  )
}

export default UnitPropertiesPage
