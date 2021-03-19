import CreateForms from '@app/components/pages/forms/Create'
import Page from '@app/permissions/page'

function CreateFormsPage() {
  return (
    <Page route="/forms" nestedRoute="/forms/create" page={<CreateForms />} />
  )
}

export default CreateFormsPage
