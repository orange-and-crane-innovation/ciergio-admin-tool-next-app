import React from 'react'
import P from 'prop-types'

import styles from './Tabs.module.css'

const TabLabels = ({ activeid, handleclick, children }) => {
  const _children = React.Children.map(children, child =>
    React.cloneElement(child, { activeid, handleclick })
  )
  return <ul className={styles.tabLabel}>{_children}</ul>
}

TabLabels.propTypes = {
  activeid: P.string,
  handleclick: P.func,
  children: P.any
}

export default TabLabels
