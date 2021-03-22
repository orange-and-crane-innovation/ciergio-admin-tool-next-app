import Overview from '@app/components/pages/dues/Overview'
import Page from '@app/permissions/page'

const OverviewPage = () => {
  return <Page route="/dues" nestedRoute="/dues/overview" page={<Overview />} />
}

export default OverviewPage
