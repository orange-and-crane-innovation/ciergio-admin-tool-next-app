import React from 'react'
import P from 'prop-types'

import {
  FaCheckCircle,
  FaExclamationCircle,
  FaExclamationTriangle,
  FaInfoCircle
} from 'react-icons/fa'

import styles from './Toast.module.css'

function Toast({ variant, children, onDismiss }) {
  let variantStyle, iconStyle

  if (variant) {
    if (variant === 'success') {
      variantStyle = styles.success
      iconStyle = <FaCheckCircle />
    } else if (variant === 'danger') {
      variantStyle = styles.danger
      iconStyle = <FaExclamationCircle />
    } else if (variant === 'warning') {
      variantStyle = styles.warning
      iconStyle = <FaExclamationTriangle />
    } else if (variant === 'info') {
      variantStyle = styles.info
      iconStyle = <FaInfoCircle />
    }
  }

  return (
    <div className={`${styles.toast} ${variantStyle}`}>
      <span className={styles.icon}>{iconStyle}</span>
      <span className={styles.content}>{children}</span>
      <button className={styles.button} onClick={onDismiss}>
        <span>×</span>
      </button>
    </div>
  )
}

Toast.propTypes = {
  variant: P.string,
  children: P.any,
  onDismiss: P.func
}

export default Toast
