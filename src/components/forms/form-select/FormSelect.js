/* eslint-disable jsx-a11y/no-onchange */
import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { FaTimes } from 'react-icons/fa'

import styles from './FormSelect.module.css'

const InputSelect = ({
  id,
  name,
  value,
  options,
  onChange,
  onClear,
  disabled,
  noCloseIcon,
  className
}) => {
  const inputClasses = useMemo(
    () =>
      clsx(styles.FormSelect, {
        [styles.disabled]: disabled,
        [className]: !!className
      }),
    [disabled, className]
  )

  return (
    <div className={styles.FormSelectContainer}>
      <select
        className={inputClasses}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
      >
        {options.map((item, index) => {
          return (
            <option key={index} value={item.value}>
              {item.label}
            </option>
          )
        })}
      </select>
      {!noCloseIcon && (
        <span className={styles.FormSelectIcon}>
          {value && <FaTimes className="cursor-pointer" onClick={onClear} />}
        </span>
      )}
    </div>
  )
}

InputSelect.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.any,
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func,
  onClear: PropTypes.func,
  disabled: PropTypes.bool,
  noCloseIcon: PropTypes.bool,
  className: PropTypes.string
}

export default InputSelect
