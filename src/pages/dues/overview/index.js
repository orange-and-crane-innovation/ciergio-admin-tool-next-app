import Overview from '@app/components/pages/dues/Overview'
import { useRouter } from 'next/router'

export default function DuesBillingPage() {
  const router = useRouter()
  const user = JSON.parse(localStorage.getItem('profile'))
  const accountType = user?.accounts?.data[0]?.accountType

  const complexID = user?.accounts?.data[0]?.complex?._id

  return <Overview complexID={complexID} />
}
