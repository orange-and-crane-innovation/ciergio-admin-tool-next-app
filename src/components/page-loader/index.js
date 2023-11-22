import { BiLoaderAlt } from 'react-icons/bi'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './pageloader.module.css'

const PageLoader = ({ message, fullPage }) => {
  const loaderClass = fullPage
    ? styles.fullPageloaderContainer
    : styles.pageloaderContainer

  return (
    <div className={loaderClass}>
      <BiLoaderAlt className="animate-spin text-4xl text-primary-500" />
      {message}
    </div>
  )
}

PageLoader.propTypes = {
  message: PropTypes.any,
  fullPage: PropTypes.bool
}

export default PageLoader
