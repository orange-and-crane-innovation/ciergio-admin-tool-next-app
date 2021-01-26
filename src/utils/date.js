import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'

dayjs.extend(LocalizedFormat)

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
