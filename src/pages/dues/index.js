import Dues from '@app/components/pages/dues/'
import Page from '@app/permissions/page'

export default function DuesPage() {
  return <Page route="/dues" page={<Dues />} />
}
