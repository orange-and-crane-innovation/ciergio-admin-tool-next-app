import { Action, Table } from '@app/components/globals'

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
    id: 'action',
    Cell: Action
  }
]

function UnassignedTickets() {
  return <Table columns={columns} payload={{ count: 0, data: [] }} />
}

export default UnassignedTickets
