import React from 'react'
import P from 'prop-types'

import TabButton from './tab-button'

const TabLabel = ({ id, activeId, children, handleClick }) => {
  const selectTab = () => {
    handleClick(id)
  }

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
  id: P.string,
  activeId: P.string,
  children: P.any,
  handleClick: P.func
}

export default TabLabel
