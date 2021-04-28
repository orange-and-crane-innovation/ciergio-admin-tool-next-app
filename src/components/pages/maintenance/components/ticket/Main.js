import { useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { useQuery, useMutation } from '@apollo/client'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import dayjs from '@app/utils/date'
import showToast from '@app/utils/toast'
import Button from '@app/components/button'
import Tabs from '@app/components/tabs'
import { Card } from '@app/components/globals'
import EmptyStaff from '../EmptyStaff'
import AssignedStaffs from '../AssignedStaffs'
import { FaRegEnvelopeOpen } from 'react-icons/fa'
import {
  GET_ISSUE_DETAILS,
  GET_ISSUE_COMMENTS,
  POST_ISSUE_COMMENT,
  FOLLOW_ISSUE,
  UPDATE_ISSUE,
  GET_STAFFS
} from '../../queries'
import Comments from '../Comments'
import TicketHistory from '../TicketHistory'
import Dropdown from '@app/components/dropdown'
import HoldTicketModal from '../HoldTicketModal'
import CancelTicketModal from '../CancelTicketModal'
import AddStaffModal from '../AddStaffModal'

function Ticket() {
  const { handleSubmit, errors, control, register } = useForm()
  const router = useRouter()
  const ticketId = router?.query?.ticket
  const user = JSON.parse(localStorage.getItem('profile'))
  const userCompany = user?.accounts?.data?.find(
    account => account?.accountType === 'company_admin'
  )
  const [showHoldTicketModal, setShowHoldTicketModal] = useState(false)
  const [showCancelTicketModal, setShowCancelTicketModal] = useState(false)
  const [showAddStaffModal, setShowAddStaffModal] = useState(false)
  const [updateType, setUpdateType] = useState(null)
  const [selectedStaff, setSelectedStaff] = useState(null)
  const { data: issue, refetch: refetchIssue } = useQuery(GET_ISSUE_DETAILS, {
    variables: {
      id: ticketId
    }
  })
  const { data: comments, refetch: refetchComments } = useQuery(
    GET_ISSUE_COMMENTS,
    {
      variables: {
        id: ticketId
      }
    }
  )

  const { data: staffs } = useQuery(GET_STAFFS, {
    enabled: issue?.getIssue?.issue,
    variables: {
      where: {
        accountTypes: ['company_admin', 'complex_admin'],
        companyId: userCompany?.company?._id,
        complexId: issue?.getIssue?.issue?.complex?._id,
        buildingId: issue?.getIssue?.issue?.complex?._id
      }
    }
  })

  const [postComment] = useMutation(POST_ISSUE_COMMENT, {
    onCompleted: () => {
      showToast('success', 'Comment added!')
      refetchComments({
        variables: {
          id: ticketId
        }
      })
    }
  })

  const [followIssue, { loading: isFollowingTicket }] = useMutation(
    FOLLOW_ISSUE,
    {
      onCompleted: () => {
        refetchIssue({
          variables: {
            id: ticketId
          }
        })
      }
    }
  )

  const [updateIssue, { loading: isUpdatingIssue }] = useMutation(
    UPDATE_ISSUE,
    {
      onCompleted: data => {
        console.log({ data })
        if (updateType === 'resolve') {
          showToast('success', 'Ticket resolved.')
        }
        if (updateType === 'hold') {
          handleHoldTicket()
          showToast('success', 'Ticket On hold.')
        }
        if (updateType === 'cancel') {
          handleCancelTicket()
          showToast('success', 'Ticket Cancelled.')
        }
        if (updateType === 'resume') {
          showToast('success', 'Ticket Resumed.')
        }
        if (updateType === 'reopen') {
          showToast('success', 'Ticket Reopened.')
        }
        if (updateType === 'assign-staff') {
          handleAddStaff()
        }
        refetchIssue({
          variables: {
            id: ticketId
          }
        })
        setUpdateType(null)
      }
    }
  )

  const handleEnterComment = comment => {
    postComment({
      variables: {
        data: {
          comment,
          service: 'issue',
          srcId: ticketId
        }
      }
    })
  }

  const handleCancelTicket = () => setShowCancelTicketModal(old => !old)
  const handleHoldTicket = () => setShowHoldTicketModal(old => !old)
  const handleAddStaff = () => {
    if (selectedStaff) setSelectedStaff(null)
    setShowAddStaffModal(old => !old)
  }
  const handleCancelSubmit = values => {
    setUpdateType('cancel')
    updateIssue({
      variables: {
        id: ticketId,
        data: {
          status: 'cancelled',
          notes: values?.reason
        }
      }
    })
  }
  const handleHoldSubmit = values => {
    setUpdateType('hold')
    updateIssue({
      variables: {
        id: ticketId,
        data: {
          status: 'onhold',
          notes: values?.reason
        }
      }
    })
  }
  const handleAddStaffSubmit = () => {
    setUpdateType('assign-staff')
    updateIssue({
      variables: {
        id: ticketId,
        data: {
          assigneeAccountId: [selectedStaff.value]
        }
      }
    })
  }
  const ticket = issue?.getIssue?.issue
  const ticketComments = comments?.getIssue?.issue?.comments
  const buttonLabel = useMemo(() => {
    const status = ticket?.status
    return status === 'unassigned'
      ? 'Unassigned'
      : status === 'ongoing'
      ? 'In Progress'
      : status === 'onhold'
      ? 'On Hold'
      : status === 'resolved'
      ? 'Resolved'
      : 'Cancelled'
  }, [ticket?.status])

  let dropdownData = []

  if (ticket?.status === 'cancelled') {
    dropdownData = [
      {
        label: 'Reopen',
        icon: <FaRegEnvelopeOpen />,
        function: () => {
          setUpdateType('reopen')
          updateIssue({
            variables: {
              id: ticketId,
              status: 'reopen'
            }
          })
        }
      }
    ]
  }

  if (ticket?.status !== 'cancelled') {
    dropdownData = [
      {
        label: 'Put Ticket on Hold',
        icon: <span className="ciergio-pause" />,
        function: () => setShowHoldTicketModal(old => !old)
      },
      {
        label: 'Cancel Ticket',
        icon: <span className="ciergio-x" />,
        function: () => setShowCancelTicketModal(old => !old)
      }
    ]
  }

  const staffOptions = useMemo(() => {
    if (staffs?.getRepairsAndMaintenanceStaffs?.data?.length > 0) {
      return staffs?.getRepairsAndMaintenanceStaffs?.data.map(staff => {
        const user = staff.user
        return {
          label: (
            <p>
              {`${user.firstName} ${user.lastName} `}
              <span className="capitalize text-sm">
                {staff.accountType.replace('_', ' ')}
              </span>
            </p>
          ),
          value: staff._id
        }
      })
    }
    return []
  }, [staffs?.getRepairsAndMaintenanceStaffs])

  return (
    <section className="content-wrap">
      <div className="w-full">
        <div className="flex flex-col w-8/12 justify-center items-end">
          <div className="flex justify-end items-center">
            <Button
              label={ticket?.is_follower ? 'Following' : 'Follow Ticket'}
              loading={isFollowingTicket}
              onClick={() => {
                followIssue({
                  variables: {
                    data: {
                      service: 'issue',
                      srcId: ticketId
                    }
                  }
                })
              }}
            />{' '}
            {ticket?.status === 'ongoing' ? (
              <Button
                primary
                label="Resolve Ticket"
                onClick={() => {
                  setUpdateType('resolve')
                  updateIssue({
                    variables: {
                      id: ticketId,
                      data: {
                        status: 'resolved'
                      }
                    }
                  })
                }}
                loading={isUpdatingIssue}
                className="ml-2"
              />
            ) : null}
            {ticket?.status === 'onhold' ? (
              <Button
                primary
                label="Resume Ticket"
                onClick={() => {
                  setUpdateType('resume')
                  updateIssue({
                    variables: {
                      id: ticketId,
                      data: {
                        status: 'ongoing'
                      }
                    }
                  })
                }}
                loading={isUpdatingIssue}
                className="ml-2"
              />
            ) : null}
            <div className="border border-neutral-100 w-10 h-10 bg-white flex items-center ml-2 -mt-4 shadow">
              <Dropdown
                label={<span className="ciergio-more" />}
                items={dropdownData}
              />
            </div>
          </div>

          <div className="w-full">
            <Card
              content={
                <div className="w-full py-8">
                  <div className="px-4 border-b pb-4">
                    <div>
                      <Button
                        label={buttonLabel}
                        success={ticket?.status === 'ongoing'}
                        info={ticket?.status === 'unassigned'}
                        danger={ticket?.status === 'onhold'}
                        primary={ticket?.status === 'new'}
                        default={ticket?.status === 'resolved'}
                      />
                    </div>

                    <h2 className="font-bold text-2xl">
                      {ticket?.title || ''}
                    </h2>
                    <div className="w-2/3 flex justify-start mb-4">
                      <span className="mr-2">
                        {dayjs(ticket?.createdAt).format('MMM DD, YYYY')}
                      </span>
                      <span className="text-gray-400 mr-2 text-sm">&bull;</span>
                      <span className="mr-2 text-blue-500">
                        {ticket?.category?.name}
                      </span>
                      <span className="text-gray-400 mr-2 text-sm">&bull;</span>
                      <span className="text-blue-500">{`Ticket ${ticket?.code}`}</span>
                    </div>
                    <p className="text-black mb-4">{ticket?.content}</p>

                    <div>
                      <div className="flex">
                        {ticket?.mediaAttachments?.length > 0 ? (
                          <div>
                            <h3 className="text-base font-medium mb-2">
                              Attached File
                            </h3>
                            <div className="flex">
                              {ticket.mediaAttachments.map((media, index) => (
                                <img
                                  key={media._id}
                                  src={media.url}
                                  alt={`${ticket?.title}-${index}`}
                                  className="w-20 rounded mr-2"
                                />
                              ))}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="flex p-4">
                    <div className="w-1/2">
                      <h4 className="text-base font-medium mb-2">
                        {`Submitted By`}
                      </h4>
                      <div>
                        <p className="font-medium text-black">
                          {`Unit ${ticket?.unit?.name}, ${ticket?.building?.name}`}
                        </p>
                        <p>
                          <Link
                            href={`/residents/view/${ticket?.reporter?._id}`}
                          >
                            <span className="text-blue-400">
                              {`${ticket?.reporter?.user?.firstName} ${ticket?.reporter?.user?.lastName}`}
                            </span>
                          </Link>{' '}
                          <span className="capitalize">{`(${ticket?.reporter?.accountType?.replace(
                            '_',
                            ' '
                          )})`}</span>
                        </p>
                      </div>
                    </div>
                    <div className="w-1/2">
                      <h4 className="text-base font-medium mb-2">
                        Staff in this ticket
                      </h4>
                      {issue?.getIssue?.issue?.assignee?.length > 0 ? (
                        <div className="flex">
                          <AssignedStaffs
                            staffs={issue.getIssue.issue.assignee}
                          />
                          <EmptyStaff
                            onClick={() => setShowAddStaffModal(old => !old)}
                          />
                        </div>
                      ) : (
                        <EmptyStaff
                          onClick={() => setShowAddStaffModal(old => !old)}
                        />
                      )}
                    </div>
                  </div>
                </div>
              }
            />

            <Tabs defaultTab="1">
              <Tabs.TabLabels>
                <Tabs.TabLabel id="1">Comment</Tabs.TabLabel>
                <Tabs.TabLabel id="2">History</Tabs.TabLabel>
              </Tabs.TabLabels>
              <Tabs.TabPanels>
                <Tabs.TabPanel id="1">
                  <Comments
                    data={ticketComments}
                    onEnterComment={handleEnterComment}
                  />
                </Tabs.TabPanel>
                <Tabs.TabPanel id="2">
                  <TicketHistory ticketId={ticketId} />
                </Tabs.TabPanel>
              </Tabs.TabPanels>
            </Tabs>
          </div>
        </div>
      </div>
      <HoldTicketModal
        open={showHoldTicketModal}
        onCancel={handleHoldTicket}
        onOk={handleSubmit(handleHoldSubmit)}
        form={{
          errors,
          control
        }}
      />
      <CancelTicketModal
        open={showCancelTicketModal}
        onCancel={handleCancelTicket}
        onOk={handleSubmit(handleCancelSubmit)}
        form={{
          register,
          errors,
          control
        }}
      />
      <AddStaffModal
        open={showAddStaffModal}
        onCancel={handleAddStaff}
        onOk={handleAddStaffSubmit}
        options={staffOptions}
        onSelectStaff={setSelectedStaff}
        selectedStaff={selectedStaff}
      />
    </section>
  )
}

export default Ticket
