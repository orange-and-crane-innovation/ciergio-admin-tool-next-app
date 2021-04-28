import React from 'react'
import P from 'prop-types'

import styles from './PageNotFound.module.css'

function PageNotFound({ message }) {
  return (
    <div className={styles.pageNotFound}>
      <span className={styles.heading}>404</span>
      <h2 className={styles.subHeading}>Something went wrong here</h2>
      <span className={styles.message}>{message}</span>
    </div>
  )
}

PageNotFound.defaultProps = {
  message: 'Page not found.'
}

PageNotFound.propTypes = {
  message: P.string
}

export default PageNotFound
