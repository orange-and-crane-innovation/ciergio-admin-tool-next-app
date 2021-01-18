import { useRouter } from 'next/router'
import Company from '@app/components/pages/directory/company'

function CompanyPage() {
  const router = useRouter()
  const { company } = router.query

  return <Company name={company} />
}

export default CompanyPage
