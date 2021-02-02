import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Datetime from 'react-datetime'
import { FiClock } from 'react-icons/fi'

import { friendlyDateTimeFormat } from '@app/utils/date'

import FormInput from '@app/components/forms/form-input'
import RadioBox from '@app/components/forms/form-radio'
import Modal from '@app/components/modal'

import 'react-datetime/css/react-datetime.css'
import FormCheckbox from '@app/components/forms/form-checkbox'
import Select from '@app/components/select'
import FormDatePicker from '@app/components/forms/form-datepicker'
import Button from '@app/components/button'

const repeatOptions = [
  {
    label: 'Daily',
    value: 'daily'
  },
  {
    label: 'Weekly',
    value: 'weekly'
  },
  {
    label: 'Monthly',
    value: 'monthly'
  },
  {
    label: 'Annually',
    value: 'annually'
  },
  {
    label: 'Custom',
    value: 'custom'
  }
]

const days = [
  {
    label: 'S',
    value: 'sun'
  },
  {
    label: 'M',
    value: 'mon'
  },
  {
    label: 'T',
    value: 'tue'
  },
  {
    label: 'W',
    value: 'wed'
  },
  {
    label: 'T',
    value: 'thu'
  },
  {
    label: 'F',
    value: 'fri'
  },
  {
    label: 'S',
    value: 'sat'
  }
]

const monthArrayFiller = [...new Array(31)].map((item, i) => ({
  label: i + 1,
  value: i + 1
}))

