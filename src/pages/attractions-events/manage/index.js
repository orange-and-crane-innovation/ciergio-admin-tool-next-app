import ManageCategories from '@app/components/pages/attractions-events'
import Page from '@app/permissions/page'

function ManageCategoriesPage() {
  return (
    <Page
      route="/attractions-events"
      nestedRoute="/attractions-events/manage-categories"
      page={<ManageCategories />}
    />
  )
}

export default ManageCategoriesPage
