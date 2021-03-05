import { useRouter } from 'next/router'
import Company from '@app/components/pages/directory/company'
import Page from '@app/permissions/page'

function CompanyPage() {
  const router = useRouter()
  const { id } = router.query

  return <Page route="/directory" page={<Company id={id} />} />
}

export default CompanyPage
