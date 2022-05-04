import Company from '@app/components/pages/directory/company'
import { RolesPermissions } from '@app/components/rolespermissions'
import { useRouter } from 'next/router'

function CompanyPage() {
  const router = useRouter()
  const { id } = router.query

  return (
    <RolesPermissions permission="directory" roleName="accounts">
      <Company id={id} />
    </RolesPermissions>
  )
}

export default CompanyPage
