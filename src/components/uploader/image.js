/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { FaSpinner, FaRegTrashAlt } from 'react-icons/fa'

import ImageAdd from '@app/assets/svg/image-add.svg'
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
  onRemoveImage
}) => {
  const [isOver, setIsOver] = useState(false)
  let uploadedImages

  const containerClass = isOver
    ? `${styles.imageUploaderContainer} ${styles.over}`
    : error
    ? `${styles.imageUploaderContainer} ${styles.error}`
    : styles.imageUploaderContainer

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

  if (images && images.length > 0) {
    uploadedImages = images.map((image, index) => {
      return (
        <div key={index} className={containerClass}>
          <div
            className={`${styles.imageUploaderImage} ${
              circle ? styles.imageUploaderImageCircle : ''
            }`}
            style={{ backgroundImage: `url(${!loading && image})` }}
          />
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
        </div>
      )
    })
  }

  return (
    <>
      <div className="flex">
        {uploadedImages}
        {images && images.length < maxImages && (
          <div className={containerClass}>
            <input
              className={styles.imageUploaderControl}
              type="file"
              id="image"
              name={name}
              value={value}
              multiple={multiple}
              onChange={onUploadImage}
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
  onRemoveImage: PropTypes.func
}

export default UploaderImage
