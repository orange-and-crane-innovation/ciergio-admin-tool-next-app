import { useMemo } from 'react'
import clsx from 'clsx'
import P from 'prop-types'
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
  leftIcon,
  rightIcon,
  icon,
  className,
  disabled,
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
        [styles.isFluid]: fluid,
        [styles.disabled]: disabled,
        [className]: !!className
      }),
    [primary, success, danger, warning, info, fluid, className, disabled]
  )

  const renderLabel = useMemo(() => {
    return loading ? (
      <FaCircleNotch className="icon-spin" />
    ) : !icon ? (
      label
    ) : null
  }, [label, icon, loading])

  const renderLeftIcon = useMemo(() => {
    return !loading && leftIcon ? (
      <span className="mr-2">{leftIcon}</span>
    ) : null
  }, [leftIcon, loading])

  const renderRightIcon = useMemo(() => {
    return !loading && rightIcon ? (
      <span className="ml-2">{rightIcon}</span>
    ) : null
  }, [loading, rightIcon])

  const renderOnlyIcon = useMemo(() => {
    return !loading ? <span className="m-0 text-base">{icon}</span> : null
  }, [loading, icon])

  return (
    <button type={type} className={buttonClasses} {...props}>
      {renderLeftIcon}
      {renderLabel}
      {renderRightIcon}
      {renderOnlyIcon}
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
  leftIcon: P.node,
  rightIcon: P.node,
  icon: P.node,
  className: P.string,
  disabled: P.bool
}

export default Button
