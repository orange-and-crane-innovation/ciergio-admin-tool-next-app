import Posts from '@app/components/pages/posts'
import Page from '@app/permissions/page'

function PostsPage() {
  return <Page route="/daily-readings" page={<Posts />} />
}

export default PostsPage
