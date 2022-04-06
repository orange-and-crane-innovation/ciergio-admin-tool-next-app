import ComplexDataComponent from '@app/components/pages/properties/complex/complexData'
import { RolesPermissions } from '@app/components/rolespermissions'

function ComplexSinglePropertiesPage() {
  return (
    <RolesPermissions roleName="accounts">
      <ComplexDataComponent />
    </RolesPermissions>
  )
}

export default ComplexSinglePropertiesPage
