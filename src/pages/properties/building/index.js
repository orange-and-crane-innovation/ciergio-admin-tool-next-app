import { useRouter } from 'next/router'

import BuildingPage from '@app/components/pages/properties/building'
import Page from '@app/permissions/page'

function BuildingPropertiesPage() {
  const router = useRouter()
  const user = JSON.parse(localStorage.getItem('profile'))
  const accountType = user?.accounts?.data[0]?.accountType

  if (accountType === 'administrator') {
    return <Page route="/properties" page={<BuildingPage />} />
  } else if (accountType === 'company_admin') {
    const id = user?.accounts?.data[0]?.company?._id
    router.push(`/properties/company/${id}/overview`)
  } else if (accountType === 'complex_admin') {
    const id = user?.accounts?.data[0]?.complex?._id
    router.push(`/properties/complex/${id}/overview`)
  } else if (accountType === 'building_admin') {
    const id = user?.accounts?.data[0]?.building?._id
    router.push(`/properties/building/${id}/overview`)
  }
  return null
}

export default BuildingPropertiesPage
