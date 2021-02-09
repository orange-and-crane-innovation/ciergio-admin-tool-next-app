/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useMemo } from 'react'
import clsx from 'clsx'
import P from 'prop-types'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa'

import styles from './FormInput.module.css'

function FormInput({
  type,
  name,
  id,
  label,
  value,
  error,
  disabled,
  placeholder,
  maxLength,
  onChange,
  containerClassName,
  labelClassName,
  inputClassName,
  errorClassName,
  description,
  inputProps,
  icon,
  iconOnClick
}) {
  const [showPassword, setShowPassword] = useState(false)

  const containerClasses = useMemo(
    () =>
      clsx(styles.FormInput, containerClassName, {
        [styles.hasError]: !!error
      }),
    [containerClassName, error]
  )
  const labelClasses = useMemo(() => clsx(styles.formLabel, labelClassName), [
    labelClassName
  ])
  const inputClasses = useMemo(() => clsx(styles.FormControl, inputClassName), [
    inputClassName
  ])
  const errorClasses = useMemo(() => clsx(styles.FormError, errorClassName), [
    errorClassName
  ])

  const togglePassword = () => {
    setShowPassword(!showPassword)
  }

  const renderLabel = useMemo(() => {
    return label ? <span className={labelClasses}>{label}</span> : null
  }, [label, labelClasses])

  const renderInput = useMemo(() => {
    return (
      <div className="relative">
        <input
          id={id}
          name={name}
          type={
            type === 'password' ? (showPassword ? 'text' : 'password') : type
          }
          className={inputClasses}
          placeholder={placeholder}
          value={value}
          maxLength={maxLength}
          onChange={onChange}
          {...inputProps}
        />
        {type !== 'password' && icon && (
          <button
            type="button"
            className={styles.FormInputButton}
            onClick={iconOnClick}
            disabled={disabled}
          >
            {icon}
          </button>
        )}
        {type === 'password' && (
          <button
            type="button"
            className={styles.FormInputButton}
            onClick={() => {
              togglePassword()
            }}
            disabled={disabled}
          >
            {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
          </button>
        )}
      </div>
    )
  }, [
    id,
    name,
    type,
    inputClasses,
    placeholder,
    value,
    disabled,
    maxLength,
    onChange,
    inputProps,
    icon,
    iconOnClick,
    showPassword
  ])

  const renderError = useMemo(() => {
    return error ? <span className={errorClasses}>{error}</span> : null
  }, [error, errorClasses])

  return (
    <div className={containerClasses}>
      <div className={styles.FormInputContainer}>
        <label htmlFor={id || name}>
          {renderLabel}
          {description || null}
          {renderInput}
          {renderError}
        </label>
      </div>
    </div>
  )
}

FormInput.defaultProps = {
  type: 'text',
  containerClassName: '',
  labelClassName: ''
}

FormInput.propTypes = {
  type: P.oneOf(['text', 'password', 'email']),
  name: P.string.isRequired,
  id: P.string,
  label: P.string,
  value: P.any,
  disabled: P.bool,
  placeholder: P.string,
  maxLength: P.number,
  error: P.string,
  onChange: P.func.isRequired,
  containerClassName: P.string,
  labelClassName: P.string,
  inputClassName: P.string,
  errorClassName: P.string,
  inputProps: P.object,
  description: P.node || P.string,
  icon: P.any,
  iconOnClick: P.func
}

export default FormInput
