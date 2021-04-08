import React from 'react'
import P from 'prop-types'
import dayjs from 'dayjs'
import { FaSync } from 'react-icons/fa'

import { DATE } from '@app/utils'

const RecurringType = ({ publishedAt, recurringData }) => {
  if (recurringData) {
    return (
      <span className="flex items-center text-neutral-500 text-sm">
        <FaSync className="mr-2" />
        {` Next on `}
        {recurringData.type === 'daily'
          ? DATE.toFriendlyShortDateTime(
              dayjs(new Date(publishedAt)).add(1, 'd')
            )
          : recurringData.type === 'weekly' &&
            recurringData.properties &&
            recurringData.properties.dayOfWeek &&
            recurringData.properties.dayOfWeek.length > 0
          ? DATE.toFriendlyShortDateTime(
              dayjs(new Date(publishedAt)).day(
                recurringData.properties.dayOfWeek.filter(item2 => {
                  const momentPublishedAtDay = dayjs(
                    new Date(publishedAt)
                  ).day()
                  if (momentPublishedAtDay < item2) {
                    return item2
                  }
                  return null
                })[0] || recurringData.properties.dayOfWeek[0] + 7
              )
            )
          : recurringData.type === 'weekly'
          ? DATE.toFriendlyShortDateTime(
              dayjs(new Date(publishedAt)).add(1, 'w')
            )
          : recurringData.type === 'monthly' &&
            recurringData.properties &&
            recurringData.properties.date &&
            recurringData.properties.date.length > 0
          ? DATE.toFriendlyShortDateTime(
              dayjs(new Date(publishedAt)).date(
                recurringData.properties.date.filter(item2 => {
                  const momentPublishedAtDate = dayjs(
                    new Date(publishedAt)
                  ).date()
                  if (momentPublishedAtDate < item2) {
                    return item2
                  }
                  return null
                })[0] || recurringData.properties.date[0] + 30
              )
            )
          : recurringData.type === 'monthly'
          ? DATE.toFriendlyShortDateTime(
              dayjs(new Date(publishedAt)).add(1, 'M')
            )
          : recurringData.type === 'yearly'
          ? DATE.toFriendlyShortDateTime(
              dayjs(new Date(publishedAt)).add(1, 'Y')
            )
          : null}
      </span>
    )
  }
  return null
}

RecurringType.propTypes = {
  publishedAt: P.string,
  recurringData: P.object
}

export default RecurringType
