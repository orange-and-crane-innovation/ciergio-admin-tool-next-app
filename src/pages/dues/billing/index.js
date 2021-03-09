import { useRouter } from 'next/router'
import Billing from '@app/components/pages/dues'
import Page from '@app/permissions/page'

export default function DuesPage() {
  const router = useRouter()
  const { buildingID } = router.query
  const user = JSON.parse(localStorage.getItem('profile'))
  const buildingId = user?.accounts?.data[0]?.building?._id
  console.log(buildingId)
  router.push(`/dues/billing/${buildingID || buildingId}`)

  return null
}
