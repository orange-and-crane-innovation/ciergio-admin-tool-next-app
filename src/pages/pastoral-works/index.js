import Posts from '@app/components/pages/posts'
import Page from '@app/permissions/page'

function PastoralWorksPage() {
  return <Page route="/pastoral-works" page={<Posts />} />
}

export default PastoralWorksPage
