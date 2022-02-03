import Page from '@app/permissions/page'
import PropertyComponent from '@app/components/pages/property'

const PropertyMyBuilding = () => {
  return (
    <Page
      route="/property"
      nestedRoute="/property/complex"
      page={<PropertyComponent />}
    />
  )
}

export default PropertyMyBuilding
