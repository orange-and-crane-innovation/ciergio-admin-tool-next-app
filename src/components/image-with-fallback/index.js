import React, { useState } from 'react'
import Props from 'prop-types'

ImageWithValidationFallback.propTypes = {
  url: Props.any.isRequired,
  fallback: Props.string,
  altText: Props.string,
  classNames: Props.string
}

export default function ImageWithValidationFallback({
  url,
  fallback,
  altText,
  classNames
}) {
  const [isValid, setIsValid] = useState(false)

  function handleImageLoad() {
    setIsValid(true)
  }

  function handleImageError() {
    setIsValid(false)
  }

  return (
    <>
      <img
        src={isValid ? url : fallback}
        alt={altText}
        className={classNames}
      />
      <img
        src={url}
        alt={altText}
        style={{ display: 'none' }}
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
    </>
  )
}
