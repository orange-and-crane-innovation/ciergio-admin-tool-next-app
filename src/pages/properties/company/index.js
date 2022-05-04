import { useRouter } from 'next/router'

import CompanyPage from '@app/components/pages/properties/company'
import { RolesPermissions } from '@app/components/rolespermissions'

function CompanyPropertiesPage() {
  const router = useRouter()
  const user = JSON.parse(localStorage.getItem('profile'))
  const accountType = user?.accounts?.data[0]?.accountType

  if (accountType === 'administrator') {
    return (
      <RolesPermissions permissionGroup="accounts" moduleName="myProperties">
        <CompanyPage />
      </RolesPermissions>
    )
  } else if (accountType === 'company_admin') {
    const id = user?.accounts?.data[0]?.company?._id
    router.push(`/properties/company/${id}/overview`)
  } else if (accountType === 'complex_admin') {
    const id = user?.accounts?.data[0]?.complex?._id
    router.push(`/properties/complex/${id}/overview`)
  }
  return null
}

export default CompanyPropertiesPage
