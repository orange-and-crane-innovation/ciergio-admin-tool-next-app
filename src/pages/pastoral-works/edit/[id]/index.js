import EditPosts from '@app/components/pages/posts/Edit'
import Page from '@app/permissions/page'

function PastoralWorksEditBulletinPage() {
  return (
    <Page
      route="/pastoral-works"
      nestedRoute="/pastoral-works/edit"
      page={<EditPosts />}
    />
  )
}

export default PastoralWorksEditBulletinPage
