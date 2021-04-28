import React from 'react'
import PropTypes from 'prop-types'
import ReactTooltip from 'react-tooltip'

export const Show = (type, placement, effect) => (
  <ReactTooltip type={type} place={placement} effect={effect} html={true} />
)

export const Refresh = () => ReactTooltip.rebuild()

Show.defaultProps = {
  type: 'dark',
  placement: 'top',
  effect: 'float'
}

Show.propTypes = {
  type: PropTypes.oneOf(['dark', 'success', 'error', 'info', 'warning']),
  placement: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
  effect: PropTypes.oneOf(['float', 'solid'])
}

export default Show
