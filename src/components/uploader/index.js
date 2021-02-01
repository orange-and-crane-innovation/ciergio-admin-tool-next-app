/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { FaSpinner, FaRegTrashAlt } from 'react-icons/fa'

import ImageAdd from '@app/assets/svg/image-add.svg'
import ImageFile from '@app/assets/svg/file-plus.svg'
import ImagePdf from '@app/assets/svg/file-pdf.svg'
import ImageDoc from '@app/assets/svg/file-doc.svg'
import styles from './index.module.css'

const Uploader = ({
  type,
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
  useEffect(() => {
    console.log('ua')
  }, [])
  const [isOver, setIsOver] = useState(false)
  let uploadedFiles

  const containerClass = isOver
    ? `${styles.uploaderContainer} ${styles.over}`
    : error
    ? `${styles.uploaderContainer} ${styles.error}`
    : styles.uploaderContainer

  const handleChange = () => {
    document.getElementById('file').click()
  }

  const handleDragOver = e => {
    e.preventDefault()
    setIsOver(true)
  }

  const handleDragLeave = () => {
    setIsOver(false)
  }

  const handleOnDrop = e => {
    e.preventDefault()
    setIsOver(false)
    onUpload(e)
  }

  const handleRemove = () => {
    setIsOver(false)
  }

  const getFileSize = file => {
    const size = file.size
    if (size === 0) return '0 Bytes'

    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(size) / Math.log(k))

    return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (fileUrls && fileUrls.length > 0) {
    uploadedFiles = fileUrls.map((file, index) => {
      return (
        <div key={index} className={containerClass}>
          <div
            className={styles.uploaderImage}
            style={{
              backgroundImage: `url(${!loading && file})`
            }}
          >
            {files[index] && files[index].type === 'application/pdf' ? (
              <ImagePdf />
            ) : files[index] &&
              files[index].type ===
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ? (
              <ImageDoc />
            ) : null}
          </div>
          <button
            type="button"
            className={styles.uploaderButton}
            data-id={file}
            data-name={files[index] && files[index].name}
            onClick={e => {
              handleRemove()
              onRemove(e)
            }}
          >
            <FaRegTrashAlt />
          </button>

          {files[index] && files[index].name && (
            <>
              <div className={styles.uploaderContent}>{files[index].name}</div>
              <div className="font-normal text-neutral-500">
                ({getFileSize(files[index])})
              </div>
            </>
          )}
        </div>
      )
    })
  }

  return (
    <>
      <div className="flex">
        {uploadedFiles}
        {fileUrls && fileUrls.length < maxFiles && (
          <div className={containerClass}>
            label
            <input
              className={styles.uploaderControl}
              type="file"
              id="file"
              name="file"
              multiple={multiple}
              onChange={onUpload}
              accept={accept}
            />
            <div
              className={styles.uploaderImage}
              onClick={handleChange}
              onDrop={handleOnDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              {loading ? (
                <FaSpinner className="icon-spin" />
              ) : type === 'image' ? (
                <span className={styles.uploaderImageContent}>
                  <ImageAdd />
                  Add Image
                </span>
              ) : (
                <span className={styles.uploaderImageContent}>
                  <ImageFile />
                  Add File
                </span>
              )}
            </div>
          </div>
        )}
      </div>
      <div className={styles.uploaderError}>{error}</div>
    </>
  )
}

Uploader.propTypes = {
  type: PropTypes.string,
  loading: PropTypes.bool,
  error: PropTypes.bool,
  files: PropTypes.array,
  fileUrls: PropTypes.array,
  multiple: PropTypes.bool,
  maxFiles: PropTypes.number,
  accept: PropTypes.string,
  onUpload: PropTypes.func,
  onRemove: PropTypes.func
}

export default Uploader
