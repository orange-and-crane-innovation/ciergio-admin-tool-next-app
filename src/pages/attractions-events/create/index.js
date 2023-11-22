import CreatePosts from '@app/components/pages/posts/Create'
import Page from '@app/permissions/page'

function CreateBulletinPage() {
  return (
    <Page
      route="/attractions-events"
      nestedRoute="/attractions-events/create"
      page={<CreatePosts />}
    />
  )
}

export default CreateBulletinPage
