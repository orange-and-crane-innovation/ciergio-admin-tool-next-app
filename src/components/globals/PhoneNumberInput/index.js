import { useMemo } from 'react'
import clsx from 'clsx'
import PhoneInput from 'react-phone-number-input/input'
import P from 'prop-types'
import 'react-phone-number-input/style.css'
import styles from './PhoneNumberInput.module.css'

function PhoneNumberInput({
  onFocus,
  onBlur,
  onPhoneChange,
  name,
  value,
  placeholder,
  label,
  labelClassName,
  error
}) {
  const containerClasses = useMemo(
    () =>
      clsx(styles.phoneNumberContainer, {
        [styles.hasError]: !!error
      }),
    [error]
  )

  return (
    <div className={containerClasses}>
      {label ? (
        <label className={labelClassName} htmlFor={name}>
          {label}
        </label>
      ) : null}
      <PhoneInput
        name={name}
        country="PH"
        placeholder={placeholder}
        value={value}
        onFocus={onFocus}
        onBlur={onBlur}
        onChange={onPhoneChange}
        className={`${styles.phoneInput} ${error ? 'hasError' : ''}`}
        autoComplete="off"
      />
      {error ? (
        <span className="text-danger-500 text-sm font-normal block mt-1">
          {error}
        </span>
      ) : null}
    </div>
  )
}

PhoneNumberInput.defaultProps = {
  placeholder: 'Enter phone number',
  onFocus: () => {},
  onBlur: () => {}
}

PhoneNumberInput.propTypes = {
  onPhoneChange: P.func.isRequired,
  name: P.string.isRequired,
  value: P.string.isRequired,
  onFocus: P.func,
  onBlur: P.func,
  placeholder: P.string,
  label: P.string,
  labelClassName: P.string,
  error: P.string
}

export default PhoneNumberInput
