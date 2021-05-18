/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { FaSpinner, FaRegTrashAlt } from 'react-icons/fa'

import ImageAdd from '@app/assets/svg/image-add.svg'
import Tooltip from '@app/components/tooltip'

import styles from './image.module.css'

const UploaderImage = ({
  name,
  value,
  loading,
  error,
  images,
  multiple,
  maxImages,
  circle,
  onUploadImage,
  onRemoveImage,
  defaultValue
}) => {
  const [isOver, setIsOver] = useState(false)
  let uploadedImages

  const containerClass = isOver
    ? `${styles.imageUploaderContainer} ${styles.over}`
    : error
    ? `${styles.imageUploaderContainer} ${styles.error}`
    : styles.imageUploaderContainer

  const handleUpload = e => {
    onUploadImage(e)
    e.target.value = ''
  }

  const handleImageChange = () => {
    document.getElementById('image').click()
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
    onUploadImage(e)
  }

  const handleRemoveImage = () => {
    setIsOver(false)
  }

  if (!error && images && images.length > 0) {
    uploadedImages = images.map((image, index) => {
      return (
        <div key={index} className={containerClass}>
          {loading ? (
            <div
              className={`${styles.imageUploaderImage} ${
                circle ? styles.imageUploaderImageCircle : ''
              }`}
            >
              <FaSpinner className="icon-spin" />
            </div>
          ) : (
            <>
              <div
                className={`${styles.imageUploaderImage} ${
                  circle ? styles.imageUploaderImageCircle : ''
                }`}
                style={{ backgroundImage: `url(${!loading && image})` }}
              />
              <Tooltip text="Remove">
                <button
                  type="button"
                  className={styles.imageUploaderButton}
                  data-id={image}
                  onClick={e => {
                    handleRemoveImage()
                    onRemoveImage(e)
                  }}
                >
                  <FaRegTrashAlt />
                </button>
              </Tooltip>
            </>
          )}
        </div>
      )
    })
  }

  return (
    <>
      <div className="flex">
        {uploadedImages}
        {!error && maxImages ? (
          images &&
          images.length < maxImages && (
            <div className={containerClass}>
              <input
                className={styles.imageUploaderControl}
                type="file"
                id="image"
                name={name}
                value={value}
                multiple={multiple}
                onChange={handleUpload}
                accept="image/jpg, image/jpeg, image/png"
              />
              <div
                className={`${styles.imageUploaderImage} ${
                  circle ? styles.imageUploaderImageCircle : ''
                }`}
                onClick={handleImageChange}
                onDrop={handleOnDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                {loading ? (
                  <FaSpinner className="icon-spin" />
                ) : (
                  <span className={styles.imageUploaderImageContent}>
                    <ImageAdd />
                    Add Image
                  </span>
                )}
              </div>
            </div>
          )
        ) : (
          <div className={containerClass}>
            <input
              className={styles.imageUploaderControl}
              type="file"
              id="image"
              name={name}
              value={value}
              defaultValue={defaultValue}
              multiple={multiple}
              onChange={handleUpload}
              accept="image/jpg, image/jpeg, image/png"
            />
            <div
              className={`${styles.imageUploaderImage} ${
                circle ? styles.imageUploaderImageCircle : ''
              }`}
              onClick={handleImageChange}
              onDrop={handleOnDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              {loading ? (
                <FaSpinner className="icon-spin" />
              ) : (
                <span className={styles.imageUploaderImageContent}>
                  <ImageAdd />
                  Add Image
                </span>
              )}
            </div>
          </div>
        )}
      </div>
      <div className={styles.imageUploaderError}>{error}</div>
    </>
  )
}

UploaderImage.propTypes = {
  name: PropTypes.string,
  value: PropTypes.any,
  loading: PropTypes.bool,
  error: PropTypes.string,
  images: PropTypes.array,
  multiple: PropTypes.bool,
  maxImages: PropTypes.number,
  circle: PropTypes.bool,
  onUploadImage: PropTypes.func,
  onRemoveImage: PropTypes.func,
  defaultValue: PropTypes.string
}

export default UploaderImage
