import { useRouter } from 'next/router'
import Billing from '@app/components/pages/dues'

export default function DuesPage() {
  const router = useRouter()
  const { buildingID } = router.query
  const user = JSON.parse(localStorage.getItem('profile'))
  const buildingId = user?.accounts?.data[0]?.building?._id
  if (buildingID === undefined || buildingId === undefined) {
    return <Billing />
  } else {
    router.push(`/dues/billing/${buildingID}`)
  }
  return null
}
