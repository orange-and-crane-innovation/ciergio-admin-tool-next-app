import React from 'react'
import PropTypes from 'prop-types'

const Component = ({ icon, header, content }) => {
  return (
    <div className="flex flex-col items-center justify-center p-4 h-64 text-neutral-500 text-base leading-7">
      <p className="text-6xl mb-2">{icon}</p>
      <p className="font-semibold">{header}</p>
      <p>{content}</p>
    </div>
  )
}

Component.propTypes = {
  icon: PropTypes.any,
  header: PropTypes.any,
  content: PropTypes.any
}

export default Component
