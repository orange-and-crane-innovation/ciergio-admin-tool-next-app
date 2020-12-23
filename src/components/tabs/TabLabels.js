import React, { Component } from 'react'
import PropTypes from 'prop-types'

import styles from './Tabs.module.css'

export default class TabLabels extends Component {
  render() {
    const { activeId, handleClick } = this.props
    const children = React.Children.map(this.props.children, child =>
      React.cloneElement(child, { activeId, handleClick })
    )
    return <ul className={styles.tabLabel}>{children}</ul>
  }
}

TabLabels.propTypes = {
  activeId: PropTypes.string,
  handleClick: PropTypes.func,
  children: PropTypes.any
}
