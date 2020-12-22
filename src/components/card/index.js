import React from 'react'
import PropTypes from 'prop-types'

import styles from './card.module.css'

const Card = ({ header, content, footer, noBorder }) => {
  const contentClass = noBorder
    ? `${styles.cardContentControl} ${styles.noBorder}`
    : styles.cardContentControl

  return (
    <div className={styles.cardContainer}>
      {header && <div className={styles.cardHeaderControl}>{header}</div>}
      <div className={contentClass}>{content}</div>
      <div className={styles.cardFooterControl}>{footer}</div>
    </div>
  )
}

Card.propTypes = {
  header: PropTypes.any,
  content: PropTypes.any,
  footer: PropTypes.any,
  noBorder: PropTypes.bool
}

export default Card
