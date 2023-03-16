import { useEffect, useMemo, useState } from 'react'

import { Card } from '@app/components/globals'
import { GET_ISSUE_HISTORY } from '../queries'
import P from 'prop-types'
import Pagination from '@app/components/pagination'
import Table from '@app/components/table'
import { friendlyDateTimeFormat } from '@app/utils/date'
import { useQuery } from '@apollo/client'

const columns = [
  {
    name: 'Date & Time',
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
  const [activePage, setActivePage] = useState(1)
  const [limitPage, setLimitPage] = useState(10)
  const [offsetPage, setOffsetPage] = useState(0)

  const { data, loading } = useQuery(GET_ISSUE_HISTORY, {
    variables: {
      id: ticketId,
      limit: limitPage,
      offset: offsetPage
    }
  })

  const onPageClick = e => {
    setActivePage(e)
    setOffsetPage(limitPage * (e - 1))
  }

  const onLimitChange = e => {
    setActivePage(1)
    setOffsetPage(0)
    setLimitPage(Number(e.value))
  }

  const historyData = useMemo(() => {
    const dataHistory = data?.getIssue?.issue?.history
    return {
      count: dataHistory?.count || 0,
      limit: dataHistory?.limit || 0,
      offset: dataHistory?.offset || 0,
      data:
        dataHistory?.count > 0
          ? dataHistory?.data.map(history => {
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
    <>
      <Card
        content={
          <Table rowNames={columns} items={historyData} loading={loading} />
        }
      />
      {!loading && historyData?.count !== 0 && (
        <div className="-mt-4">
          <Pagination
            items={historyData}
            activePage={activePage}
            onPageClick={onPageClick}
            onLimitChange={onLimitChange}
          />
        </div>
      )}
    </>
  )
}

TicketHistory.propTypes = {
  ticketId: P.string
}

export default TicketHistory
