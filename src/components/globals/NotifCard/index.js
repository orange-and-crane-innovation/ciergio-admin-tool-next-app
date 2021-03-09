import React from 'react'
import PropTypes from 'prop-types'

import styles from './index.module.css'

const NotifCardComponent = ({ icon, header, content }) => {
  return (
    <div className={styles.NotifCardContainer}>
      <p className={styles.NotifCardIcon}>{icon}</p>
      <p className={styles.NotifCardHeader}>{header}</p>
      <p>{content}</p>
    </div>
  )
}

NotifCardComponent.propTypes = {
  icon: PropTypes.any,
  header: PropTypes.any,
  content: PropTypes.any
}

export default NotifCardComponent
