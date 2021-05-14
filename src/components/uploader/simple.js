/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react'
import PropTypes from 'prop-types'

import { FaSpinner, FaTimes } from 'react-icons/fa'

import styles from './simple.module.css'

const Uploader = ({
  loading,
  error,
  files,
  fileUrls,
  multiple,
  maxFiles,
  accept,
  onUpload,
  onRemove
}) => {
  const containerClass = error
    ? `${styles.uploaderContainer} ${styles.error}`
    : styles.uploaderContainer

  const handleChange = () => {
    document.getElementById('file').click()
  }

  return (
    <>
      <div className="flex items-center">
        <div className={containerClass}>
          <input
            className={styles.uploaderControl}
            type="file"
            id="file"
            name="file"
            onChange={onUpload}
            accept={accept}
            multiple={multiple}
          />
          <div className={styles.uploaderFile} onClick={handleChange}>
            <span className={styles.uploaderFileContent}>Choose File</span>
          </div>
        </div>
        <div>
          {loading ? (
            <FaSpinner className="icon-spin" />
          ) : (
            files?.map((file, index) => {
              return file.name
            })
          )}
        </div>
        <FaTimes
          className={`${
            files?.length > 0 ? 'ml-2 visible cursor-pointer' : 'invisible'
          }  `}
          onClick={onRemove}
        />
      </div>
      <div className={styles.uploaderError}>{error}</div>
    </>
  )
}

Uploader.propTypes = {
  type: PropTypes.string,
  loading: PropTypes.bool,
  error: PropTypes.string,
  files: PropTypes.array,
  fileUrls: PropTypes.array,
  multiple: PropTypes.bool,
  maxFiles: PropTypes.number,
  accept: PropTypes.string,
  onUpload: PropTypes.func,
  onRemove: PropTypes.func
}

export default Uploader
