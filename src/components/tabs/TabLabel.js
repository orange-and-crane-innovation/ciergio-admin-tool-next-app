import React from 'react'
import P from 'prop-types'
import { useRouter } from 'next/router'
import TabButton from './tab-button'

const TabLabel = ({ id, activeid, children, handleclick, isHidden, route }) => {
  const router = useRouter()
  const selectTab = () => {
    handleclick(id)

    if (route && route !== '') {
      router.push(route)
    }
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
  isHidden: P.string
}

export default TabLabel
