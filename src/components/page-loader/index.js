import React from 'react'
import PropTypes from 'prop-types'
import { FaSpinner } from 'react-icons/fa'

import styles from './pageloader.module.css'

const PageLoader = ({ message, fullPage }) => {
  const loaderClass = fullPage
    ? styles.fullPageloaderContainer
    : styles.pageloaderContainer

  return (
    <div className={loaderClass}>
      <FaSpinner className="icon-spin" />
      {message}
    </div>
  )
}

PageLoader.propTypes = {
  message: PropTypes.any,
  fullPage: PropTypes.bool
}

export default PageLoader
