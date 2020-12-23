import React from 'react'
import P from 'prop-types'

import styles from './Tabs.module.css'

const TabPanels = ({ activeId, children }) => {
  const _children = React.Children.map(children, child =>
    React.cloneElement(child, { activeId })
  )
  return <div className={styles.tabPanel}>{_children}</div>
}

TabPanels.propTypes = {
  activeId: P.string,
  children: P.any
}

export default TabPanels
