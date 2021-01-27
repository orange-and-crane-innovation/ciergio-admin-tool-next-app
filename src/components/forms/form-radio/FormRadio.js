import { useMemo } from 'react'
import P from 'prop-types'
import clsx from 'clsx'

import styles from './FormRadio.module.css'

function FormRadio({
  id,
  name,
  label,
  primary,
  success,
  danger,
  warning,
  info,
  isChecked,
  isDisabled,
  onChange,
  className,
  ...rest
}) {
  const checkboxClasses = useMemo(
    () =>
      clsx(styles.FormCheckbox, {
        [styles.isPrimary]: primary,
        [styles.isSuccess]: success,
        [styles.isDanger]: danger,
        [styles.isWarning]: warning,
        [styles.isInfo]: info,
        [styles.disabled]: isDisabled,
        [className]: !!className
      }),
    [primary, success, danger, warning, info, isDisabled, className]
  )

  return (
    <div className={styles.FormCheckboxContainer}>
      <input
        type="radio"
        className={checkboxClasses}
        id={id}
        name={name}
        defaultChecked={isChecked}
        disabled={isDisabled}
        onChange={onChange}
        {...rest}
      />
      {label && (
        <label htmlFor={id} className="ml-2 cursor-pointer" onClick={onChange}>
          {label}
        </label>
      )}
    </div>
  )
}

FormRadio.propTypes = {
  id: P.string.isRequired,
  name: P.string.isRequired,
  label: P.string,
  primary: P.bool,
  success: P.bool,
  danger: P.bool,
  warning: P.bool,
  info: P.bool,
  isChecked: P.bool,
  isDisabled: P.bool,
  onChange: P.func.isRequired,
  className: P.string
}

export default FormRadio
