import Datetime from 'react-datetime'
import P from 'prop-types'

import FormInput from '@app/components/forms/form-input'
import {
  friendlyDateTimeFormat,
  toFriendlyDateTime,
  toFriendlyTime
} from '@app/utils/date'

import { FiClock } from 'react-icons/fi'

import 'react-datetime/css/react-datetime.css'

function DateInput({ date, onDateChange, dateFormat, name, label, disabled }) {
  let dateValue = toFriendlyDateTime(date)

  if (dateFormat) {
    dateValue = friendlyDateTimeFormat(date, dateFormat)
  }

  return (
    <Datetime
      renderInput={(props, openCalendar) => (
        <>
          <div className="font-semibold">{label}</div>
          <div className="relative">
            <FormInput {...props} name={name} value={dateValue} readOnly />
            <span
              className="ciergio-calendar absolute top-3 right-4 cursor-pointer"
              onClick={openCalendar}
              role="button"
              tabIndex={0}
              onKeyDown={() => {}}
            />
          </div>
        </>
      )}
      dateFormat={dateFormat}
      timeFormat={false}
      value={date}
      onChange={onDateChange}
      disabled={disabled}
    />
  )
}

function TimeInput({ time, timeFormat, onTimeChange, label, name, disabled }) {
  let timeValue = toFriendlyTime(time)

  if (timeFormat) {
    timeValue = friendlyDateTimeFormat(time, timeFormat)
  }

  return (
    <Datetime
      renderInput={(props, openCalendar) => (
        <>
          <div className="font-semibold">{label}</div>
          <div className="relative">
            <FormInput {...props} name={name} value={timeValue} readOnly />
            <FiClock
              className="ciergio-calendar absolute top-3 right-4 cursor-pointer"
              onClick={openCalendar}
            />
          </div>
        </>
      )}
      dateFormat={false}
      timeFormat={timeFormat}
      value={time}
      onChange={onTimeChange}
      disabled={disabled}
    />
  )
}

DateInput.defaultProps = {
  name: 'date',
  label: 'Date:'
}

DateInput.propTypes = {
  date: P.instanceOf(Date).isRequired,
  onDateChange: P.func,
  dateFormat: P.string,
  name: P.string,
  label: P.string,
  disabled: P.bool
}

TimeInput.defaultProps = {
  name: 'time',
  label: 'Time:'
}

TimeInput.propTypes = {
  time: P.instanceOf(Date).isRequired,
  onTimeChange: P.func,
  timeFormat: P.string,
  name: P.string,
  label: P.string,
  disabled: P.bool
}

export { DateInput, TimeInput }
