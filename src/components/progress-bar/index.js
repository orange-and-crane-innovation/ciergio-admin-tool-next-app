import React from 'react'
import PropTypes from 'prop-types'

import styles from './index.module.css'

const ProgressBar = ({ value }) => {
  return (
    <div className={styles.progressBarContainer}>
      <div className={styles.progressBarSubContainer}>
        <div
          style={{ width: `${value}%` }}
          className={styles.progressBarContent}
        ></div>
      </div>
      <div className={styles.progressBarText}>{value}%</div>
    </div>
  )
}

ProgressBar.defaultProps = {
  value: 0
}

ProgressBar.propTypes = {
  value: PropTypes.number
}

export default ProgressBar
