import Datetime from 'react-datetime'
import P from 'prop-types'
import dayjs from 'dayjs'
import moment from 'moment'

import FormInput from '@app/components/forms/form-input'
import {
  friendlyDateTimeFormat,
  toFriendlyDateTime,
  toFriendlyTime
} from '@app/utils/date'

import { FiClock } from 'react-icons/fi'

import 'react-datetime/css/react-datetime.css'

function DateInput({
  date,
  onDateChange,
  dateFormat,
  name,
  label,
  disabled,
  constraints,
  maxDate,
  minDate,
  error
}) {
  let dateValue = toFriendlyDateTime(date)

  if (dateFormat) {
    dateValue = friendlyDateTimeFormat(date, dateFormat)
  }

  const yesterday = moment().subtract(1, 'day')
  const valid = current => {
    return current.isAfter(yesterday)
  }

  const validation = currentDate => {
    if (currentDate && (maxDate || minDate)) {
      if (maxDate) return currentDate.isBefore(dayjs(maxDate))
      if (minDate) return currentDate.isSameOrAfter(dayjs(minDate))
    }
    return true
  }

  return (
    <Datetime
      renderInput={(props, openCalendar) => (
        <>
          <div className="font-semibold">{label}</div>
          <div className="relative">
            <FormInput
              {...props}
              inputProps={{
                style: {
                  backgroundColor: !disabled ? 'white' : '#EAEBF2',
                  cursor: 'pointer'
                }
              }}
              type="text"
              name={name}
              value={dateValue}
              disabled={disabled}
              readOnly
              icon={<i className="ciergio-calendar absolute right-1" />}
              iconOnClick={openCalendar}
            />
            {error && (
              <span className="mt-2 text-md text-danger-500 font-bold">
                {error}
              </span>
            )}
          </div>
        </>
      )}
      isValidDate={(constraints && valid) || validation}
      dateFormat={dateFormat}
      timeFormat={false}
      value={date}
      onChange={onDateChange}
      disabled={disabled}
      closeOnSelect
    />
  )
}

function TimeInput({
  time,
  timeFormat,
  onTimeChange,
  label,
  name,
  disabled,
  maxDate,
  minDate,
  error
}) {
  let timeValue = toFriendlyTime(time)

  if (timeFormat) {
    timeValue = friendlyDateTimeFormat(time, timeFormat)
  }

  const validation = currentDate => {
    if (currentDate && (maxDate || minDate)) {
      if (maxDate) return currentDate.isBefore(dayjs(maxDate))
      if (minDate) return currentDate.isSameOrAfter(dayjs(minDate))
    }
    return true
  }

  return (
    <Datetime
      renderInput={(props, openCalendar) => (
        <>
          <div className="font-semibold">{label}</div>
          <div className="relative">
            <FormInput
              {...props}
              inputProps={{
                style: {
                  backgroundColor: !disabled ? 'white' : '#EAEBF2',
                  cursor: 'pointer'
                }
              }}
              type="text"
              name={name}
              value={timeValue}
              disabled={disabled}
              readOnly
              icon={<FiClock />}
              iconOnClick={openCalendar}
            />
            {error && (
              <div className="-mt-4 text-md text-danger-500 font-bold">
                {error}
              </div>
            )}
          </div>
        </>
      )}
      dateFormat={false}
      timeFormat={timeFormat}
      value={time}
      onChange={onTimeChange}
      disabled={disabled}
      isValidDate={validation}
    />
  )
}

DateInput.defaultProps = {
  name: 'date',
  label: 'Date:'
}

DateInput.propTypes = {
  date: P.oneOfType([P.instanceOf(Date), P.instanceOf(moment)]).isRequired,
  onDateChange: P.func,
  dateFormat: P.string,
  name: P.string,
  label: P.string,
  disabled: P.bool,
  maxDate: P.oneOfType([P.instanceOf(Date), P.instanceOf(moment)]),
  minDate: P.oneOfType([P.instanceOf(Date), P.instanceOf(moment)]),
  constraints: P.any,
  error: P.string
}

TimeInput.defaultProps = {
  name: 'time',
  label: 'Time:'
}

TimeInput.propTypes = {
  time: P.oneOfType([P.instanceOf(Date), P.instanceOf(moment)]).isRequired,
  onTimeChange: P.func,
  timeFormat: P.string,
  name: P.string,
  label: P.string,
  disabled: P.bool,
  maxDate: P.oneOfType([P.instanceOf(Date), P.instanceOf(moment)]),
  minDate: P.oneOfType([P.instanceOf(Date), P.instanceOf(moment)]),
  error: P.string
}

export { DateInput, TimeInput }
