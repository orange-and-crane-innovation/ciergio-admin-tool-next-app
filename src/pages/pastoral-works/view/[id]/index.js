import PostViewPage from '@app/components/pages/posts/view'
import Page from '@app/permissions/page'

function PastoralWorksPostViewComponent() {
  return (
    <Page
      route="/psatoral-works"
      nestedRoute="/pastoral-wprks/view"
      page={<PostViewPage />}
    />
  )
}

export default PastoralWorksPostViewComponent
