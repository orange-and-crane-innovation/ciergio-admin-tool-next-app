import P from 'prop-types'
import { AiOutlineUserAdd } from 'react-icons/ai'

function EmptyStaff({ onClick }) {
  return (
    <div
      role="button"
      onKeyDown={() => {}}
      tabIndex={0}
      className="w-full flex justify-start items-center"
      onClick={onClick}
    >
      <div className="w-12 h-12 border border-blue-500 border-dashed rounded-full mr-4 flex justify-center items-center">
        <AiOutlineUserAdd className="text-blue-500" />
      </div>
    </div>
  )
}

EmptyStaff.propTypes = {
  onClick: P.func.isRequired
}

export default EmptyStaff
