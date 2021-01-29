import React from 'react'
import PropTypes from 'prop-types'
import toast from 'toasted-notes'
import 'toasted-notes/src/styles.css'

import Toast from '@app/components/toast'

const showToast = (type, message) => {
  return toast.notify(({ onClose }) => (
    <Toast variant={type} onDismiss={onClose}>
      {message}
    </Toast>
  ))
}

showToast.defaultProps = {
  type: 'primary'
}

showToast.propTypes = {
  type: PropTypes.oneOf(['primary', 'success', 'danger', 'info', 'warning']),
  message: PropTypes.string.isRequired
}

export default showToast
