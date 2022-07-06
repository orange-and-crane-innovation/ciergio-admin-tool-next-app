import ComplexDataComponent from '@app/components/pages/properties/complex/complexData'
import { RolesPermissions } from '@app/components/rolespermissions'

function ComplexSinglePropertiesPage() {
  return (
    <RolesPermissions permissionGroup="accounts" moduleName="myProperties">
      <ComplexDataComponent />
    </RolesPermissions>
  )
}

export default ComplexSinglePropertiesPage
