import React from 'react'
import PropTypes from 'prop-types'

import { DATE } from '@app/utils'

const DEFAULT_AVATAR =
  'https://s3-ap-southeast-1.amazonaws.com/ciergio-online.assets/web-assets/ava-default.png'

const Component = ({
  date,
  avatar,
  firstName,
  lastName,
  count,
  uniqueCount
}) => {
  const avatarImg = avatar || DEFAULT_AVATAR

  return (
    <div className="flex flex-col text-base font-semibold">
      <div className="flex">
        <div className="flex-1 m-2">
          <div className="text-neutral-500">Date Created</div>
          <div>{DATE.toFriendlyDate(date)}</div>
        </div>

        <div className="flex-1 m-2">
          <div className="text-neutral-500">Created by</div>
          <div className="flex items-center">
            <div className="rounded-full h-4 w-4 bg-white overflow-hidden mr-2">
              <img
                alt="avatar"
                src={avatarImg}
                className="object-contain object-center h-full w-full"
              />
            </div>
            {`${firstName} ${lastName}`}
          </div>
        </div>
      </div>

      <div className="flex">
        <div className="flex-1 m-2">
          <div className="text-neutral-500">Total Views</div>
          <div>{count}</div>
        </div>
        <div className="flex-1 m-2">
          <div className="text-neutral-500">Unique Views</div>
          <div>{uniqueCount}</div>
        </div>
      </div>
    </div>
  )
}

Component.propTypes = {
  date: PropTypes.string,
  avatar: PropTypes.string,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  count: PropTypes.string,
  uniqueCount: PropTypes.string
}

export default Component
