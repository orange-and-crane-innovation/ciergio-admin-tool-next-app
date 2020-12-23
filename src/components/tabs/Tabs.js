import React from 'react'
import TabLabels from './TabLabels'
import TabLabel from './TabLabel'
import TabPanels from './TabPanels'
import TabPanel from './TabPanel'

import styles from './Tabs.module.css'

export default class Tabs extends React.Component {
  static TabLabels = TabLabels
  static TabLabel = TabLabel
  static TabPanels = TabPanels
  static TabPanel = TabPanel

  state = {
    activeId: this.props.defaultTab
  }

  handleClick = id => {
    this.setState(() => ({
      activeId: id
    }))
  }

  render() {
    const { activeId } = this.state
    const children = React.Children.map(this.props.children, child =>
      React.cloneElement(child, { activeId, handleClick: this.handleClick })
    )
    return <div className={styles.tabContainer}>{children}</div>
  }
}
