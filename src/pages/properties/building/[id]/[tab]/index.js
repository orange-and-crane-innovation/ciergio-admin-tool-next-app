import BuildingDataComponent from '@app/components/pages/properties/building/buildingData'
import { RolesPermissions } from '@app/components/rolespermissions'

function BuildingSinglePropertiesPage() {
  return (
    <RolesPermissions permissionGroup="accounts" moduleName="myProperties">
      <BuildingDataComponent />
    </RolesPermissions>
  )
}

export default BuildingSinglePropertiesPage
