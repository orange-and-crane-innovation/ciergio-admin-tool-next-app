import Buildings from '@app/components/pages/maintenance/buildings'
import Page from '@app/permissions/page'

function BuildingsPage() {
  return <Page route="/maintenance/complexes" page={<Buildings />} />
}

export default BuildingsPage
