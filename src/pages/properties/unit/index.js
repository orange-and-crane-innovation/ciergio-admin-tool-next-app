import UnitPage from '@app/components/pages/properties/unit'
import Page from '@app/permissions/page'

function UnitPropertiesPage() {
  return (
    <Page
      route="/properties"
      nestedRoute="/properties/unit"
      page={<UnitPage />}
    />
  )
}

export default UnitPropertiesPage
