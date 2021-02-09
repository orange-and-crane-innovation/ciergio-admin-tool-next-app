export const UPCOMING = 'upcoming'
export const PUBLISHED = 'published'
export const DRAFT = 'draft'
export const TRASHED = 'trashed'

export const upcomingTableRows = [
  {
    name: 'Scheduled',
    width: ''
  },
  {
    name: 'Title',
    width: ''
  },
  {
    name: 'Category',
    width: ''
  },
  {
    name: '',
    width: ''
  }
]

export const publishedTableRows = [
  {
    name: 'Last Published',
    width: ''
  },
  {
    name: 'Title',
    width: ''
  },
  {
    name: 'Category',
    width: ''
  },
  {
    name: '',
    width: ''
  }
]

export const otherTableRows = [
  {
    name: 'Last Modified',
    width: ''
  },
  {
    name: 'Title',
    width: ''
  },
  {
    name: 'Category',
    width: ''
  },
  {
    name: '',
    width: ''
  }
]

export const bulkOptions = [
  {
    label: 'Unpublished',
    value: 'unpublish'
  },
  {
    label: 'Move to Trash',
    value: 'trash'
  }
]

export const categoryOptions = [
  {
    label: 'Announcements',
    value: 'announcements'
  },
  {
    label: 'Emergency',
    value: 'emergency'
  }
]

export const modalColumns = [
  {
    name: 'Date',
    width: ''
  },
  {
    name: 'Edited By',
    width: ''
  }
]

export const repeatOptions = [
  {
    label: 'Daily',
    value: 'daily'
  },
  {
    label: 'Weekly',
    value: 'weekly'
  },
  {
    label: 'Monthly',
    value: 'monthly'
  },
  {
    label: 'Annually',
    value: 'annually'
  },
  {
    label: 'Custom',
    value: 'custom'
  }
]

export const repeatEveryOptions = [
  {
    label: 'Week',
    value: 'week'
  },
  {
    label: 'Month',
    value: 'month'
  }
]

export const days = [
  {
    label: 'S',
    value: 'sun'
  },
  {
    label: 'M',
    value: 'mon'
  },
  {
    label: 'T',
    value: 'tue'
  },
  {
    label: 'W',
    value: 'wed'
  },
  {
    label: 'T',
    value: 'thu'
  },
  {
    label: 'F',
    value: 'fri'
  },
  {
    label: 'S',
    value: 'sat'
  }
]

export const monthArrayFiller = [...new Array(31)].map((item, i) => ({
  label: i + 1,
  value: i + 1
}))
