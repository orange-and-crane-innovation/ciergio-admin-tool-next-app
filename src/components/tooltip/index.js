import React from 'react'
import PropTypes from 'prop-types'
import { TOOLTIP } from '@app/utils'

const Tooltip = ({ type, placement, effect, text, children }) => {
  return (
    <>
      <span data-tip={text}>{children}</span>
      {TOOLTIP.Show(type, placement, effect)}
    </>
  )
}

Tooltip.defaultProps = {
  type: 'dark',
  placement: 'top',
  effect: 'float'
}

Tooltip.propTypes = {
  type: PropTypes.any,
  placement: PropTypes.any,
  effect: PropTypes.string,
  text: PropTypes.any.isRequired,
  children: PropTypes.any.isRequired
}

export default Tooltip
