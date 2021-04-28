import Buildings from '@app/components/pages/maintenance/buildings'
import Page from '@app/permissions/page'

function BuildingsPage() {
  return <Page route="/maintenance/buildings" page={<Buildings />} />
}

export default BuildingsPage
