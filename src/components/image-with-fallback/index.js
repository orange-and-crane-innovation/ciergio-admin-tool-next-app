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
        style={{ display: !isValid && !fallback ? 'none' : 'flex' }}
      />
      <div
        className="w-full h-full bg-slate-400"
        style={{
          display: !isValid && !fallback ? 'flex' : 'none',
          backgroundColor: 'rgb(148 163 184)'
        }}
      />
      <img
        src={url || ''}
        alt={altText}
        style={{ display: 'none' }}
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
    </>
  )
}
