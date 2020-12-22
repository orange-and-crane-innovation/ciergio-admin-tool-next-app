import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { FaSpinner, FaRegTrashAlt } from 'react-icons/fa'

import ImageAdd from '@app/assets/svg/image-add.svg'
import styles from './image.module.css'

const UploaderImage = ({ loading, imageUrl, onUploadImage, onRemoveImage }) => {
  const [isOver, setIsOver] = useState(false)

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

  return (
    <div className={containerClass}>
      <input
        className={styles.imageUploaderControl}
        type="file"
        id="image"
        name="image"
        onChange={onUploadImage}
        accept="image/jpg, image/jpeg, image/png"
      />
      <div
        className={styles.imageUploaderImage}
        style={{ backgroundImage: `url(${!loading && imageUrl})` }}
        onClick={handleImageChange}
        onDrop={handleOnDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {loading ? (
          <FaSpinner className="icon-spin" />
        ) : (
          !imageUrl && (
            <span className={styles.imageUploaderImageContent}>
              <ImageAdd />
              Add Image
            </span>
          )
        )}
      </div>
      {!loading && imageUrl && (
        <button
          type="button"
          className={styles.imageUploaderButton}
          onClick={() => {
            handleRemoveImage()
            onRemoveImage()
          }}
        >
          <FaRegTrashAlt />
        </button>
      )}
    </div>
  )
}

UploaderImage.propTypes = {
  loading: PropTypes.bool,
  imageUrl: PropTypes.string,
  onUploadImage: PropTypes.func,
  onRemoveImage: PropTypes.func
}

export default UploaderImage
