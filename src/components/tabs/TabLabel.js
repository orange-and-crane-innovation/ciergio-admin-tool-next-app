import React from 'react'
import PropTypes from 'prop-types'

import TabButton from './tab-button'

const TabLabel = ({ id, activeId, children, handleClick }) => {
  const selectTab = () => {
    handleClick(id)
  }
  console.log(activeId)
  return (
    <li className="-mb-px mr-1">
      <TabButton
        label={children}
        onClick={selectTab}
        isSelected={activeId === id}
      />
    </li>
  )
}

TabLabel.propTypes = {
  id: PropTypes.string,
  activeId: PropTypes.string,
  children: PropTypes.any,
  handleClick: PropTypes.func
}

export default TabLabel
