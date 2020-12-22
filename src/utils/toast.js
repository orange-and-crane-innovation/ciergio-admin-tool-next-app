import React from 'react'
import toast from 'toasted-notes'
import 'toasted-notes/src/styles.css'

import Toast from '@app/components/toast'

const showToast = (variant, message) => {
  return toast.notify(({ onClose }) => (
    <Toast variant={variant} onDismiss={onClose}>
      {message}
    </Toast>
  ))
}

export default showToast
