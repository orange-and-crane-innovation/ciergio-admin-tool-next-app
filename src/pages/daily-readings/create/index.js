import CreatePosts from '@app/components/pages/posts/create'
import Page from '@app/permissions/page'

function CreateBulletinPage() {
  return (
    <Page
      route="/daily-readings"
      nestedRoute="/daily-readings/create"
      page={<CreatePosts />}
    />
  )
}

export default CreateBulletinPage
