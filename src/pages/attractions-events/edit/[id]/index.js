import EditPosts from '@app/components/pages/posts/Edit'
import Page from '@app/permissions/page'

function EditBulletinPage() {
  return (
    <Page
      route="/attractions-events"
      nestedRoute="/attractions-events/edit"
      page={<EditPosts />}
    />
  )
}

export default EditBulletinPage
