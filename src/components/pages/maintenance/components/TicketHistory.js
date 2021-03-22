import P from 'prop-types'
import { useMemo } from 'react'
import { useQuery } from '@apollo/client'
import Table from '@app/components/table'
import { Card } from '@app/components/globals'
import { friendlyDateTimeFormat } from '@app/utils/date'
import { GET_ISSUE_HISTORY } from '../queries'

const columns = [
  {
    name: 'Data & Time',
    width: ''
  },
  {
    name: 'User',
    width: ''
  },
  {
    name: 'Activity',
    width: ''
  }
]

function TicketHistory({ ticketId }) {
  const { data, loading } = useQuery(GET_ISSUE_HISTORY, {
    variables: {
      id: ticketId
    }
  })

  const historyData = useMemo(() => {
    return {
      count: data?.getIssue?.issue?.history?.count || 0,
      limit: 10,
      data:
        data?.getIssue?.issue?.history?.count > 0
          ? data.getIssue.issue.history.data.map(history => {
              const user = history?.by?.user
              return {
                dateAndTime: friendlyDateTimeFormat(
                  history.createdAt,
                  'MMMM DD, YYYY - hh:mm A'
                ),
                user: `${user?.firstName} ${user?.lastName}`,
                activity: history?.activity
              }
            })
          : []
    }
  })
  return (
    <Card
      content={
        <Table rowNames={columns} items={historyData} loading={loading} />
      }
    />
  )
}

TicketHistory.propTypes = {
  ticketId: P.string.isRequired
}

export default TicketHistory
