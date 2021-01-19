import { useRouter } from 'next/router'
import Company from '@app/components/pages/directory/company'

function CompanyPage() {
  const router = useRouter()
  const { id } = router.query

  return <Company id={id} />
}

export default CompanyPage
