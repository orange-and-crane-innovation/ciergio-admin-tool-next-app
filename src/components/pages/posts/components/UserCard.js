import React from 'react'
import PropTypes from 'prop-types'
import { FaEllipsisH } from 'react-icons/fa'

import { IMAGES } from '@app/constants'

const DEFAULT_AVATAR = IMAGES.DEFAULT_AVATAR

const Component = ({ index, avatar, firstName, lastName }) => {
  const avatarImg = avatar || DEFAULT_AVATAR
  return (
    <div key={index} className="flex-1 border-b py-4 px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="rounded-full h-8 w-8 bg-white overflow-hidden mr-2">
            <img
              alt="avatar"
              src={avatarImg}
              className="object-contain object-center h-full w-full"
            />
          </div>
          {`${firstName} ${lastName}`}
        </div>
        <FaEllipsisH className="hidden" />
      </div>
    </div>
  )
}

Component.propTypes = {
  index: PropTypes.number,
  avatar: PropTypes.string,
  firstName: PropTypes.string,
  lastName: PropTypes.string
}

export default Component
