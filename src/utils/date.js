import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'

const duration = require('dayjs/plugin/duration')

dayjs.extend(LocalizedFormat)
dayjs.extend(duration)

export const toFriendlyDateTime = data => {
  let convertedDate = '-'

  if (data) {
    const dateObj = new Date(data)
    const dayObj = dayjs(dateObj)
    convertedDate = dayObj.format('MMMM DD, YYYY hh:mm:ss A')
  }

  return convertedDate
}

export const toFriendlyDate = data => {
  let convertedDate = '-'

  if (data) {
    const dateObj = new Date(data)
    const dayObj = dayjs(dateObj)
    convertedDate = dayObj.format('MMMM DD, YYYY')
  }

  return convertedDate
}

export const toFriendlyTime = data => {
  let convertedDate = '-'

  if (data) {
    const dateObj = new Date(data)
    const dayObj = dayjs(dateObj)
    convertedDate = dayObj.format('hh:mm:ss A')
  }

  return convertedDate
}

export const friendlyDateTimeFormat = (newDate, format) => {
  let convertedDate = '-'

  if (newDate) {
    const dateObj = new Date(newDate)
    const dayObj = dayjs(dateObj)
    convertedDate = dayObj.format(format)
  }

  return convertedDate
}

export const displayDateCreated = data => {
  const inputDate = dayjs(data)
  const currentDate = dayjs(new Date())
  const difference = dayjs.duration(currentDate.diff(inputDate))
  const dateData = difference.$d
  const { seconds, minutes, hours, days } = dateData
  let returnData

  if (days === 0) {
    if (hours === 0) {
      if (minutes === 0) {
        if (seconds <= 10) {
          returnData = 'Just now'
        } else {
          returnData = seconds + ' sec ago'
        }
      } else if (minutes === 1) {
        returnData = minutes + ' min ago'
      } else if (minutes > 1) {
        returnData = minutes + ' mins ago'
      }
    } else if (hours === 1) {
      returnData = hours + ' hr ago'
    } else {
      returnData = hours + ' hrs ago'
    }
  } else if (days >= 2 && days < 7) {
    returnData = days + ' days ago'
  } else if (days === 7) {
    returnData = '1 week ago'
  } else if (days > 7) {
    returnData = toFriendlyDate(data)
  } else {
    returnData = 'Yesterday at ' + dayjs(data).format('h:mm a')
  }
  return returnData
}
