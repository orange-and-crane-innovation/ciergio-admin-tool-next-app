import Dashboard from '@app/components/pages/dashboard'
import Page from '@app/permissions/page'

function DashboardPage() {
  return <Page route="/dashboard" page={<Dashboard />} />
}

export default DashboardPage
