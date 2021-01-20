import { useRouter } from 'next/router'
import Company from '@app/components/pages/contact-us/company'

function CompanyPage() {
  const router = useRouter()
  const { id } = router.query

  return <Company id={id} />
}

export default CompanyPage
