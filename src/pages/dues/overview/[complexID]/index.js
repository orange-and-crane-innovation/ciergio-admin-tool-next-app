import Overview from '@app/components/pages/dues/Overview'
import { RolesPermissions } from '@app/components/rolespermissions'

const OverviewPage = () => {
  return (
    <RolesPermissions roleName="myDues" permission="myDues">
      <Overview />
    </RolesPermissions>
  )
}

export default OverviewPage
