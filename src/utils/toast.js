import React from 'react'
import PropTypes from 'prop-types'
import toast from 'toasted-notes'
import 'toasted-notes/src/styles.css'

import Toast from '@app/components/toast'

const showToast = (type, message, position, icon, duration) => {
  return toast.notify(
    ({ onClose }) => (
      <Toast
        variant={type}
        icon={icon}
        hasCloseButton={duration === undefined}
        onDismiss={onClose}
      >
        {message}
      </Toast>
    ),
    {
      position: position,
      duration: duration
    }
  )
}

showToast.defaultProps = {
  type: 'primary',
  position: 'top',
  duration: 2000
}

showToast.propTypes = {
  type: PropTypes.oneOf(['primary', 'success', 'danger', 'info', 'warning']),
  message: PropTypes.string.isRequired,
  position: PropTypes.oneOf([
    'top-left',
    'top',
    'top-right',
    'bottom-left',
    'bottom',
    'bottom-right'
  ]),
  duration: PropTypes.number,
  icon: PropTypes.any
}

export default showToast
