import Dashboard from '@app/components/pages/dashboard'
import { RolesPermissions } from '@app/components/rolespermissions'

function DashboardPage() {
  return (
    <RolesPermissions moduleName="homePage">
      <Dashboard />
    </RolesPermissions>
  )
}

export default DashboardPage
