import React from 'react'
import PropTypes from 'prop-types'
import ReactTooltip from 'react-tooltip'

export const Show = type => <ReactTooltip type={type} effect="solid" />

export const Refresh = () => ReactTooltip.rebuild()

Show.defaultProps = {
  type: 'dark'
}

Show.propTypes = {
  type: PropTypes.oneOf(['dark', 'success', 'error', 'info', 'warning'])
}

export default Show
