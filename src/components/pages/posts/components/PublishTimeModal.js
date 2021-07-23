/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
// eslint-disable-next-line jsx-a11y/click-events-have-key-events
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Datetime from 'react-datetime'
import dayjs from 'dayjs'
import { FiClock } from 'react-icons/fi'

import FormInput from '@app/components/forms/form-input'
import RadioBox from '@app/components/forms/form-radio'
import Modal from '@app/components/modal'

import 'react-datetime/css/react-datetime.css'

const Component = ({
  isShown,
  onSelectType,
  onSelectDateTime,
  onSave,
  onCancel,
  valuePublishType,
  valueDateTime,
  errorSelectedDate
}) => {
  const [selectedDate, setSelectedDate] = useState(valueDateTime)
  const [selectedPublishType, setSelectedPublishType] =
    useState(valuePublishType)

  useEffect(() => {
    setSelectedPublishType(valuePublishType)
    setSelectedDate(valueDateTime)
  }, [valuePublishType, valueDateTime])

  const onSelectPublishType = e => {
    setSelectedPublishType(e.target.value)
    onSelectType(e.target.value)
  }

  const handleDateChange = e => {
    setSelectedDate(e)
    onSelectDateTime(e)
  }

  const validateDate = currentDate => {
    if (currentDate) {
      return currentDate.isSameOrAfter(dayjs(new Date()))
    }
    return true
  }

  return (
    <Modal
      title="When do you want to publish this?"
      visible={isShown}
      onClose={onCancel}
      onCancel={onCancel}
      onOk={!errorSelectedDate ? onSave : null}
      okText="Save Publish Schedule"
    >
      <div className="text-base leading-7">
        <div className="mb-4">
          <div className="flex">
            <div className="p-4">
              <RadioBox
                primary
                id="now"
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
                id="later"
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
          <div className="bg-neutral-200 -mx-4 p-6">
            {selectedPublishType === 'later' && (
              <>
                <div className="mb-4">
                  <p>
                    You can create the post now then publish it at a later time.
                  </p>
                </div>
                <div className="flex items-start justify-between">
                  <Datetime
                    renderInput={(props, openCalendar) => (
                      <>
                        <div className="font-semibold">Date:</div>
                        <div className="relative">
                          <FormInput
                            {...props}
                            inputProps={{
                              style: {
                                backgroundColor: 'white',
                                cursor: 'pointer'
                              }
                            }}
                            name="date"
                            value={dayjs(selectedDate).format('MMMM DD, YYYY')}
                            readOnly
                          />
                          <i
                            className="ciergio-calendar absolute top-3 right-4 cursor-pointer"
                            onClick={openCalendar}
                          />
                        </div>
                      </>
                    )}
                    dateFormat="MMMM DD, YYYY"
                    timeFormat={false}
                    value={selectedDate}
                    onChange={handleDateChange}
                    isValidDate={validateDate}
                    closeOnSelect
                  />
                  <Datetime
                    renderInput={(props, openCalendar) => (
                      <>
                        <div className="font-semibold">Time:</div>
                        <div className="relative">
                          <FormInput
                            {...props}
                            inputProps={{
                              style: {
                                backgroundColor: 'white',
                                cursor: 'pointer'
                              }
                            }}
                            name="time"
                            value={dayjs(selectedDate).format('h:mm A')}
                            error={errorSelectedDate}
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
              </>
            )}
          </div>
        )}
      </div>
    </Modal>
  )
}

Component.propTypes = {
  isShown: PropTypes.bool,
  onSelectType: PropTypes.func,
  onSelectDateTime: PropTypes.func,
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
  valuePublishType: PropTypes.string,
  valueDateTime: PropTypes.any,
  errorSelectedDate: PropTypes.string
}

export default Component
