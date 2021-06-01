import { useRouter } from 'next/router'

import { ACCOUNT_TYPES } from '@app/constants'

function PropertiesPage() {
  const router = useRouter()
  const user = JSON.parse(localStorage.getItem('profile'))
  const accountType = user?.accounts?.data[0]?.accountType

  if (accountType === ACCOUNT_TYPES.SUP.value) {
    router.push(`/properties/company`)
  } else if (accountType === ACCOUNT_TYPES.COMPYAD.value) {
    const id = user?.accounts?.data[0]?.company?._id
    router.push(`/properties/company/${id}/overview`)
  } else if (accountType === ACCOUNT_TYPES.COMPXAD.value) {
    const id = user?.accounts?.data[0]?.complex?._id
    router.push(`/properties/complex/${id}/overview`)
  } else if (
    accountType === ACCOUNT_TYPES.BUIGAD.value ||
    accountType === ACCOUNT_TYPES.RECEP.value
  ) {
    const id = user?.accounts?.data[0]?.building?._id
    router.push(`/properties/building/${id}/overview`)
  }

  return null
}

export default PropertiesPage
