import moment from 'moment'

export const toFriendlyDateTime = data => {
  let convertedDate = '-'

  if (data) {
    const dateObj = new Date(data)
    const momentObj = moment(dateObj)
    convertedDate = momentObj.format('MMMM DD, YYYY hh:mm:ss A')
  }

  return convertedDate
}

export const toFriendlyDate = data => {
  let convertedDate = '-'

  if (data) {
    const dateObj = new Date(data)
    const momentObj = moment(dateObj)
    convertedDate = momentObj.format('MMMM DD, YYYY')
  }

  return convertedDate
}

export const toFriendlyTime = data => {
  let convertedDate = '-'

  if (data) {
    const dateObj = new Date(data)
    const momentObj = moment(dateObj)
    convertedDate = momentObj.format('hh:mm:ss A')
  }

  return convertedDate
}
