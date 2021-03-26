import PostViewPage from '@app/components/pages/posts/view'
import Page from '@app/permissions/page'

function PostViewComponent() {
  return <Page route="/posts" nestedRoute="/posts" page={<PostViewPage />} />
}

export default PostViewComponent
