import PostViewPage from '@app/components/pages/posts/view'
import Page from '@app/permissions/page'

function PostViewComponent() {
  return (
    <Page
      route="/attractions-events"
      nestedRoute="/attractions-events/view"
      page={<PostViewPage />}
    />
  )
}

export default PostViewComponent
