import React, { useCallback, useState } from 'react'
import P from 'prop-types'

import styles from './Tabs.module.css'

const Tabs = ({ children, defaultTab }) => {
  const [activeId, setActiveId] = useState(defaultTab)
  const handleClick = useCallback(id => setActiveId(id), [])
  const _children = React.Children.map(children, child =>
    React.cloneElement(child, { activeId, handleClick })
  )

  return <div className={styles.tabContainer}>{_children}</div>
}

Tabs.propTypes = {
  children: P.node.isRequired,
  defaultTab: P.any.isRequired
}

export default Tabs
