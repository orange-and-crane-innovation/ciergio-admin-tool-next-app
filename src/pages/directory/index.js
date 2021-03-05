import Directory from '@app/components/pages/directory'
import Page from '@app/permissions/page'

function DirectoryPage() {
  return <Page route="/directory" page={<Directory />} />
}

export default DirectoryPage
