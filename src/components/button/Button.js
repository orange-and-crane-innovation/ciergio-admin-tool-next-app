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
  className,
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
        [className]: !!className
      }),
    [primary, success, danger, warning, info, fluid, className]
  )

  const renderLabel = useMemo(() => {
    return loading ? <FaCircleNotch className="icon-spin" /> : label
  }, [label, loading])

  const renderLeftIcon = useMemo(() => {
    return <span className="mr-2">{leftIcon}</span>
  }, [leftIcon])

  const renderRightIcon = useMemo(() => {
    return <span className="ml-2">{rightIcon}</span>
  }, [rightIcon])

  return (
    <button type={type} className={buttonClasses} {...props}>
      {renderLeftIcon}
      {renderLabel}
      {renderRightIcon}
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
  leftIcon: P.any,
  rightIcon: P.any,
  className: P.string
}

export default Button
