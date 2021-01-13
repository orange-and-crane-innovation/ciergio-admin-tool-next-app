import { useRouter } from 'next/router'
import Company from '@app/components/pages/directory/company'

function CompanyPage() {
  const router = useRouter()
  const { company } = router.query
  const name = company.replaceAll('-', ' ')

  return <Company name={name} />
}

export default CompanyPage
