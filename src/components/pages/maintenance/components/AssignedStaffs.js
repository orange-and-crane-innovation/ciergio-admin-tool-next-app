import P from 'prop-types'

function AssignedStaffs({ staffs }) {
  return (
    <div className="relative">
      {staffs.map(staff => (
        <div
          key={staff?.user?._id}
          className="w-full flex justify-start items-center"
        >
          <div className="w-12 h-12 border border-blue-500 border-dashed rounded-full mr-4 flex justify-center items-center">
            <img
              src={staff.user?.avatar}
              alt={staff.user.firstName}
              className="rounded-full"
            />
          </div>
        </div>
      ))}
    </div>
  )
}

AssignedStaffs.propTypes = {
  staffs: P.array.isRequired
}

export default AssignedStaffs
