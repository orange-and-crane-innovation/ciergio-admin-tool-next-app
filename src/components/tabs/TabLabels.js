import React from 'react'
import P from 'prop-types'

import styles from './Tabs.module.css'

const TabLabels = ({ activeId, handleClick, children }) => {
  const _children = React.Children.map(children, child =>
    React.cloneElement(child, { activeId, handleClick })
  )
  return <ul className={styles.tabLabel}>{_children}</ul>
}

TabLabels.propTypes = {
  activeId: P.string,
  handleClick: P.func,
  children: P.any
}

export default TabLabels
