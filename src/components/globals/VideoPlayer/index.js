import React from 'react'
import PropTypes from 'prop-types'
import ReactPlayer from 'react-player'

import styles from './index.module.css'

const VideoPlayerComponent = ({ url, onError, onReady }) => {
  return (
    <div className={styles.CreatePostVideoContainer}>
      <ReactPlayer
        controls
        width="100%"
        height="100%"
        className={styles.CreatePostVideoPlayer}
        url={url}
        onError={onError}
        onReady={onReady}
      />
    </div>
  )
}

VideoPlayerComponent.propTypes = {
  url: PropTypes.string,
  onError: PropTypes.func,
  onReady: PropTypes.func
}

export default VideoPlayerComponent
