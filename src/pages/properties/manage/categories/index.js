import CategoriesPage from '@app/components/pages/properties/manage/categories'
import Page from '@app/permissions/page'

function ManageCategoriesPage() {
  return (
    <Page
      route="/properties"
      nestedRoute="/properties/manage/categories"
      page={<CategoriesPage />}
    />
  )
}

export default ManageCategoriesPage
