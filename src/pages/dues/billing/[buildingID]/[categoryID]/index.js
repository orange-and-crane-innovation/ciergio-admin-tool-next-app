import Billing from '@app/components/pages/dues/'
import Page from '@app/permissions/page'

export default function DynamicUnsentPage() {
  const user = JSON.parse(localStorage.getItem('profile'))
  const complexID = user?.accounts?.data[0]?.complex?._id
  return (
    <Page
      route="/dues"
      nestedRoute="/dues/billing/:id/:categoryId"
      page={<Billing complexId={complexID} />}
    />
  )
}
