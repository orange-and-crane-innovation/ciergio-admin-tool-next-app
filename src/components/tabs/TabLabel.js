import React from 'react'
import P from 'prop-types'

import TabButton from './tab-button'

const TabLabel = ({ id, activeid, children, handleclick, isHidden }) => {
  const selectTab = () => {
    handleclick(id)
  }

  return (
    <li className="-mb-px mr-1">
      <TabButton
        id={id}
        label={children}
        onClick={selectTab}
        isSelected={activeid === id}
        isHidden={isHidden}
      />
    </li>
  )
}

TabLabel.propTypes = {
  id: P.string,
  activeid: P.string,
  children: P.any,
  handleclick: P.func,
  isHidden: P.bool
}

export default TabLabel
