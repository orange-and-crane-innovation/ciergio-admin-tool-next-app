import Company from '@app/components/pages/contact-us/company'
import { RolesPermissions } from '@app/components/rolespermissions'
import { useRouter } from 'next/router'

function CompanyPage() {
  const router = useRouter()
  const { id } = router.query

  return (
    <RolesPermissions permissionGroup="contactPage" moduleName="contactPage">
      <Company id={id} />
    </RolesPermissions>
  )
}

export default CompanyPage
