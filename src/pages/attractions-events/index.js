import Page from '@app/permissions/page'
import Posts from '@app/components/pages/posts'

function PostsPage() {
  return <Page route="/attractions-events" page={<Posts />} />
}

export default PostsPage
