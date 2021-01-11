import { Action } from '@app/components/globals'

export const upcomingTableRows = [
  {
    Header: 'Scheduled',
    accessor: 'scheduled'
  },
  {
    Header: 'Title',
    accessor: 'title'
  },
  {
    Header: 'Category',
    accessor: 'category'
  },
  {
    id: 'action',
    Cell: Action
  }
]

export const publishedTableRows = [
  {
    Header: 'Last Published',
    accessor: 'lastPublished'
  },
  {
    Header: 'Title',
    accessor: 'title'
  },
  {
    Header: 'Category',
    accessor: 'category'
  },
  {
    id: 'action',
    Cell: Action
  }
]

export const otherTableRows = [
  {
    Header: 'Last Modified',
    accessor: 'lastModified'
  },
  {
    Header: 'Title',
    accessor: 'title'
  },
  {
    Header: 'Category',
    accessor: 'category'
  },
  {
    id: 'action',
    Cell: Action
  }
]

export const upcomingData = {
  count: 161,
  limit: 10,
  offset: 0,
  data: []
}

export const publishedData = {
  count: 141,
  limit: 10,
  offset: 0,
  data: [
    {
      lastPublished: 'Nov 04, 2020, 2:15 PM',
      title: 'Red Cross',
      category: 'Emergency'
    },
    {
      lastPublished: 'Dec 14, 2020, 12:15 PM',
      title: 'PRHC Headquarters',
      category: 'Company'
    },
    {
      lastPublished: 'Nov 24, 2020, 2:35 PM',
      title: 'McDonalds',
      category: 'Delivery'
    },
    {
      lastPublished: 'Dec 04, 2020, 1:15 PM',
      title: 'Suds Laundry Services',
      category: 'Services'
    }
  ]
}

export const draftsData = {
  count: 141,
  limit: 10,
  offset: 0,
  data: [
    {
      lastModified: 'Nov 04, 2020, 2:15 PM',
      title: 'Untitled',
      category: 'Uncategorized'
    }
  ]
}

export const trashData = {
  count: 141,
  limit: 10,
  offset: 0,
  data: [
    {
      lastModified: 'Nov 04, 2020, 2:15 PM',
      title: 'draft',
      category: 'Emergency'
    },
    {
      lastModified: 'Dec 14, 2020, 12:15 PM',
      title: 'Flash 1',
      category: 'Company'
    },
    {
      lastModified: 'Nov 24, 2020, 2:35 PM',
      title: 'Draftrgsdterwtewrtwetewtw',
      category: 'Delivery'
    },
    {
      lastModified: 'Dec 04, 2020, 1:15 PM',
      title: 'sadasd',
      category: 'Services'
    }
  ]
}
