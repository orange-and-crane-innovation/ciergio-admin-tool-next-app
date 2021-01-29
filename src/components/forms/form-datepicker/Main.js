import React, { useMemo } from 'react'
import clsx from 'clsx'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import P from 'prop-types'
import styles from './Main.module.css'
import { FaCalendarAlt } from 'react-icons/fa'

const FormDatePicker = ({
  id,
  date,
  onChange,
  format,
  disabled,
  placeHolder,
  disabledPreviousDate,
  error,
  rightIcon,
  label,
  containerClassname,
  calendarClassname,
  inputClassname,
  errorClassname,
  labelClassname,
  showMonthYearPicker,
  datepickerprops
}) => {
  const containerClasses = useMemo(
    () =>
      clsx(styles.FormDatePicker, containerClassname, {
        [styles.hasError]: !!error
      }),
    [containerClassname, error]
  )

  const calendarClasses = useMemo(
    () => clsx(styles.customCalender, calendarClassname),
    [calendarClassname]
  )

  const errorClasses = useMemo(() => clsx(styles.formError, errorClassname), [
    errorClassname
  ])

  const labelClasses = useMemo(() => clsx(styles.formLabel, labelClassname), [
    labelClassname
  ])

  const inputClasses = useMemo(
    () => clsx(styles.inputClass, styles.formControl, inputClassname),
    [inputClassname]
  )

  const renderLabel = useMemo(
    () =>
      label ? (
        <span className={clsx(styles.labelClass, labelClasses)}>{label}</span>
      ) : null,
    [label, labelClasses]
  )

  const renderDatePicker = useMemo(() => {
    return (
      <div className={styles.DatepickerHandler}>
        <DatePicker
          id={id}
          selected={date}
          placeholderText={placeHolder}
          onChange={onChange}
          dateFormat={showMonthYearPicker ? 'MMMM yyyy' : format}
          disabled={disabled}
          showMonthYearPicker={showMonthYearPicker}
          calendarClassName={calendarClasses}
          className={inputClasses}
          minDate={disabledPreviousDate}
          {...datepickerprops}
        />
        {rightIcon && <FaCalendarAlt />}
      </div>
    )
  }, [
    id,
    date,
    inputClasses,
    onChange,
    placeHolder,
    showMonthYearPicker,
    format,
    disabled,
    calendarClasses,
    disabledPreviousDate,
    datepickerprops,
    rightIcon
  ])

  const renderError = useMemo(
    () => (error ? <span className={errorClasses}>{error}</span> : null),
    [error, errorClasses]
  )

  return (
    <div className={containerClasses}>
      {renderLabel}
      {renderDatePicker}
      {renderError}
    </div>
  )
}

FormDatePicker.propTypes = {
  id: P.string,
  onChange: P.func.isRequired,
  format: P.string,
  disabled: P.bool,
  placeHolder: P.string,
  error: P.string,
  label: P.string,
  containerClassname: P.string,
  calendarClassname: P.string,
  inputClassname: P.string,
  errorClassname: P.string,
  labelClassname: P.string,
  showMonthYearPicker: P.bool,
  disabledPreviousDate: P.oneOfType([P.func, P.date]),
  datepickerprops: P.object,
  date: P.oneOfType([P.func, P.date]),
  rightIcon: P.bool
}

FormDatePicker.defaultProps = {
  format: 'MMM dd, yyyy',
  placeHolder: 'Select Date'
}

export default FormDatePicker
