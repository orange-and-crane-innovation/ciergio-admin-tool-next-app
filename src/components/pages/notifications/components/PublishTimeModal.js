import React, { useState } from 'react'
import PropTypes from 'prop-types'

import RadioBox from '@app/components/forms/form-radio'
import Modal from '@app/components/modal'

import FormCheckbox from '@app/components/forms/form-checkbox'
import Select from '@app/components/select'

import SelectPublishTime from './SelectPublishTime'
import CustomPublishDates from './CustomPublishDate'
import RepeatOptions from './RepeatOptions'

import { repeatOptions } from '../constants'

const Component = ({
  visible,
  onSelectType,
  onSelectDateTime,
  onSave,
  onCancel
}) => {
  const [isRepeat, setIsRepeat] = useState(false)

  const [selectedRepeatOption, setSelectedRepeatOption] = useState({
    label: 'Daily',
    value: 'daily'
  })
  const [selectedRepeatEveryOption, setSelectedRepeatEveryOption] = useState({
    label: 'Week',
    value: 'week'
  })

  const [selectedDays, setSelectedDays] = useState([])
  const [datesSelected, setDatesSelected] = useState([])

  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedRepeatDate, setSelectedRepeatDate] = useState(new Date())

  const [selectedPublishType, setSelectedPublishType] = useState('now')
  const [selectedRepeatEndOption, setSelectedRepeatEndOption] = useState(
    'never'
  )
  const [instance, setInstance] = useState('')

  const resetModalValues = () => {
    setSelectedDate(new Date())
    setSelectedRepeatDate(new Date())
    setSelectedPublishType('now')
    setIsRepeat(false)
    setSelectedRepeatOption({
      label: 'Daily',
      value: 'daily'
    })
    setSelectedRepeatEndOption('never')
    setInstance('')
    setSelectedRepeatEveryOption({
      label: 'Week',
      value: 'week'
    })
    setSelectedDays([])
    setDatesSelected([])
  }

  const onSelectPublishType = e => {
    setSelectedPublishType(e.target.value)
  }

  const handleDateChange = e => {
    setSelectedDate(e)
  }

  const onSelectRepeat = e => {
    const isSelected = e.target.value
    setSelectedRepeatEndOption(isSelected)
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

  const onSelectRepeatEveryOption = value => {
    setSelectedRepeatEveryOption(value)
  }

  const handleSave = () => {
    onSelectType(selectedPublishType)
    onSelectDateTime(selectedDate)
    resetModalValues()
    onSave()
  }

  const handleCancel = () => {
    resetModalValues()
    onCancel()
  }

  const onRepeatChange = e => setIsRepeat(e.target.checked)

  const onChangeRepeatOption = value => setSelectedRepeatOption(value)

  const onChangeInstance = e => setInstance(e.target.value)

  const onRepeatDateChange = e => setSelectedRepeatDate(e)

  return (
    <Modal
      title="When do you want this published?"
      visible={visible}
      onClose={handleCancel}
      onCancel={handleCancel}
      onOk={handleSave}
      okText="Save"
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
        <SelectPublishTime
          publishType={selectedPublishType}
          date={selectedDate}
          onDateChange={handleDateChange}
        />

        <div className="p-4 border-t flex items-center justify-start">
          <div className="w-1/4">
            <FormCheckbox
              id="repeat"
              name="repeat"
              label="Repeat"
              value={isRepeat}
              isChecked={isRepeat}
              onChange={onRepeatChange}
            />
          </div>

          <div className="w-1/2">
            <Select
              value={selectedRepeatOption}
              onChange={onChangeRepeatOption}
              options={repeatOptions}
              disabled={!isRepeat}
            />
          </div>
        </div>
        <CustomPublishDates
          repeat={isRepeat}
          repeatOption={selectedRepeatOption}
          repeatEveryOption={selectedRepeatEveryOption}
          dates={datesSelected}
          weekdays={selectedDays}
          onSelectDates={onSelectDates}
          onSelectDay={onSelectDay}
          onSelectRepeatEveryOption={onSelectRepeatEveryOption}
        />
        <RepeatOptions
          repeat={isRepeat}
          repeatEndOption={selectedRepeatEndOption}
          repeatDate={selectedRepeatDate}
          onChangeInstance={onChangeInstance}
          instance={instance}
          onSelectRepeat={onSelectRepeat}
          onRepeatDateChange={onRepeatDateChange}
        />
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
