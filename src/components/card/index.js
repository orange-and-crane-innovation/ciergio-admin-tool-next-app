import React from 'react'
import PropTypes from 'prop-types'

import styles from './card.module.css'

const Card = ({ header, content, footer, noPadding }) => {
  const contentClass = noPadding
    ? `${styles.cardContentControl} ${styles.noPadding}`
    : styles.cardContentControl

  return (
    <div className={styles.cardContainer}>
      {header && <div className={styles.cardHeaderControl}>{header}</div>}
      <div className={contentClass}>{content}</div>
      {footer && <div className={styles.cardFooterControl}>{footer}</div>}
    </div>
  )
}

Card.propTypes = {
  header: PropTypes.any,
  content: PropTypes.any,
  footer: PropTypes.any,
  noPadding: PropTypes.bool
}

export default Card
