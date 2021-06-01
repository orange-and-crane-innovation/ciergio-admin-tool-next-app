import PropTypes from 'prop-types'
import Lightbox from 'react-image-lightbox'

import 'react-image-lightbox/style.css'

const LightBox = ({ images, imageIndex, onClick, onClose, isOpen }) => {
  const handleCloseRequest = () => {
    onClose()
  }

  const handlePrevRequest = () => {
    onClick((imageIndex + images.length - 1) % images.length)
  }

  const handleNextRequest = () => {
    onClick((imageIndex + 1) % images.length)
  }

  if (isOpen) {
    return (
      <Lightbox
        mainSrc={images[imageIndex]}
        nextSrc={images[(imageIndex + 1) % images.length]}
        prevSrc={images[(imageIndex + images.length - 1) % images.length]}
        onCloseRequest={handleCloseRequest}
        onMovePrevRequest={handlePrevRequest}
        onMoveNextRequest={handleNextRequest}
      />
    )
  }

  return null
}

LightBox.propTypes = {
  images: PropTypes.array.isRequired,
  imageIndex: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired
}

export default LightBox
