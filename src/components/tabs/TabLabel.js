import React from 'react'
import P from 'prop-types'

import TabButton from './tab-button'

const TabLabel = ({ id, activeId, children, handleClick, isHidden }) => {
  const selectTab = () => {
    handleClick(id)
  }

  return (
    <li className="-mb-px mr-1">
      <TabButton
        id={id}
        label={children}
        onClick={selectTab}
        isSelected={activeId === id}
        isHidden={isHidden}
      />
    </li>
  )
}

TabLabel.propTypes = {
  id: P.string,
  activeId: P.string,
  children: P.any,
  handleClick: P.func,
  isHidden: P.bool
}

export default TabLabel
