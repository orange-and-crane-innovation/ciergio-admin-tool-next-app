import Billing from '@app/components/pages/dues'
import Page from '@app/permissions/page'

export default function DynamicUnsentPage() {
  return (
    <Page route="/dues" nestedRoute="/dues/billing/:id" page={<Billing />} />
  )
}
