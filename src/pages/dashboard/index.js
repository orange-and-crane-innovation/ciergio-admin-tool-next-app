import withAuth from '@app/utils/withAuth'

function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  )
}

export default withAuth(DashboardPage)
