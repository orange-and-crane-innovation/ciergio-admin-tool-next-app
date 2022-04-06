import Companies from './companies/[id]'
import Contacts from './complex/[id]'
import Directory from '@app/components/pages/directory'
import { RolesPermissions } from '@app/components/rolespermissions'

function DirectoryPage() {
  const profile = JSON.parse(window.localStorage.getItem('profile'))
  const accountType = profile?.accounts?.data[0]?.accountType
  if (accountType === 'administrator') {
    return (
      <RolesPermissions permission="directory">
        <Directory />
      </RolesPermissions>
    )
  }
  if (accountType === 'complex_admin') {
    return (
      <RolesPermissions permission="directory">
        <Contacts />
      </RolesPermissions>
    )
  }
  if (accountType === 'company_admin') {
    return (
      <RolesPermissions permission="directory">
        <Companies />
      </RolesPermissions>
    )
  }
}

export default DirectoryPage
