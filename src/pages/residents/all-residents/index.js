import AllResidents from '@app/components/pages/residents/all-residents'
import Can from '@app/permissions/can'

function AllResidentsPage() {
  return (
    <Can
      perform="residents:view"
      yes={<AllResidents />}
      no={
        <div className="w-full flex items-center justify-center h-full bg-neutral-100">
          <h1>Ooppps! Error 401: Unauthorized!</h1>
        </div>
      }
    />
  )
}

export default AllResidentsPage
