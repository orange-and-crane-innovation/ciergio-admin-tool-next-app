import { useRouter } from 'next/router'
import Billing from '@app/components/pages/dues'

export default function DuesPage() {
  const router = useRouter()
  const user = JSON.parse(localStorage.getItem('profile'))

  const accountType = user?.accounts?.data[0]?.accountType

  if (accountType === 'company_admin') {
    // const complex = user?.accounts?.data[0]?.complex?._id
    // router.push(`/dues/billing/${id}/`)
  } else if (accountType === 'complex_admin') {
    const id = user?.accounts?.data[0]?.complex?._id
    router.push(`/properties/complex/${id}/overview`)
  } else if (accountType === 'building_admin') {
    const buildingID = user?.accounts?.data[0]?.building?._id
    router.push(`/dues/billing/${buildingID}`)
  }

  return <Billing />
}
