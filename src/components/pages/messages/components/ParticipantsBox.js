import { FiMoreHorizontal, FiTrash } from 'react-icons/fi'

import Dropdown from '@app/components/dropdown'
import P from 'prop-types'
import getAccountTypeName from '@app/utils/getAccountTypeName'

const ParticipantsBox = ({ data }) => {
  const dropdownData = [
    {
      label: 'Remove member',
      icon: <FiTrash />,
      function: () => console.log('REMOVE MEMBER')
    }
  ]

  return (
    <div className="-mx-4 p-4 border-b flex">
      <div className="w-10 h-10 rounded-full overflow-auto">
        <img
          className="h-full w-full object-contain object-center"
          src={
            data?.user?.avatar && data?.user?.avatar !== ''
              ? data?.user?.avatar
              : `https://ui-avatars.com/api/?name=${`${data?.user?.firstName} ${data?.user?.lastName}`}&size=32`
          }
          alt="avatar"
        />
      </div>
      <div className="ml-4 flex flex-col flex-1">
        <span className="font-semibold">{`${data?.user?.firstName} ${data?.user?.lastName}`}</span>
        <span className="text-sm text-neutral-500">
          {getAccountTypeName(data?.accountType)}
        </span>
      </div>
      <Dropdown label={<FiMoreHorizontal />} items={dropdownData} />
    </div>
  )
}

ParticipantsBox.propTypes = {
  data: P.object
}

export default ParticipantsBox
