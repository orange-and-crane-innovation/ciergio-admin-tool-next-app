import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'

const duration = require('dayjs/plugin/duration')
const utc = require('dayjs/plugin/utc')

dayjs.extend(LocalizedFormat)
dayjs.extend(duration)
dayjs.extend(utc)

export const toFriendlyISO = data => {
  const dateObj = new Date(data)
  const dayObj = dayjs(dateObj)
  return dayObj.toISOString()
}

export const toFriendlyDateTime = data => {
  let convertedDate = '-'

  if (data) {
    const dateObj = new Date(data)
    const dayObj = dayjs(dateObj)
    convertedDate = dayObj.format('MMMM DD, YYYY hh:mm A')
  }

  return convertedDate
}

export const toFriendlyShortDateTime = data => {
  let convertedDate = '-'

  if (data) {
    const dateObj = new Date(data)
    const dayObj = dayjs(dateObj)
    convertedDate = dayObj.format('MMM DD, YYYY hh:mm A')
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

export const toFriendlyShortDate = data => {
  let convertedDate = '-'

  if (data) {
    const dateObj = new Date(data)
    const dayObj = dayjs(dateObj)
    convertedDate = dayObj.format('MMM DD, YYYY')
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

export const toFriendlyYearMonth = data => {
  let convertedDate = '-'

  if (data) {
    const dateObj = new Date(data)
    const dayObj = dayjs(dateObj)
    convertedDate = dayObj.format('MMM YYYY')
  }

  return convertedDate
}

export const displayDays = data => {
  const inputDate = dayjs(data)
  const currentDate = dayjs(new Date())
  const difference = dayjs.duration(currentDate.diff(inputDate))
  const dateData = difference.$d
  const { seconds, minutes, hours, days, months, years } = dateData

  let returnData
  if (years === 0 && months === 0 && days <= 7) {
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
    } else {
      returnData = friendlyDateTimeFormat(data, 'ddd')
    }
  } else {
    returnData = friendlyDateTimeFormat(data, 'll')
  }
  return returnData
}

export const displayDateCreated = data => {
  const inputDate = dayjs(data)
  const currentDate = dayjs(new Date())
  const difference = dayjs.duration(currentDate.diff(inputDate))
  const dateData = difference.$d
  const { seconds, minutes, hours, days, months, years } = dateData
  let returnData
  if (years === 0 && months === 0) {
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
  } else {
    returnData = toFriendlyDate(data)
  }
  return returnData
}

export const toBeginningOfMonth = data => {
  const date = new Date(data)
  date.setDate(1)
  date.setHours(0)
  date.setMinutes(0)
  date.setSeconds(0)
  return date
}

export const toEndOfMonth = data => {
  const date = new Date(data)
  date.setMonth(date.getMonth() + 1)
  date.setDate(0)
  date.setHours(23)
  date.setMinutes(59)
  date.setSeconds(59)
  date.setMilliseconds(999)
  return date
}

export const setInitialTime = data => {
  const date = new Date(data)
  date.setHours(0)
  date.setMinutes(0)
  date.setSeconds(0)
  date.setMilliseconds(0)
  return date
}

export const setEndTime = data => {
  const date = new Date(data)
  date.setHours(23)
  date.setMinutes(59)
  date.setSeconds(59)
  date.setMilliseconds(999)
  return date
}

export const addTime = (data, type, value) => {
  const date = new Date(data)

  if (type === 'hours') {
    date.setHours(value)
  }
  if (type === 'minutes') {
    date.setMinutes(value)
  }

  if (type === 'seconds') {
    date.setSeconds(value)
  }

  if (type === 'milliseconds') {
    date.setMilliseconds(value)
  }
  return date
}

export default dayjs
