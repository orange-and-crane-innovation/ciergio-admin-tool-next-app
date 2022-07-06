import { ACCOUNT_TYPES } from '@app/constants'
import Maintenance from '@app/components/pages/maintenance'
import { RolesPermissions } from '@app/components/rolespermissions'
import { useRouter } from 'next/router'

function MaintenancePage() {
  const router = useRouter()
  const user = JSON.parse(localStorage.getItem('profile'))
  const accountType = user?.accounts?.data[0]?.accountType
  const companyID = user?.accounts?.data[0]?.company?._id
  const complexID = user?.accounts?.data[0]?.complex?._id
  const buildingID = user?.accounts?.data[0]?.building?._id

  if (!router?.query?.buildingId) {
    if (accountType === ACCOUNT_TYPES.SUP.value) {
      router.push(`/maintenance/company`)
    } else if (accountType === ACCOUNT_TYPES.COMPYAD.value) {
      router.push(`/maintenance/complexes?companyId=${companyID}`)
    } else if (accountType === ACCOUNT_TYPES.COMPXAD.value) {
      router.push(
        `/maintenance/buildings?companyId=${companyID}&complexId=${complexID}`
      )
    } else if (accountType === ACCOUNT_TYPES.BUIGAD.value) {
      router.push(
        `/maintenance?companyId=${companyID}&complexId=${complexID}&buildingId=${buildingID}`
      )
    }
  } else if (router?.query?.buildingId) {
    return (
      <RolesPermissions permissionGroup="issues" moduleName="maintenanceAndRepairs">
        <Maintenance />
      </RolesPermissions>
    )
  }

  return null
}

export default MaintenancePage
