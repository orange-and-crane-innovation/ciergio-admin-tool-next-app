import P from 'prop-types'
import { FiUserPlus } from 'react-icons/fi'

function EmptyStaff({ onClick, withText }) {
  return (
    <div
      role="button"
      onKeyDown={() => {}}
      tabIndex={0}
      className="w-full flex justify-start items-center"
      onClick={onClick}
    >
      <div className="w-14 h-14 border border-blue-500 border-dashed rounded-full mr-2 flex justify-center items-center">
        <FiUserPlus className="text-blue-500" />
      </div>
      {withText && <span className="text-secondary-500">Add Staff</span>}
    </div>
  )
}

EmptyStaff.propTypes = {
  onClick: P.func.isRequired,
  withText: P.bool
}

export default EmptyStaff
