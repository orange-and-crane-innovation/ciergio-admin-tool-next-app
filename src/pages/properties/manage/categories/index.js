import CategoriesPage from '@app/components/pages/properties/manage/categories'
import Page from '@app/permissions/page'

function ManageCategoriesPage() {
  return <Page route="/properties" page={<CategoriesPage />} />
}

export default ManageCategoriesPage
