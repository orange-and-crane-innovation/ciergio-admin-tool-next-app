import Directory from '@app/components/pages/directory'
import Page from '@app/permissions/page'
import Contacts from './complex/[id]'
import Companies from './companies/[id]'

function DirectoryPage() {
  const profile = JSON.parse(window.localStorage.getItem('profile'))
  const accountType = profile?.accounts?.data[0]?.accountType
  if (accountType === 'administrator') {
    return <Page route="/directory" page={<Directory />} />
  }
  if (accountType === 'complex_admin') {
    return <Contacts />
  }
  if (accountType === 'company_admin') {
    return <Companies />
  }
}

export default DirectoryPage
