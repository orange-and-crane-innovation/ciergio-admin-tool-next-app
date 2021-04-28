import PostViewPage from '@app/components/pages/posts/view'
import Page from '@app/permissions/page'

function PostViewComponent() {
  return (
    <Page route="/posts" nestedRoute="/posts/view" page={<PostViewPage />} />
  )
}

export default PostViewComponent
