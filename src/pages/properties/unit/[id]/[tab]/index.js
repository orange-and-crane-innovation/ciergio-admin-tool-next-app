import UnitDataComponent from '@app/components/pages/properties/unit'
import Page from '@app/permissions/page'

function UnitSinglePropertiesPage() {
  return (
    <Page
      route="/properties"
      nestedRoute="/properties/unit"
      page={<UnitDataComponent />}
    />
  )
}

export default UnitSinglePropertiesPage
