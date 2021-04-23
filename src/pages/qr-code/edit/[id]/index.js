import EditPosts from '@app/components/pages/posts/Edit'
import Page from '@app/permissions/page'

function EditBulletinPage() {
  return (
    <Page route="/qr-code" nestedRoute="/qr-code/edit" page={<EditPosts />} />
  )
}

export default EditBulletinPage
