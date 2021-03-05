import MyMembers from '@app/components/pages/members'
import Page from '@app/permissions/page'

function MyMembersPage() {
  return <Page route="/my-members" page={<MyMembers />} />
}

export default MyMembersPage
