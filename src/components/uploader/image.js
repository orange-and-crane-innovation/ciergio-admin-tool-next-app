/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Resizer from 'react-image-file-resizer'
import { FaSpinner, FaRegTrashAlt } from 'react-icons/fa'

import ImageAdd from '@app/assets/svg/image-add.svg'
import Tooltip from '@app/components/tooltip'
import LightBox from '@app/components/lightbox'

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
  const [imageLists, setImageLists] = useState([])
  const [imageIndex, setImageIndex] = useState(0)
  const [imageOpen, setImageOpen] = useState(false)
  let uploadedImages

  const resizeFile = file =>
    new Promise(resolve => {
      const fileType = file?.type === 'image/png' ? 'PNG' : 'JPEG'

      Resizer.imageFileResizer(
        file,
        1440,
        1440,
        fileType,
        100,
        0,
        uri => {
          resolve(uri)
        },
        'blob'
      )
    })

  const containerClass = isOver
    ? `${styles.imageUploaderContainer} ${styles.over}`
    : error
    ? `${styles.imageUploaderContainer} ${styles.error}`
    : styles.imageUploaderContainer

  useEffect(() => {
    if (images) {
      setImageLists(images)
    }
  }, [images])

  const handleImageOpen = index => {
    setImageOpen(true)
    handleImageIndex(index)
  }

  const handleImageClose = () => {
    setImageOpen(false)
  }

  const handleImageIndex = index => {
    setImageIndex(index)
  }

  const handleUpload = async e => {
    const fileList = []
    try {
      const files = e.target.files
      for (const file of files) {
        const image = await resizeFile(file)
        fileList.push(image)
      }
      onUploadImage({ target: { files: fileList } })
    } catch (err) {
      console.log(err)
    }

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
                onClick={() => handleImageOpen(index)}
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
      <LightBox
        isOpen={imageOpen}
        images={imageLists}
        imageIndex={imageIndex}
        onClick={handleImageIndex}
        onClose={handleImageClose}
      />
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
