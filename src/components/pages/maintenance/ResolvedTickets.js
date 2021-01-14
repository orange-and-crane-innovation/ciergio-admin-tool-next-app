import { Table, Action } from '@app/components/globals'

const columns = [
  {
    Header: 'Date Created',
    accessor: 'date_created'
  },
  {
    Header: 'Ticket',
    accessor: 'ticket'
  },
  {
    Header: 'Reported By',
    accessor: 'reported_by'
  },
  {
    Header: 'Staff',
    accessor: 'staff'
  },
  {
    Header: 'Last Updated',
    accessor: 'last_updated'
  },
  {
    id: 'action',
    Cell: Action
  }
]

function ResolvedTickets() {
  return <Table columns={columns} payload={{ count: 0, data: [] }} />
}

export default ResolvedTickets
