import PostViewPage from '@app/components/pages/posts/view'
import Page from '@app/permissions/page'

function PostViewComponent() {
  return (
    <Page
      route="/qr-code"
      nestedRoute="/qr-code/posts"
      page={<PostViewPage />}
    />
  )
}

export default PostViewComponent
