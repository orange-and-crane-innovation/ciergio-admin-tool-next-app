import AllResidents from '@app/components/pages/residents/all-residents'
import { useRouter } from 'next/router'

import { ACCOUNT_TYPES } from '@app/constants'

function AllResidentsPage() {
  const router = useRouter()
  const user = JSON.parse(localStorage.getItem('profile'))
  const accountType = user?.accounts?.data[0]?.accountType
  const companyID = user?.accounts?.data[0]?.company?._id
  const complexID = user?.accounts?.data[0]?.complex?._id
  const buildingID = user?.accounts?.data[0]?.building?._id

  if (!router?.query?.buildingId) {
    if (accountType === ACCOUNT_TYPES.SUP.value) {
      router.push(`/residents/all-residents/company`)
    } else if (accountType === ACCOUNT_TYPES.COMPYAD.value) {
      router.push(`/residents/all-residents/complexes?companyId=${companyID}`)
    } else if (accountType === ACCOUNT_TYPES.COMPXAD.value) {
      router.push(
        `/residents/all-residents/buildings?companyId=${companyID}&complexId=${complexID}`
      )
    } else if (accountType === ACCOUNT_TYPES.BUIGAD.value) {
      router.push(
        `/residents/all-residents?companyId=${companyID}&complexId=${complexID}&buildingId=${buildingID}`
      )
    }
  } else if (router?.query?.buildingId) {
    return <AllResidents />
  }

  return null
}

export default AllResidentsPage
