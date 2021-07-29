import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import ImageGallery from 'react-image-gallery'
import 'react-image-gallery/styles/css/image-gallery.css'

import LightBox from '@app/components/lightbox'

import styles from './index.module.css'

const ImageSlider = ({ images, onClick }) => {
  const refImg = useRef(null)
  const [imageLists, setImageLists] = useState([])
  const [imageIndex, setImageIndex] = useState(0)
  const [imageOpen, setImageOpen] = useState(false)

  useEffect(() => {
    if (images) {
      setImageLists(images?.map(image => image.original))
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

  const renderLeftNav = (onClick, disabled) => {
    return (
      <button
        className="image-gallery-icon image-gallery-left-nav"
        disabled={disabled}
        onClick={onClick}
      >
        <span className="text-3xl md:text-6xl">&#10094;</span>
      </button>
    )
  }

  const renderRightNav = (onClick, disabled) => {
    return (
      <button
        className="image-gallery-icon image-gallery-right-nav"
        disabled={disabled}
        onClick={onClick}
      >
        <span className="text-3xl md:text-6xl">&#10095;</span>
      </button>
    )
  }

  return (
    <div className={styles.ImageSliderContainer}>
      <ImageGallery
        ref={refImg}
        items={images}
        showThumbnails={false}
        showPlayButton={false}
        showFullscreenButton={false}
        showBullets={images?.length > 1}
        autoPlay={true}
        renderLeftNav={renderLeftNav}
        renderRightNav={renderRightNav}
        onClick={() => handleImageOpen(refImg.current.getCurrentIndex())}
      />
      <LightBox
        isOpen={imageOpen}
        images={imageLists}
        imageIndex={imageIndex}
        onClick={handleImageIndex}
        onClose={handleImageClose}
      />
    </div>
  )
}

ImageSlider.propTypes = {
  images: PropTypes.array.isRequired,
  onClick: PropTypes.func
}

export default ImageSlider
