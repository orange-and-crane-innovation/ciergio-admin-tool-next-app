import Billing from '@app/components/pages/dues'
import { RolesPermissions } from '@app/components/rolespermissions'
import { useRouter } from 'next/router'

export default function DuesPage() {
  const router = useRouter()
  const { buildingID } = router.query
  const user = JSON.parse(localStorage.getItem('profile'))
  const buildingId = user?.accounts?.data[0]?.building?._id
  const complexID = user?.accounts?.data[0]?.complex?._id

  if (buildingID) {
    return (
      <RolesPermissions roleName="myDues" permission="myDues">
        <Billing complexId={complexID} bid={buildingID} />
      </RolesPermissions>
    )
  } else {
    router.push(`/dues/billing/${buildingId}`)
  }
  return null
}
