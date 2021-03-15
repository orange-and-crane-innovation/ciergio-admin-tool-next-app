import { useState, useMemo } from 'react'
import P from 'prop-types'
import { useQuery } from '@apollo/client'

import PrimaryDataTable from '@app/components/globals/PrimaryDataTable'
import Dropdown from '@app/components/dropdown'
import EmptyStaff from './EmptyStaff'
import AssignedStaffs from './AssignedStaffs'
import { GET_ISSUES_BY_STATUS } from '../queries'
import { FaEllipsisH } from 'react-icons/fa'

function TicketsTab({ columns, type }) {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [offset, setOffset] = useState(0)

  const { data: issues, loading } = useQuery(GET_ISSUES_BY_STATUS, {
    variables: {
      where: {
        status: [type]
      },
      limit,
      offset
    }
  })

  const ticketsData = useMemo(() => {
    return {
      count: issues?.getIssues?.count || 0,
      limit: issues?.getIssues?.limit || limit,
      data:
        issues?.getIssues?.count > 0
          ? issues.getIssues.issue.map(issue => {
              const reporter = issue?.reporter?.user
              const dropdownData = [
                {
                  label: 'View Ticket Details',
                  icon: <span className="ciergio-file" />,
                  function: () => {}
                },
                {
                  label: 'Message Resident',
                  icon: <span className="ciergio-mail" />,
                  function: () => {}
                },
                {
                  label: 'Assign Ticket',
                  icon: <span className="ciergio-user" />,
                  function: () => {}
                }
              ]

              return {
                dateCreated: issue?.createdAt,
                ticket: issue?.title,
                reportedBy: `${reporter?.firstName} ${reporter?.lastName}`,
                staff:
                  issue?.assignee?.length > 0 ? (
                    <AssignedStaffs staffs={issue?.assignee} />
                  ) : (
                    <EmptyStaff />
                  ),
                dropdown: (
                  <Dropdown label={<FaEllipsisH />} items={dropdownData} />
                )
              }
            })
          : []
    }
  }, [issues?.getIssues])

  return (
    <PrimaryDataTable
      columns={columns}
      data={ticketsData}
      loading={loading}
      currentPage={page}
      pageLimit={limit}
      setPageLimit={setLimit}
      setCurrentPage={setPage}
      setPageOffset={setOffset}
    />
  )
}

TicketsTab.propTypes = {
  columns: P.array.isRequired,
  type: P.string.isRequired
}

export default TicketsTab
