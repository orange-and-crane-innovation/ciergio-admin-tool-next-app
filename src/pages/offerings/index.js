import Donations from '@app/components/pages/donations'
import Page from '@app/permissions/page'

export default function DonationsPage() {
  return <Page route="/offerings" page={<Donations />} />
}
