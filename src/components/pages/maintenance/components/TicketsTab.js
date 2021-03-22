import { useState, useMemo, useEffect } from 'react'
import P from 'prop-types'
import { useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import PrimaryDataTable from '@app/components/globals/PrimaryDataTable'
import Dropdown from '@app/components/dropdown'
import { friendlyDateTimeFormat, displayDateCreated } from '@app/utils/date'
import EmptyStaff from './EmptyStaff'
import AssignedStaffs from './AssignedStaffs'
import { GET_ISSUES_BY_STATUS } from '../queries'
import AddStaffModal from './AddStaffModal'

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
  const { handleSubmit, control, errors } = useForm()
  const router = useRouter()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [offset, setOffset] = useState(0)
  const [showAddStaffModal, setShowAddStaffModal] = useState(false)

  const { data: issues, loading, refetch } = useQuery(GET_ISSUES_BY_STATUS, {
    variables: {
      where: {
        status: [type],
        assigneeAccountId: staffId,
        buildingId,
        categoryId
      },
      search: searchText || null,
      limit,
      offset
    }
  })

  useEffect(() => {
    if (isMutationSuccess) {
      refetch()
    }
  }, [isMutationSuccess])

  const handleAddStaffSubmit = values => console.log({ values })

  const ticketsData = useMemo(() => {
    return {
      count: issues?.getIssues?.count || 0,
      limit: issues?.getIssues?.limit || limit,
      data:
        issues?.getIssues?.count > 0
          ? issues.getIssues.issue.map(issue => {
              const reporter = issue?.reporter
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
                  function: () => router.push(`/messages`)
                },
                {
                  label: 'Assign Ticket',
                  icon: <span className="ciergio-user" />,
                  function: () => setShowAddStaffModal(old => !old)
                }
              ]
              const unassignedData = {
                dateCreated: (
                  <span className="text-sm text-neutral-dark">
                    {friendlyDateTimeFormat(issue?.createdAt, 'MMM DD')}
                  </span>
                ),
                ticket: (
                  <div>
                    <p
                      className={`text-neutral-dark text-sm max-w-xs ${
                        issue?.readAt !== null ? 'font-semibold' : 'font-normal'
                      }`}
                    >
                      {issue?.title}
                    </p>
                    <div className="flex items-center justify-start">
                      <span className="text-neutral-500 text-xs">
                        {issue?.category?.name}
                      </span>
                      <div className="h-1 w-1 rounded-full bg-neutral-500 mx-2"></div>
                      <span className="text-neutral-500 text-xs">
                        {issue?.code}
                      </span>
                    </div>
                  </div>
                ),
                reportedBy: (
                  <div>
                    <p className="text-secondary-500 text-sm m-0">{`${reporter?.user?.firstName} ${reporter?.user?.lastName}`}</p>
                    <p className="text-neutral-dark text-xs m-0">{`Unit ${reporter?.unit?.name}`}</p>
                  </div>
                ),
                staff:
                  issue?.assignee?.length > 0 ? (
                    <AssignedStaffs staffs={issue?.assignee} />
                  ) : (
                    <EmptyStaff
                      onClick={() => setShowAddStaffModal(old => !old)}
                    />
                  )
              }

              if (type !== 'unassigned') {
                return {
                  ...unassignedData,
                  lastUpdate: (
                    <span>{displayDateCreated(issue?.updatedAt)}</span>
                  ),
                  dropdown: (
                    <Dropdown
                      label={<span className="ciergio-more" />}
                      items={dropdownData}
                    />
                  )
                }
              }

              return {
                ...unassignedData,
                dropdown: (
                  <Dropdown
                    label={<span className="ciergio-more" />}
                    items={dropdownData}
                  />
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
      />
      <AddStaffModal
        open={showAddStaffModal}
        onOk={handleSubmit(handleAddStaffSubmit)}
        onClose={() => setShowAddStaffModal(old => !old)}
        loading={false}
        form={{
          control,
          errors
        }}
        options={staffOptions}
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
