import EditPosts from '@app/components/pages/posts/Edit'
import Page from '@app/permissions/page'

function EditBulletinPage() {
  return (
    <Page
      route="/daily-readings"
      nestedRoute="/daily-readings/edit"
      page={<EditPosts />}
    />
  )
}

export default EditBulletinPage
