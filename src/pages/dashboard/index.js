import withAuth from '@app/lib/withAuth'

function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  )
}

export default withAuth(DashboardPage)
