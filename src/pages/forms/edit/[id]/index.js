import EditForms from '@app/components/pages/forms/edit'
import Page from '@app/permissions/page'

function EditFormsPage() {
  return <Page route="/forms" nestedRoute="/forms/edit" page={<EditForms />} />
}

export default EditFormsPage
