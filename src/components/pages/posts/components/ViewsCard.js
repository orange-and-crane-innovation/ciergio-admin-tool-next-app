import React from 'react'
import PropTypes from 'prop-types'
import { FaRegUser } from 'react-icons/fa'

import UserCard from './UserCard'
import NotifCard from './NotifCard'

const Component = ({ data }) => {
  return (
    <div className="flex flex-col text-base font-normal -m-4">
      {data.length > 0 ? (
        data.map((item, index) => {
          return (
            <UserCard
              key={index}
              avatar={item?.avatar}
              firstName={item?.firstName}
              lastName={item?.lastName}
            />
          )
        })
      ) : (
        <NotifCard
          icon={<FaRegUser />}
          header="No viewer yet."
          content={`Sorry, this post don't have any viewer yet.`}
        />
      )}
    </div>
  )
}

Component.propTypes = {
  data: PropTypes.array
}

export default Component
