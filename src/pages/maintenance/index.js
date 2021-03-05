import Maintenance from '@app/components/pages/maintenance'
import Page from '@app/permissions/page'

function MaintenancePage() {
  return <Page route="/maintenance" page={<Maintenance />} />
}

export default MaintenancePage
