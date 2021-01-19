import clsx from 'clsx'
import P from 'prop-types'
import { useMemo } from 'react'

import styles from './FormInput.module.css'

function FormInput({
  type,
  name,
  id,
  label,
  value,
  error,
  placeholder,
  maxLength,
  onChange,
  containerClassName,
  labelClassName,
  inputClassName,
  errorClassName,
  inputProps
}) {
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
  const inputClasses = useMemo(() => clsx(styles.formControl, inputClassName), [
    inputClassName
  ])
  const errorClasses = useMemo(() => clsx(styles.formError, errorClassName), [
    errorClassName
  ])

  const renderLabel = useMemo(() => {
    return label ? <span className={labelClasses}>{label}</span> : null
  }, [label, labelClasses])

  const renderInput = useMemo(() => {
    return (
      <input
        id={id}
        name={name}
        type={type}
        className={inputClasses}
        placeholder={placeholder}
        value={value}
        maxLength={maxLength}
        onChange={onChange}
        {...inputProps}
      />
    )
  }, [
    id,
    name,
    type,
    inputClasses,
    placeholder,
    value,
    maxLength,
    onChange,
    inputProps
  ])

  const renderError = useMemo(() => {
    return error ? <span className={errorClasses}>{error}</span> : null
  }, [error, errorClasses])

  return (
    <div className={containerClasses}>
      <label htmlFor={id || name}>
        {renderLabel}
        {renderInput}
        {renderError}
      </label>
    </div>
  )
}

FormInput.defaultProps = {
  type: 'text',
  containerClassName: '',
  labelClassName: ''
}

FormInput.propTypes = {
  type: P.oneOf(['text', 'password']),
  name: P.string.isRequired,
  id: P.string,
  label: P.string,
  value: P.any,
  placeholder: P.string,
  maxLength: P.number,
  error: P.string,
  onChange: P.func.isRequired,
  containerClassName: P.string,
  labelClassName: P.string,
  inputClassName: P.string,
  errorClassName: P.string,
  inputProps: P.object
}

export default FormInput
