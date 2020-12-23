import React, { Component } from 'react'
import PropTypes from 'prop-types'

import styles from './Tabs.module.css'

export default class TabPanels extends Component {
  render() {
    const { activeId } = this.props
    const children = React.Children.map(this.props.children, child =>
      React.cloneElement(child, { activeId })
    )
    return <div className={styles.tabPanel}>{children}</div>
  }
}

TabPanels.propTypes = {
  activeId: PropTypes.string,
  children: PropTypes.any
}
