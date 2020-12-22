import clsx from 'clsx'
import P from 'prop-types'
import { useMemo } from 'react'
import { FaCircleNotch } from 'react-icons/fa'

import styles from './Button.module.css'

function Button({
  type,
  label,
  fluid,
  primary,
  success,
  danger,
  warning,
  info,
  loading,
  classNames,
  ...props
}) {
  const buttonClasses = useMemo(
    () =>
      clsx(styles.Button, {
        [styles.isPrimary]: primary,
        [styles.isSuccess]: success,
        [styles.isDanger]: danger,
        [styles.isWarning]: warning,
        [styles.isInfo]: info,
        [styles.isFluid]: fluid
      }),
    [fluid, primary, success, danger, warning, info]
  )

  const renderLabel = useMemo(() => {
    return loading ? <FaCircleNotch className="icon-spin" /> : label
  }, [label, loading])

  return (
    <button
      type={type}
      className={`${styles.Button} ${buttonClasses} ${classNames}`}
      {...props}
    >
      {renderLabel}
    </button>
  )
}

Button.defaultProps = {
  type: 'button',
  label: 'Button'
}

Button.propTypes = {
  type: P.oneOf(['button', 'submit']),
  label: P.string,
  fluid: P.bool,
  primary: P.bool,
  success: P.bool,
  danger: P.bool,
  warning: P.bool,
  info: P.bool,
  loading: P.bool,
  classNames: P.string
}

export default Button
