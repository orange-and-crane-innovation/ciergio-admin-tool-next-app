import Maintenance from '@app/components/pages/maintenance'
import Page from '@app/permissions/page'
import { useRouter } from 'next/router'

import { ACCOUNT_TYPES } from '@app/constants'

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
    return <Page route="/maintenance" page={<Maintenance />} />
  }

  return null
}

export default MaintenancePage
