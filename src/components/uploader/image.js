/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { FaSpinner, FaRegTrashAlt } from 'react-icons/fa'

import ImageAdd from '@app/assets/svg/image-add.svg'
import styles from './image.module.css'

const UploaderImage = ({
  loading,
  imageUrls,
  multiple,
  maxImages,
  onUploadImage,
  onRemoveImage
}) => {
  const [isOver, setIsOver] = useState(false)
  let uploadedImages

  const containerClass = isOver
    ? `${styles.imageUploaderContainer} ${styles.over}`
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

  if (imageUrls && imageUrls.length > 0) {
    uploadedImages = imageUrls.map((imageUrl, index) => {
      return (
        <div key={index} className={containerClass}>
          <div
            className={styles.imageUploaderImage}
            style={{ backgroundImage: `url(${!loading && imageUrl})` }}
          />
          <button
            type="button"
            className={styles.imageUploaderButton}
            data-id={imageUrl}
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
    <div className="flex">
      {uploadedImages}
      {imageUrls && imageUrls.length < maxImages && (
        <div className={containerClass}>
          <input
            className={styles.imageUploaderControl}
            type="file"
            id="image"
            name="image"
            multiple={multiple}
            onChange={onUploadImage}
            accept="image/jpg, image/jpeg, image/png"
          />
          <div
            className={styles.imageUploaderImage}
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
  )
}

UploaderImage.propTypes = {
  loading: PropTypes.bool,
  imageUrls: PropTypes.array,
  multiple: PropTypes.bool,
  maxImages: PropTypes.number,
  onUploadImage: PropTypes.func,
  onRemoveImage: PropTypes.func
}

export default UploaderImage
