import React, { useMemo } from 'react'
import clsx from 'clsx'
import PropTypes from 'prop-types'

import styles from './simple.module.css'

const SimpleCard = ({
  icon,
  content,
  primary,
  success,
  danger,
  warning,
  info
}) => {
  const simpleCardClasses = useMemo(
    () =>
      clsx(styles.cardLeftPanel, {
        [styles.isPrimary]: primary,
        [styles.isSuccess]: success,
        [styles.isDanger]: danger,
        [styles.isWarning]: warning,
        [styles.isInfo]: info
      }),
    [primary, success, danger, warning, info]
  )

  return (
    <div className={styles.cardContainer}>
      <div className={styles.cardSubContainer}>
        <div className={simpleCardClasses}>{icon}</div>
        <div className={styles.cardRightPanel}>{content}</div>
      </div>
    </div>
  )
}

SimpleCard.propTypes = {
  icon: PropTypes.any,
  content: PropTypes.any,
  primary: PropTypes.bool,
  success: PropTypes.bool,
  danger: PropTypes.bool,
  warning: PropTypes.bool,
  info: PropTypes.bool
}

export default SimpleCard