const Component = ({
  visible,
  onSelectType,
  onSelectDateTime,
  onSave,
  onCancel
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedPublishType, setSelectedPublishType] = useState('now')
  const [isRepeat, setIsRepeat] = useState(false)
  const [selectedRepeatOption, setSelectedRepeatOption] = useState({
    label: 'Daily',
    value: 'daily'
  })
  const [selectedRepeat, setSelectRepeat] = useState('never')
  const [selectedRepeatEveryOption, setSelectedRepeatEveryOption] = useState({
    label: 'Week',
    value: 'week'
  })
  const [selectedDays, setSelectedDays] = useState([])
  const [datesSelected, setDatesSelected] = useState([])

  const onSelectPublishType = e => {
    setSelectedPublishType(e.target.value)
  }

  const handleDateChange = e => {
    setSelectedDate(e)
  }

  const onSelectRepeat = e => {
    const isSelected = e.target.value
    setSelectRepeat(isSelected)
  }

  const onSelectDay = currentDay => {
    let cloneDays = [...selectedDays]
    const isExist = cloneDays?.indexOf(currentDay) === -1

    if (isExist) {
      cloneDays = [...cloneDays, currentDay]
    } else {
      cloneDays = cloneDays.filter(day => day !== currentDay)
    }

    setSelectedDays(cloneDays)
  }

  const onSelectDates = currentDate => {
    let cloneDates = [...datesSelected]
    const isExist = cloneDates?.indexOf(currentDate) === -1

    if (isExist) {
      cloneDates = [...cloneDates, currentDate]
    } else {
      cloneDates = cloneDates.filter(day => day !== currentDate)
    }

    setDatesSelected(cloneDates)
  }

  const handleSave = () => {
    onSelectType(selectedPublishType)
    onSelectDateTime(selectedDate)
    onSave()
  }

  return (
    <Modal
      title="When do you want this published?"
      visible={visible}
      onClose={onCancel}
      onCancel={onCancel}
      onOk={handleSave}
      okText="Save"
      width={400}
    >
      <div className="text-base leading-7">
        <div className="mb-4">
          <div className="flex">
            <div className="p-4">
              <RadioBox
                primary
                id="all"
                name="publish_time"
                label="Now"
                value="now"
                onChange={onSelectPublishType}
                isChecked={selectedPublishType === 'now'}
              />
              <div className="ml-7 text-neutral-500 text-md leading-relaxed">
                Publish this post now.
              </div>
            </div>
            <div className="p-4">
              <RadioBox
                primary
                id="except"
                name="publish_time"
                label="Later"
                value="later"
                onChange={onSelectPublishType}
                isChecked={selectedPublishType === 'later'}
              />
              <div className="ml-7 text-neutral-500 text-md leading-relaxed">
                Set a date when to publish this post.
              </div>
            </div>
          </div>
        </div>

        {selectedPublishType && selectedPublishType !== 'now' && (
          <div>
            {selectedPublishType === 'later' && (
              <div className="p-4">
                <div className="mb-4">
                  <p className="font-bold">{`Don't share with`}</p>
                  <p>
                    You can create the post now then publish it at a later time.
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <Datetime
                    renderInput={(props, openCalendar) => (
                      <>
                        <div className="font-semibold">Date:</div>
                        <div className="relative">
                          <FormInput
                            {...props}
                            name="date"
                            value={friendlyDateTimeFormat(
                              selectedDate,
                              'MMMM DD, YYYY'
                            )}
                            readOnly
                          />
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
                    dateFormat="MMMM DD, YYYY"
                    timeFormat={false}
                    value={selectedDate}
                    onChange={handleDateChange}
                  />
                  <Datetime
                    renderInput={(props, openCalendar) => (
                      <>
                        <div className="font-semibold">Time:</div>
                        <div className="relative">
                          <FormInput
                            {...props}
                            name="time"
                            value={friendlyDateTimeFormat(
                              selectedDate,
                              'h:mm A'
                            )}
                            readOnly
                          />
                          <FiClock
                            className="ciergio-calendar absolute top-3 right-4 cursor-pointer"
                            onClick={openCalendar}
                          />
                        </div>
                      </>
                    )}
                    dateFormat={false}
                    value={selectedDate}
                    onChange={handleDateChange}
                  />
                </div>
                <span className="text-neutral-900">
                  Publish Date and Time must be 5 minutes advance on the current
                  date.
                </span>
              </div>
            )}
          </div>
        )}

        <div className="p-4 border-t flex items-center justify-start">
          <div className="w-1/4">
            <FormCheckbox
              id="repeat"
              name="repeat"
              label="Repeat"
              value={isRepeat}
              isChecked={isRepeat}
              onChange={e => setIsRepeat(e.target.checked)}
            />
          </div>

          <div className="w-1/2">
            <Select
              value={selectedRepeatOption}
              onChange={value => setSelectedRepeatOption(value)}
              options={repeatOptions}
              disabled={isRepeat === false}
            />
          </div>
        </div>
        {isRepeat && selectedRepeatOption?.value === 'custom' ? (
          <div className="p-4">
            <div>
              <h4 className="text-base font-bold text-gray-500 mb-2">
                Repeat Every
              </h4>
              <div className="w-1/3 mb-2">
                <Select
                  options={[
                    {
                      label: 'Week',
                      value: 'week'
                    },
                    {
                      label: 'Month',
                      value: 'month'
                    }
                  ]}
                  onChange={value => setSelectedRepeatEveryOption(value)}
                  value={selectedRepeatEveryOption}
                />
              </div>

              <div className="w-full">
                <h4 className="text-base font-bold text-gray-500 mb-2">
                  Repeat On
                </h4>
                {selectedRepeatEveryOption?.value === 'week'
                  ? days.map(({ label, value }) => (
                      <Button
                        key={value}
                        onClick={() => onSelectDay(value)}
                        primary={selectedDays?.includes(value)}
                        label={label}
                        className="mr-2"
                      />
                    ))
                  : null}
                <div className="max-w-full w-full flex flex-1 flex-wrap">
                  {selectedRepeatEveryOption?.value === 'month'
                    ? monthArrayFiller.map(({ label, value }) => (
                        <button
                          className={`w-5 h-5 b-0 m-0 border ${
                            datesSelected?.includes(value)
                              ? 'bg-primary-500 text-white border-primary-500'
                              : 'bg-white text-black border-neutral-300'
                          } py-5 px-6 flex items-center justify-center`}
                          onClick={() => onSelectDates(value)}
                          key={value}
                        >
                          {label}
                        </button>
                      ))
                    : null}
                </div>
              </div>
            </div>
          </div>
        ) : null}
        {isRepeat ? (
          <div className="flex flex-col p-4 justify-center">
            <h4 className="text-base font-bold text-gray-500">End</h4>
            <div className="w-1/4 mb-2">
              <RadioBox
                primary
                id="never"
                name="never"
                label="Never"
                value="never"
                onChange={onSelectRepeat}
                isChecked={selectedRepeat === 'never'}
              />
            </div>
            <div className="flex items-center mb-2">
              <div className="w-1/4">
                <RadioBox
                  primary
                  id="on"
                  name="on"
                  label="On"
                  value="on"
                  onChange={onSelectRepeat}
                  isChecked={selectedRepeat === 'on'}
                />
              </div>

              <div className="w-1/2">
                <FormDatePicker disabled={selectedRepeat !== 'on'} />
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-1/4">
                <RadioBox
                  primary
                  id="after"
                  name="after"
                  label="After"
                  value="after"
                  onChange={onSelectRepeat}
                  isChecked={selectedRepeat === 'after'}
                />
              </div>
              <div className="flex items-center w-1/2">
                <FormInput disabled={selectedRepeat !== 'after'} />
                <p className="ml-4">instance</p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </Modal>
  )
}

Component.propTypes = {
  visible: PropTypes.bool,
  onSelectType: PropTypes.func,
  onSelectDateTime: PropTypes.func,
  onSave: PropTypes.func,
  onCancel: PropTypes.func
}

export default Component
