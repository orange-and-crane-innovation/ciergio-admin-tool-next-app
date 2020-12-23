import React from 'react'
import PropTypes from 'prop-types'

export default class TabPanel extends React.Component {
  render() {
    const { activeId, id, children } = this.props
    return <>{activeId === id && children}</>
  }
}

TabPanel.propTypes = {
  activeId: PropTypes.string,
  id: PropTypes.string,
  children: PropTypes.any
}
