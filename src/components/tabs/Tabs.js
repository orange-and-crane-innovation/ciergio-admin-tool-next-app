import React, { useCallback, useState } from 'react'
import P from 'prop-types'

import styles from './Tabs.module.css'

const Tabs = ({ children, defaultTab, identifyTab }) => {
  const [activeid, setActiveId] = useState(defaultTab)
  const handleclick = useCallback(id => {
    setActiveId(id)
    identifyTab(id)
  }, [])
  const _children = React.Children.map(children, child =>
    React.cloneElement(child, { activeid, handleclick })
  )

  return <div className={styles.tabContainer}>{_children}</div>
}

Tabs.propTypes = {
  children: P.node.isRequired,
  defaultTab: P.any.isRequired,
  identifyTab: P.any
}

export default Tabs
