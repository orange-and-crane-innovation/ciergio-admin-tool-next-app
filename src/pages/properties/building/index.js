import BuildingPage from '@app/components/pages/properties/building'
import Page from '@app/permissions/page'

function BuildingPropertiesPage() {
  return <Page route="/properties" page={<BuildingPage />} />
}

export default BuildingPropertiesPage
