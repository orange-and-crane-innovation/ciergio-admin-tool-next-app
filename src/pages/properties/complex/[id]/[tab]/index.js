import ComplexDataComponent from '@app/components/pages/properties/complex/complexData'
import Page from '@app/permissions/page'

function ComplexSinglePropertiesPage() {
  return (
    <Page
      route="/properties"
      nestedRoute="/properties/complex"
      page={<ComplexDataComponent />}
    />
  )
}

export default ComplexSinglePropertiesPage
