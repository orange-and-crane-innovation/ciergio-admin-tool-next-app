import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import dayjs from 'dayjs'
import moment from 'moment'

import RadioBox from '@app/components/forms/form-radio'
import Modal from '@app/components/modal'

import FormCheckbox from '@app/components/forms/form-checkbox'
import Select from '@app/components/select'

import SelectPublishTime from './SelectPublishTime'
import CustomPublishDates from './CustomPublishDate'
import RepeatOptions from './RepeatOptions'

import { repeatOptions, repeatEveryOptions } from '../constants'
import showToast from '@app/utils/toast'

const Component = ({
  visible,
  onSelectType,
  onSelectDateTime,
  onSelectRecurring,
  onSave,
  onCancel,
  valuePublishType,
  valueDateTime,
  valueRecurring
}) => {
  const [isRepeat, setIsRepeat] = useState(false)

  const [selectedRepeatOption, setSelectedRepeatOption] = useState({
    label: 'Daily',
    value: 'daily'
  })
  const [selectedRepeatEveryOption, setSelectedRepeatEveryOption] = useState({
    label: 'Week',
    value: 'weekly'
  })

  const [selectedDays, setSelectedDays] = useState([])
  const [datesSelected, setDatesSelected] = useState([])

  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedRepeatDate, setSelectedRepeatDate] = useState()

  const [selectedPublishType, setSelectedPublishType] = useState('now')
  const [selectedRepeatEndOption, setSelectedRepeatEndOption] = useState('on')
  const [instance, setInstance] = useState(1)

  useEffect(() => {
    if (valuePublishType && valueDateTime) {
      setSelectedPublishType(valuePublishType)
      setSelectedDate(valueDateTime)
    }
  }, [valuePublishType, valueDateTime])

  useEffect(() => {
    if (valueRecurring?.isEdit) {
      setSelectedRepeatDate(
        valueRecurring.end.date ? new Date(valueRecurring?.end?.date) : null
      )
      setIsRepeat(true)
      setSelectedRepeatOption(
        repeatOptions.filter(
          item =>
            item.value ===
            (valueRecurring?.properties?.dayOfWeek?.length > 0 ||
            valueRecurring?.properties?.date?.length > 0
              ? 'custom'
              : valueRecurring?.type)
        )[0]
      )
      setSelectedRepeatEndOption(
        valueRecurring?.end?.date
          ? 'on'
          : valueRecurring?.end?.instance
          ? 'after'
          : 'on'
      )
      setInstance(valueRecurring?.end?.instance ?? 1)
      setSelectedRepeatEveryOption(
        repeatEveryOptions.filter(
          item => item.value === valueRecurring?.type
        )[0] || {
          label: 'Week',
          value: 'weekly'
        }
      )
      setSelectedDays(valueRecurring?.properties?.dayOfWeek ?? [])
      setDatesSelected(valueRecurring?.properties?.date ?? [])
    }
  }, [valueRecurring])

  // const resetModalValues = () => {
  //   if (valueRecurring?.isEdit) {
  //     if (valuePublishType && valueDateTime) {
  //       setSelectedPublishType(valuePublishType)
  //       setSelectedDate(valueDateTime)
  //     }
  //     if (valueRecurring) {
  //       setSelectedRepeatDate(
  //         valueRecurring?.end?.date ? new Date(valueRecurring?.end?.date) : null
  //       )
  //       setIsRepeat(true)
  //       setSelectedRepeatOption(
  //         repeatOptions.filter(item => item.value === valueRecurring?.type)[0]
  //       )
  //       setSelectedRepeatEndOption(
  //         valueRecurring?.end?.date
  //           ? 'on'
  //           : valueRecurring?.end?.instance
  //           ? 'after'
  //           : 'on'
  //       )
  //       setInstance(valueRecurring?.end?.instance ?? 1)
  //       setSelectedRepeatEveryOption(
  //         repeatEveryOptions.filter(
  //           item => item.value === valueRecurring?.type
  //         )[0] || {
  //           label: 'Week',
  //           value: 'weekly'
  //         }
  //       )
  //       setSelectedDays(valueRecurring?.properties?.dayOfWeek ?? [])
  //       setDatesSelected(valueRecurring?.properties?.date ?? [])
  //     }
  //   } else {
  //     setSelectedDate(new Date())
  //     setSelectedRepeatDate(null)
  //     setSelectedPublishType('now')
  //     setIsRepeat(false)
  //     setSelectedRepeatOption({
  //       label: 'Daily',
  //       value: 'daily'
  //     })
  //     setSelectedRepeatEndOption('on')
  //     setInstance(1)
  //     setSelectedRepeatEveryOption({
  //       label: 'Week',
  //       value: 'weekly'
  //     })
  //     setSelectedDays([])
  //     setDatesSelected([])
  //   }
  // }

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
    setDatesSelected([])
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
    setSelectedDays([])
  }

  const onSelectRepeatEveryOption = value => {
    setSelectedRepeatEveryOption(value)
  }

  const handleSave = () => {
    const fromTime = dayjs(new Date())
    const toTime = dayjs(selectedDate)
    const diffTime = toTime.diff(fromTime, 'minute', true)

    if (selectedPublishType === 'later' && diffTime < 5) {
      showToast('danger', 'Time must be 5 minutes advance on the current date')
    } else if (
      isRepeat &&
      selectedRepeatOption.value === 'custom' &&
      selectedDays.length === 0 &&
      datesSelected.length === 0
    ) {
      if (
        selectedRepeatEveryOption.value === 'weekly' &&
        selectedDays.length === 0
      ) {
        showToast('danger', 'Days of week must have at least 1 item')
      } else if (
        selectedRepeatEveryOption.value === 'monthly' &&
        datesSelected.length === 0
      ) {
        showToast('danger', 'Days of month must have at least 1 item')
      }
    } else if (
      isRepeat &&
      selectedRepeatEndOption === 'on' &&
      !selectedRepeatDate
    ) {
      showToast('danger', 'Please select an end date')
    } else if (
      isRepeat &&
      selectedRepeatEndOption === 'after' &&
      (instance === 0 || instance === '0' || instance === '')
    ) {
      showToast('danger', 'Instance value must be greater than 0')
    } else {
      onSelectType(selectedPublishType)
      onSelectDateTime(selectedDate)
      onSelectRecurring({
        isRepeat,
        selectedRepeatOption,
        selectedRepeatEveryOption,
        datesSelected,
        selectedDays,
        selectedRepeatEndOption,
        selectedRepeatDate,
        instance
      })

      onSave()
    }
  }

  const handleCancel = () => {
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
              value={isRepeat || ''}
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
              isClearable={false}
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
  onSelectRecurring: PropTypes.func,
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
  valuePublishType: PropTypes.string,
  valueDateTime: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.instanceOf(moment)
  ]),
  valueRecurring: PropTypes.object
}

export default Component
