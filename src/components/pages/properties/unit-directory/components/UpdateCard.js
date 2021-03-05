import React from 'react'
import PropTypes from 'prop-types'

const Component = ({ type, title }) => {
  return (
    <div className="text-base font-normal">
      {type === 'reinvite' ? (
        <>
          <p>
            {`You are about to `}
            <strong>{`Resend Invite "${title}" `}</strong>
            {`from the list.`}
          </p>
          <p>Do you want to continue?</p>
        </>
      ) : null}
    </div>
  )
}

Component.propTypes = {
  type: PropTypes.string,
  title: PropTypes.any
}

export default Component
