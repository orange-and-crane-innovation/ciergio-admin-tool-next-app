/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
// eslint-disable-next-line jsx-a11y/click-events-have-key-events
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Datetime from 'react-datetime'
import moment from 'moment'
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
  onCancel
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedPublishType, setSelectedPublishType] = useState('now')

  const onSelectPublishType = e => {
    setSelectedPublishType(e.target.value)
    onSelectType(e.target.value)
  }

  const handleDateChange = e => {
    setSelectedDate(e)
    onSelectDateTime(e)
  }

  return (
    <Modal
      title="When do you want to publish this?"
      visible={isShown}
      onClose={onCancel}
      onCancel={onCancel}
      onOk={onSave}
      okText="Save Publish Schedule"
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
                            value={moment(selectedDate).format('MMMM DD, YYYY')}
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
                  />
                  <Datetime
                    renderInput={(props, openCalendar) => (
                      <>
                        <div className="font-semibold">Time:</div>
                        <div className="relative">
                          <FormInput
                            {...props}
                            name="time"
                            value={moment(selectedDate).format('h:mm A')}
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
  onCancel: PropTypes.func
}

export default Component
