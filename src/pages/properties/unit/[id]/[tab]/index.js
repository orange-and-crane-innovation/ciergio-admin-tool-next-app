import { RolesPermissions } from '@app/components/rolespermissions'
import UnitDataComponent from '@app/components/pages/properties/unit'

function UnitSinglePropertiesPage() {
  return (
    <RolesPermissions roleName="accounts">
      <UnitDataComponent />
    </RolesPermissions>
  )
}

export default UnitSinglePropertiesPage
