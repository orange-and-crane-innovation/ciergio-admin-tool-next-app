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
  neutral,
  link,
  loading,
  leftIcon,
  rightIcon,
  icon,
  className,
  disabled,
  noBorder,
  noBottomMargin,
  iconOnly,
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
        [styles.isNeutral]: neutral,
        [styles.isLink]: link,
        [styles.isFluid]: fluid,
        [styles.disabled]: disabled,
        [styles.noBorder]: noBorder,
        [styles.noBottomMargin]: noBottomMargin,
        [styles.iconOnly]: !!iconOnly,
        [className]: !!className
      }),
    [
      primary,
      success,
      danger,
      warning,
      info,
      fluid,
      link,
      className,
      disabled,
      noBorder,
      iconOnly
    ]
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
      <span className={label ? 'mr-2' : ''}>{leftIcon}</span>
    ) : null
  }, [leftIcon, loading])

  const renderRightIcon = useMemo(() => {
    return !loading && rightIcon ? (
      <span className={label ? 'ml-2' : ''}>{rightIcon}</span>
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
  type: 'button'
}

Button.propTypes = {
  type: P.oneOf(['button', 'submit']),
  label: P.oneOfType([P.string, P.node]),
  fluid: P.bool,
  primary: P.bool,
  success: P.bool,
  danger: P.bool,
  warning: P.bool,
  info: P.bool,
  neutral: P.bool,
  link: P.bool,
  loading: P.bool,
  leftIcon: P.node,
  rightIcon: P.node,
  icon: P.node,
  className: P.string,
  disabled: P.bool,
  noBorder: P.bool,
  noBottomMargin: P.bool,
  iconOnly: P.bool
}

export default Button
