import React, { useMemo } from 'react'
import P from 'prop-types'
import moment from 'moment'

import { friendlyDateTimeFormat } from '@app/utils/date'
import { DATE } from '@app/utils'

import EditButton from './EditButton'

import { days, monthArrayFiller, repeatOptions } from '../constants'

function PublishType({
  publishType,
  publishDateTime,
  recurringData,
  onShowPublishTypeModal
}) {
  const PUBLISH_LATER = publishType === 'later'
  let publishTime = null

  if (publishDateTime) {
    publishTime = `${friendlyDateTimeFormat(
      publishDateTime,
      'MMM DD, YYYY'
    )} - ${friendlyDateTimeFormat(publishDateTime, 'hh:mm A')}`
  }

  const recurringDate = useMemo(() => {
    if (recurringData?.isEdit) {
      if (
        (recurringData?.properties?.date &&
          recurringData?.properties?.date?.length > 0) ||
        (recurringData?.properties?.dayOfWeek &&
          recurringData?.properties?.dayOfWeek?.length > 0)
      ) {
        if (recurringData?.type === 'weekly') {
          return (
            <p>{`Every ${(recurringData?.properties?.dayOfWeek)
              .map(item => days[item].label)
              .join(', ')
              .replace(/,(?=[^,]*$)/, ' and')} of the week`}</p>
          )
        } else if (recurringData?.type === 'monthly') {
          return (
            <p>{`Every ${(recurringData?.properties?.date)
              .map(item => monthArrayFiller[item].label)
              .join(', ')
              .replace(/,(?=[^,]*$)/, ' and')} of the month`}</p>
          )
        }
      } else {
        return (
          <p>
            Repeat{' '}
            {
              repeatOptions.filter(
                item => item.value === recurringData?.type
              )[0]?.label
            }
          </p>
        )
      }
    } else {
      if (recurringData?.isRepeat) {
        if (recurringData?.selectedRepeatOption) {
          if (recurringData?.selectedRepeatOption.value === 'custom') {
            if (recurringData?.selectedRepeatEveryOption.value === 'weekly') {
              return (
                <p>{`Every ${(recurringData?.selectedDays)
                  .map(item => days[item].label)
                  .join(', ')
                  .replace(/,(?=[^,]*$)/, ' and')} of the week`}</p>
              )
            } else if (
              recurringData?.selectedRepeatEveryOption.value === 'monthly'
            ) {
              return (
                <p>{`Every ${(recurringData?.datesSelected)
                  .map(item => monthArrayFiller[item].label)
                  .join(', ')
                  .replace(/,(?=[^,]*$)/, ' and')} of the month`}</p>
              )
            }
          } else {
            return <p>Repeat {recurringData?.selectedRepeatOption?.label}</p>
          }
        }
      }
    }
    return null
  }, [recurringData])

  const recurringEndDate = useMemo(() => {
    if (recurringData?.isEdit) {
      if (recurringData) {
        if (recurringData?.end?.date) {
          return (
            <p>until {DATE.toFriendlyShortDate(recurringData?.end?.date)}</p>
          )
        } else if (recurringData?.end?.instance) {
          return (
            <p>{`after ${recurringData?.end?.instance} instance${
              recurringData?.end?.instance > 1 ? 's' : ''
            }`}</p>
          )
        }
      }
    } else {
      if (recurringData?.isRepeat) {
        if (recurringData?.selectedRepeatEndOption === 'on') {
          return (
            <p>
              until{' '}
              {DATE.toFriendlyShortDate(recurringData?.selectedRepeatDate)}
            </p>
          )
        } else if (recurringData?.selectedRepeatEndOption === 'after') {
          return (
            <p>{`after ${recurringData?.instance} instance${
              recurringData?.instance > 1 ? 's' : ''
            }`}</p>
          )
        }
      }
    }
    return null
  }, [recurringData])

  return (
    <div className="flex">
      <span style={{ minWidth: '65px' }}>Publish:</span>
      <div className="flex flex-col">
        <div className="flex">
          <p className="font-bold mr-2">
            {PUBLISH_LATER ? ` Scheduled, ${publishTime} ` : ' Immediately '}
          </p>
          <EditButton onClick={onShowPublishTypeModal} />
        </div>
        {recurringDate}
        {recurringEndDate}
      </div>
    </div>
  )
}

PublishType.propTypes = {
  publishType: P.string,
  publishDateTime: P.oneOfType([P.instanceOf(Date), P.instanceOf(moment)]),
  recurringData: P.object,
  onShowPublishTypeModal: P.func
}

export default PublishType
