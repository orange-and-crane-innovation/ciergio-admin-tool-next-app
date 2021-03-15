import { AiOutlineUserAdd } from 'react-icons/ai'

function EmptyStaff() {
  return (
    <div className="w-full flex justify-start items-center">
      <div className="w-12 h-12 border border-blue-500 border-dashed rounded-full mr-4 flex justify-center items-center">
        <AiOutlineUserAdd className="text-blue-500" />
      </div>
    </div>
  )
}

export default EmptyStaff
