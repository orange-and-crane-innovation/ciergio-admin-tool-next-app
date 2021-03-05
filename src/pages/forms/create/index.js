import CreateForms from '@app/components/pages/forms/Create'
import Page from '@app/permissions/page'

function CreateFormsPage() {
  return <Page route="/forms" page={<CreateForms />} />
}

export default CreateFormsPage
