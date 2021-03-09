/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react'
import P from 'prop-types'
import moment from 'moment'
import { DateRangePicker } from 'react-date-range'

import FormInput from '@app/components/forms/form-input'
import Button from '@app/components/button'

import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import styles from './index.module.css'

const DateRangeInput = ({
  isShown,
  onDateChange,
  onDateApply,
  hasApplyButton
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedDateRange, setSelectedDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ])

  const handleCalendar = () => {
    setIsOpen(!isOpen)
  }

  const handleChange = e => {
    setSelectedDateRange([e.selection])
    onDateChange([e.selection])
  }

  return (
    <>
      <div
        className={`${styles.DateRangeContainer} ${
          isShown ? 'block' : 'hidden'
        }`}
      >
        <div className="cursor-pointer" onClick={handleCalendar}>
          <FormInput
            name="date"
            inputClassName="pointer-events-none"
            value={`${moment(selectedDateRange[0].startDate).format(
              'MMM. DD, YYYY'
            )} - ${moment(selectedDateRange[0].endDate).format(
              'MMM. DD, YYYY'
            )}`}
            onChange={() => {}}
            readOnly
          />
          <i className={`ciergio-calendar ${styles.Icon}`} />
        </div>

        <div className={`${styles.Content} ${isOpen && styles.Open}`}>
          <DateRangePicker
            editableDateInputs={true}
            onChange={handleChange}
            moveRangeOnFirstSelection={false}
            ranges={selectedDateRange}
            showSelectionPreview={true}
            color="#F56222"
            rangeColors={['#F56222']}
          />

          <div className={styles.Button}>
            <Button label="Ok" type="button" primary onClick={handleCalendar} />
          </div>
        </div>
      </div>
      {hasApplyButton && (
        <div className={`mr-4 ${isShown ? 'block' : 'hidden'}`}>
          <Button label="Apply" type="button" onClick={onDateApply} />
        </div>
      )}
    </>
  )
}

DateRangeInput.propTypes = {
  isShown: P.bool,
  onDateChange: P.func,
  onDateApply: P.func,
  hasApplyButton: P.bool
}

export default DateRangeInput
