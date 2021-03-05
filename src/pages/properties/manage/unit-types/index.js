import UnitTypePage from '@app/components/pages/properties/manage/unit-types'
import Page from '@app/permissions/page'

function ManageUnitTypePage() {
  return <Page route="/properties" page={<UnitTypePage />} />
}

export default ManageUnitTypePage
