import React from 'react'
import P from 'prop-types'

const Title = ({ children }) => {
  return (
    <div className="left-sidebar-title">
      <span>{children}</span>
    </div>
  )
}
Title.propTypes = {
  children: P.string || P.element
}

export default Title
