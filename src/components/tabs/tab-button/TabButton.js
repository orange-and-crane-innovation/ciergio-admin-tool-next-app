import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'

import styles from './TabButton.module.css'

const TabButton = ({
  id,
  label,
  icon,
  onClick,
  isSelected,
  isDisabled,
  isHidden
}) => {
  const tabClasses = useMemo(
    () =>
      clsx(styles.tabButton, {
        [styles.isSelected]: isSelected,
        [styles.isDisabled]: isDisabled,
        [styles.isHidden]: isHidden
      }),
    [isSelected, isDisabled]
  )

  return (
    <button id={id} className={tabClasses} onClick={onClick}>
      <span className="flex items-center">
        {icon && <span className="tab-icon">{icon}</span>}
        {label}
      </span>
    </button>
  )
}

TabButton.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  icon: PropTypes.node,
  onClick: PropTypes.func,
  isSelected: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isHidden: PropTypes.bool
}

TabButton.defaultProps = {
  type: 'default',
  isSelected: false,
  isDisabled: false,
  isHidden: false
}

export default TabButton
