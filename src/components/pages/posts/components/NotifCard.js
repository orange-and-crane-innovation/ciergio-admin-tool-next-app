import React from 'react'
import PropTypes from 'prop-types'

const Component = ({ icon, header, content }) => {
  return (
    <div className="flex flex-col items-center justify-center p-4 text-neutral-500 h-64">
      <p className="text-6xl">{icon}</p>
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
