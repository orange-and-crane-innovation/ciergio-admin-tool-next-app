/* eslint-disable jsx-a11y/media-has-caption */
import React, { useRef, useState, useEffect } from 'react'
import P from 'prop-types'
import Notification from 'react-web-notification'

import { IMAGES } from '@app/constants'

const DesktopNotification = ({ title, message, onCloseNotification }) => {
  const notifSound = useRef(null)
  const [notificationTitle, setNotificationTitle] = useState('')
  const [isNotifIgnored, setIsNotifIgnored] = useState(true)
  const [notifOptions, setIsNotifOptions] = useState()

  useEffect(() => {
    if (title) {
      showNotification(title, message)
    }
  }, [title, message])

  const handlePermissionGranted = () => {
    console.log('Permission Granted')
    setIsNotifIgnored(false)
  }

  const handlePermissionDenied = () => {
    console.log('Permission Denied')
    setIsNotifIgnored(true)
  }

  const handleNotSupported = () => {
    console.log('Web Notification not Supported')
    setIsNotifIgnored(true)
  }

  const handleNotificationOnClick = () => {
    console.log('Notification clicked')
  }

  const handleNotificationOnError = () => {
    console.log('Notification error')
  }

  const handleNotificationOnShow = () => {
    console.log('Notification shown')
    notifSound.current.muted = false
    notifSound.current.play()
  }

  const handleNotificationOnClose = () => {
    console.log('Notification closed')
    onCloseNotification()
    notifSound.current.load()
  }

  const showNotification = (title, msg) => {
    if (isNotifIgnored) {
      return
    }

    const options = {
      tag: Date.now(),
      body: msg,
      icon: IMAGES.DEFAULT_FAV_ICON,
      lang: 'en',
      dir: 'ltr'
    }
    setNotificationTitle(title)
    setIsNotifOptions(options)
  }

  return (
    <div>
      <Notification
        ignore={isNotifIgnored && notificationTitle !== ''}
        notSupported={handleNotSupported}
        onPermissionGranted={handlePermissionGranted}
        onPermissionDenied={handlePermissionDenied}
        onShow={handleNotificationOnShow}
        onClick={handleNotificationOnClick}
        onClose={handleNotificationOnClose}
        onError={handleNotificationOnError}
        timeout={5000}
        title={notificationTitle}
        options={notifOptions}
      />
      <audio id="sound" preload="auto" ref={notifSound} muted="muted">
        <source
          src="https://s3-ap-southeast-1.amazonaws.com/ciergio-online.assets/web-assets/sounds/quite-impressed.mp3"
          type="audio/mpeg"
        />
        <source
          src="https://s3-ap-southeast-1.amazonaws.com/ciergio-online.assets/web-assets/sounds/quite-impressed.ogg"
          type="audio/ogg"
        />
      </audio>
    </div>
  )
}

DesktopNotification.propTypes = {
  title: P.string,
  message: P.string,
  onCloseNotification: P.func
}

export default DesktopNotification
