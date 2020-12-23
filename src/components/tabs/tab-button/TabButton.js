import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'

import styles from './TabButton.module.css'

const TabButton = ({ label, icon, onClick, isSelected, isDisabled }) => {
  const tabClasses = useMemo(
    () =>
      clsx(styles.tabButton, {
        [styles.isSelected]: isSelected,
        [styles.isDisabled]: isDisabled
      }),
    [isSelected, isDisabled]
  )

  return (
    <button className={tabClasses} onClick={onClick}>
      <span className="flex items-center">
        {icon && <span className="tab-icon">{icon}</span>}
        {label}
      </span>
    </button>
  )
}

TabButton.propTypes = {
  label: PropTypes.string,
  icon: PropTypes.node,
  onClick: PropTypes.func,
  isSelected: PropTypes.bool,
  isDisabled: PropTypes.bool
}

TabButton.defaultProps = {
  type: 'default',
  isSelected: false,
  isDisabled: false
}

export default TabButton
