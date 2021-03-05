import React from 'react'
import PropTypes from 'prop-types'
import ImageGallery from 'react-image-gallery'
import 'react-image-gallery/styles/css/image-gallery.css'

import styles from './index.module.css'

const SearchComponent = ({ images }) => {
  const renderLeftNav = (onClick, disabled) => {
    return (
      <button
        className="image-gallery-icon image-gallery-left-nav"
        disabled={disabled}
        onClick={onClick}
      >
        <span className="text-6xl">&#10094;</span>
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
        <span className="text-6xl">&#10095;</span>
      </button>
    )
  }

  return (
    <div className={styles.ImageSliderContainer}>
      <ImageGallery
        items={images}
        showThumbnails={false}
        showPlayButton={false}
        showFullscreenButton={false}
        showBullets={true}
        autoPlay={true}
        renderLeftNav={renderLeftNav}
        renderRightNav={renderRightNav}
      />
    </div>
  )
}

SearchComponent.propTypes = {
  images: PropTypes.array.isRequired
}

export default SearchComponent
