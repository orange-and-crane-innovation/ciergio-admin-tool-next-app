import React, { useMemo } from 'react'
import clsx from 'clsx'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import P from 'prop-types'
import styles from './Main.module.css'

const FormDatePicker = ({
  id,
  date,
  onChange,
  format,
  disabled,
  placeHolder,
  minDate,
  error,
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
    () => (label ? <span className={labelClasses}>{label}</span> : null),
    [label, labelClasses]
  )

  const renderDatePicker = useMemo(() => {
    return (
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
        minDate={minDate}
        {...datepickerprops}
      />
    )
  }, [
    date,
    inputClasses,
    onChange,
    placeHolder,
    showMonthYearPicker,
    datepickerprops,
    format,
    disabled,
    minDate
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
  date: P.date,
  onChange: P.func.isRequired,
  format: P.array,
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
  datepickerprops: P.object,
  minDate: P.date
}

FormDatePicker.defaultProps = {
  format: 'MMM dd, yyyy',
  placeHolder: 'Select Date',
  containerClassname: '',
  labelClassname: '',
  minDate: new Date()
}

export default FormDatePicker
