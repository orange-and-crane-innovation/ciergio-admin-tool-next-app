import { useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { useQuery, useMutation } from '@apollo/client'
import { useForm } from 'react-hook-form'
import dayjs from '@app/utils/date'
import showToast from '@app/utils/toast'
import Button from '@app/components/button'
import Tabs from '@app/components/tabs'
import { Card } from '@app/components/globals'
import { AiOutlineUserAdd } from 'react-icons/ai'
import {
  GET_ISSUE_DETAILS,
  GET_ISSUE_COMMENTS,
  POST_ISSUE_COMMENT,
  FOLLOW_ISSUE,
  RESOLVE_ISSUE
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
  const [showHoldTicketModal, setShowHoldTicketModal] = useState(false)
  const [showCancelTicketModal, setShowCancelTicketModal] = useState(false)
  const [showAddStaffModal, setShowAddStaffModal] = useState(false)
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

  const [resolveIssue, { loading: isResolvingIssue }] = useMutation(
    RESOLVE_ISSUE,
    {
      onCompleted: () => {
        showToast('success', 'Ticket resolved.')
        refetchIssue({
          variables: {
            id: ticketId
          }
        })
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
  const handleAddStaff = () => setShowAddStaffModal(old => !old)
  const handleCancelSubmit = values => console.log('cancel', values)
  const handleHoldSubmit = values => {
    console.log('hold', values)
  }
  const handleAddStaffSubmit = values => console.log('add staff', values)
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

  const dropdownData = [
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
                  resolveIssue({
                    variables: {
                      id: ticketId,
                      data: {
                        status: 'resolved'
                      }
                    }
                  })
                }}
                loading={isResolvingIssue}
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
                          <span className="text-blue-400">
                            {`${ticket?.reporter?.user?.firstName} ${ticket?.reporter?.user?.lastName}`}
                          </span>{' '}
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
                      <div
                        role="button"
                        tabIndex={0}
                        onKeyDown={() => {}}
                        className="w-full flex justify-start items-center"
                        onClick={() => setShowAddStaffModal(old => !old)}
                      >
                        <div className="w-12 h-12 border border-blue-500 border-dashed rounded-full mr-4 flex justify-center items-center">
                          <AiOutlineUserAdd className="text-blue-500" />
                        </div>
                        <p className="font-bold text-base text-blue-500">
                          Add Staff
                        </p>
                      </div>
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
        onOk={handleSubmit(handleAddStaffSubmit)}
        form={{
          register,
          errors,
          control
        }}
      />
    </section>
  )
}

export default Ticket
