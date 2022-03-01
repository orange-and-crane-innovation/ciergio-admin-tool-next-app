import CreatePosts from '@app/components/pages/posts/create'
import Page from '@app/permissions/page'

function PastoralWorksCreateBulletinPage() {
  return (
    <Page
      route="/pastoral-works"
      nestedRoute="/pastoral-works/create"
      page={<CreatePosts />}
    />
  )
}

export default PastoralWorksCreateBulletinPage
