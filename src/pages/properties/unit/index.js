import { RolesPermissions } from '@app/components/rolespermissions'
import UnitPage from '@app/components/pages/properties/unit'

function UnitPropertiesPage() {
  return (
    <RolesPermissions roleName="accounts">
      <UnitPage />
    </RolesPermissions>
  )
}

export default UnitPropertiesPage
