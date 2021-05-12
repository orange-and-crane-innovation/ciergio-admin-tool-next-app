import { useRouter } from 'next/router'
import Billing from '@app/components/pages/dues'
import Page from '@app/permissions/page'

export default function DuesPage() {
  const router = useRouter()
  const { buildingID } = router.query
  const user = JSON.parse(localStorage.getItem('profile'))
  const buildingId = user?.accounts?.data[0]?.building?._id
  const complexID = user?.accounts?.data[0]?.complex?._id

  if (buildingID) {
    console.log('test')
    return (
      <Page
        route="/dues"
        nestedRoute="/dues/billing"
        page={<Billing complexId={complexID} bid={buildingID} />}
      />
    )
  } else {
    console.log('teerrst')
    router.push(`/dues/billing/${buildingId}`)
  }
  return null
}
