import { GET_ISSUES_BY_STATUS, UPDATE_ISSUE } from '../queries'
import { displayDateCreated, friendlyDateTimeFormat } from '@app/utils/date'
import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'

import AddStaffModal from './AddStaffModal'
import AssignedStaffs from './AssignedStaffs'
import Dropdown from '@app/components/dropdown'
import EmptyStaff from './EmptyStaff'
import { FaEllipsisH } from 'react-icons/fa'
import { FiInbox } from 'react-icons/fi'
import Link from 'next/link'
import NotifCard from '@app/components/globals/NotifCard'
import P from 'prop-types'
import PrimaryDataTable from '@app/components/globals/PrimaryDataTable'
import errorHandler from '@app/utils/errorHandler'
import getAccountTypeName from '@app/utils/getAccountTypeName'
import { useRouter } from 'next/router'

function TicketsTab({
  columns,
  type,
  staffId,
  buildingId,
  categoryId,
  searchText,
  isMutationSuccess,
  staffOptions
}) {
  const router = useRouter()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [offset, setOffset] = useState(0)
  const [showAddStaffModal, setShowAddStaffModal] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState([])
  const [selectedTicket, setSelectedTicket] = useState()

  const { data: issues, loading, refetch } = useQuery(GET_ISSUES_BY_STATUS, {
    variables: {
      where: {
        status: type,
        assigneeAccountId: staffId,
        buildingId,
        categoryId
      },
      search: searchText || null,
      limit,
      offset
    }
  })

  const [updateIssue, { loading: isUpdatingIssue }] = useMutation(
    UPDATE_ISSUE,
    {
      onCompleted: data => {
        handleAddStaff()
        refetch()
      },
      onError: e => {
        errorHandler(e)
      }
    }
  )

  useEffect(() => {
    if (isMutationSuccess) {
      refetch()
    }
  }, [isMutationSuccess])

  const handleAddStaffSubmit = () => {
    updateIssue({
      variables: {
        id: selectedTicket,
        data: {
          assigneeAccountId: selectedStaff
            ? selectedStaff?.map(item => item.value)
            : null
        }
      }
    })
  }

  const handleAddStaff = () => {
    setSelectedStaff(null)
    setSelectedTicket(null)
    setShowAddStaffModal(old => !old)
  }

  const ticketsData = useMemo(() => {
    return {
      count: issues?.getIssues?.count || 0,
      limit: issues?.getIssues?.limit || limit,
      data:
        issues?.getIssues?.count > 0
          ? issues.getIssues.issue.map(issue => {
              const reporter = issue?.reporter
              const assignee = issue?.assignee?.map(staff => {
                const user = staff.user
                return {
                  label: (
                    <span>
                      {`${user.firstName} ${user.lastName} `}
                      <span className="capitalize text-sm">
                        {getAccountTypeName(staff)}
                      </span>
                    </span>
                  ),
                  value: staff._id
                }
              })

              const dropdownData = [
                {
                  label: 'View Ticket Details',
                  icon: <span className="ciergio-file" />,
                  function: () =>
                    router.push(`/maintenance/details/${issue._id}`)
                },
                {
                  label: 'Message Resident',
                  icon: <span className="ciergio-mail" />,
                  function: () => router.push(`/messages/${reporter.user._id}`)
                },
                {
                  label: 'Assign Ticket',
                  icon: <span className="ciergio-user" />,
                  function: () => {
                    setSelectedTicket(issue?._id)
                    setSelectedStaff(assignee)
                    setShowAddStaffModal(old => !old)
                  }
                }
              ]
              const unassignedData = {
                dateCreated: (
                  <span className="text-base text-neutral-dark">
                    {friendlyDateTimeFormat(issue?.createdAt, 'MMM DD')}
                  </span>
                ),
                ticket: (
                  <div>
                    <div
                      className={`text-neutral-dark text-base max-w-xs ${
                        issue?.readAt ? 'font-normal' : 'font-semibold'
                      }`}
                    >
                      <Link href={`/maintenance/details/${issue._id}`}>
                        <a className="mr-2 hover:underline">{issue?.title}</a>
                      </Link>
                    </div>
                    <div className="flex items-center justify-start">
                      <span className="text-neutral-500 text-md">
                        {issue?.category?.name}
                      </span>
                      <div className="h-1 w-1 rounded-full bg-neutral-500 mx-2"></div>
                      <span className="text-neutral-500 text-md">
                        {issue?.code}
                      </span>
                    </div>
                  </div>
                ),
                reportedBy: (
                  <div>
                    <div className="text-secondary-500 text-base">
                      <Link href={`/residents/view/${reporter?._id}`}>
                        <a className="hover:underline">
                          {`${reporter?.user?.firstName} ${reporter?.user?.lastName}`}
                        </a>
                      </Link>
                    </div>
                    <div className="text-neutral-dark text-md">{`Unit ${reporter?.unit?.name}`}</div>
                  </div>
                ),
                staff:
                  issue?.assignee?.length > 0 ? (
                    <AssignedStaffs
                      staffs={issue?.assignee}
                      onClick={() => {
                        setSelectedTicket(issue._id)
                        setSelectedStaff(assignee)
                        setShowAddStaffModal(old => !old)
                      }}
                    />
                  ) : (
                    <EmptyStaff
                      onClick={() => {
                        setSelectedTicket(issue._id)
                        setShowAddStaffModal(old => !old)
                      }}
                    />
                  )
              }

              if (type[0] !== 'unassigned') {
                return {
                  ...unassignedData,
                  lastUpdate: (
                    <span>{displayDateCreated(issue?.updatedAt)}</span>
                  ),
                  dropdown: (
                    <Dropdown label={<FaEllipsisH />} items={dropdownData} />
                  )
                }
              }

              return {
                ...unassignedData,
                dropdown: (
                  <Dropdown label={<FaEllipsisH />} items={dropdownData} />
                )
              }
            })
          : []
    }
  }, [issues?.getIssues])

  return (
    <>
      <PrimaryDataTable
        columns={columns}
        data={ticketsData}
        loading={loading}
        currentPage={page}
        pageLimit={limit}
        setPageLimit={setLimit}
        setCurrentPage={setPage}
        setPageOffset={setOffset}
        emptyText={
          <NotifCard icon={<FiInbox />} header="You assigned all tickets!" />
        }
      />
      <AddStaffModal
        open={showAddStaffModal}
        loading={isUpdatingIssue}
        options={staffOptions || []}
        onOk={handleAddStaffSubmit}
        onCancel={() => setShowAddStaffModal(old => !old)}
        onSelectStaff={setSelectedStaff}
        selectedStaff={selectedStaff}
      />
    </>
  )
}

TicketsTab.propTypes = {
  columns: P.array.isRequired,
  type: P.string.isRequired,
  staffId: P.string,
  buildingId: P.string,
  categoryId: P.string,
  searchText: P.string,
  isMutationSuccess: P.bool,
  staffOptions: P.array
}

export default TicketsTab
