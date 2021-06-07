import { useMemo, useState, useEffect } from 'react'
import P from 'prop-types'
import { useQuery } from '@apollo/client'

import Table from '@app/components/table'
import Pagination from '@app/components/pagination'
import { Card } from '@app/components/globals'

import { friendlyDateTimeFormat } from '@app/utils/date'

import { GET_ISSUE_HISTORY } from '../queries'

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
      {!loading && historyData?.count > 10 && (
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
