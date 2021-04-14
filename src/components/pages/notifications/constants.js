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
    width: '20%'
  },
  {
    name: 'Title',
    width: '40%'
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
    label: 'Move to Trash',
    value: 'trashed'
  }
]

export const bulkOptionsTrash = [
  {
    label: 'Restore',
    value: 'draft'
  },
  {
    label: 'Delete Permanently',
    value: 'deleted'
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
    value: 'yearly'
  },
  {
    label: 'Custom',
    value: 'custom'
  }
]

export const repeatEveryOptions = [
  {
    label: 'Week',
    value: 'weekly'
  },
  {
    label: 'Month',
    value: 'monthly'
  }
]

export const days = [
  {
    label: 'Sun',
    value: 0
  },
  {
    label: 'Mon',
    value: 1
  },
  {
    label: 'Tue',
    value: 2
  },
  {
    label: 'Wed',
    value: 3
  },
  {
    label: 'Thu',
    value: 4
  },
  {
    label: 'Fri',
    value: 5
  },
  {
    label: 'Sat',
    value: 6
  }
]

export const monthArrayFiller = [...new Array(31)].map((item, i) => ({
  label: i + 1,
  value: i + 1
}))
