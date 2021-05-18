/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react'
import P from 'prop-types'
import { FaTimes } from 'react-icons/fa'
import { DateRange, DateRangePicker } from 'react-date-range'

import FormInput from '@app/components/forms/form-input'
import Button from '@app/components/button'

import { DATE } from '@app/utils'

import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import styles from './index.module.css'

const DateRangeInput = ({
  placeholder,
  isShown,
  onDateChange,
  onDateApply,
  onDateClear,
  hasApplyButton,
  hasSideOptions,
  hasClear
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isEmpty, setIsEmpty] = useState(true)
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ])
  const [selectedDateRange, setSelectedDateRange] = useState()

  const handleCalendar = () => {
    setIsOpen(!isOpen)
  }

  const handleChange = e => {
    setDateRange([e.selection])
    setIsEmpty(false)
  }

  const handleClear = e => {
    onDateClear()
    setIsEmpty(true)
    setSelectedDateRange(null)
    setDateRange([
      {
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection'
      }
    ])
  }

  const handleApply = () => {
    setSelectedDateRange(dateRange)
    onDateChange(dateRange)
    handleCalendar()
  }

  return (
    <div className={styles.DateRangeMainContainer}>
      <div
        className={`${styles.DateRangeContainer} ${
          isShown ? 'block' : 'hidden'
        }`}
      >
        <div className="cursor-pointer" onClick={handleCalendar}>
          <FormInput
            name="date"
            inputProps={{
              style: { backgroundColor: 'white' }
            }}
            inputClassName="pointer-events-none"
            placeholder={placeholder}
            value={
              !isEmpty && selectedDateRange
                ? `${DATE.toFriendlyShortDate(
                    selectedDateRange[0].startDate
                  )} - ${DATE.toFriendlyShortDate(
                    selectedDateRange[0].endDate
                  )}`
                : ''
            }
            onChange={() => {}}
            readOnly
          />
          <i className={`ciergio-calendar ${styles.Icon}`} />
        </div>

        {hasClear && !isEmpty && dateRange[0]?.startDate && (
          <FaTimes className={styles.CloseIcon} onClick={handleClear} />
        )}

        <div
          className={`${styles.Overlay} ${isOpen && styles.Open}`}
          onClick={handleCalendar}
        />
        <div className={`${styles.Content} ${isOpen && styles.Open}`}>
          <div className={styles.InputText}>
            <span>Start Date</span>
            <span>End Date</span>
          </div>

          {hasSideOptions ? (
            <DateRangePicker
              editableDateInputs={true}
              onChange={handleChange}
              moveRangeOnFirstSelection={false}
              ranges={dateRange}
              showSelectionPreview={true}
              color="#F56222"
              rangeColors={['#F56222']}
            />
          ) : (
            <DateRange
              editableDateInputs={true}
              onChange={handleChange}
              moveRangeOnFirstSelection={false}
              ranges={dateRange}
              showSelectionPreview={true}
              color="#F56222"
              rangeColors={['#F56222']}
            />
          )}
          <div className={styles.Button}>
            <Button
              label="Cancel"
              type="button"
              default
              onClick={handleCalendar}
            />

            <Button label="Apply" type="button" primary onClick={handleApply} />
          </div>
        </div>
      </div>
      {hasApplyButton && (
        <div className={`${isShown ? 'block' : 'hidden'}`}>
          <Button
            label="Apply"
            type="button"
            onClick={onDateApply}
            disabled={!selectedDateRange}
          />
        </div>
      )}
    </div>
  )
}

DateRangeInput.defaultProps = {
  isShown: true,
  hasApplyButton: false,
  hasSideOptions: true,
  hasClear: false
}

DateRangeInput.propTypes = {
  placeholder: P.string,
  isShown: P.bool,
  onDateChange: P.func,
  onDateApply: P.func,
  onDateClear: P.func,
  hasApplyButton: P.bool,
  hasSideOptions: P.bool,
  hasClear: P.bool
}

export default DateRangeInput
