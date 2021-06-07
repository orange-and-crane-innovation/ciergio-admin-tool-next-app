import { useMemo, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useQuery, useMutation } from '@apollo/client'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { FaRegEnvelopeOpen } from 'react-icons/fa'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import Button from '@app/components/button'
import Tabs from '@app/components/tabs'
import LightBox from '@app/components/lightbox'
import { Card } from '@app/components/globals'

import dayjs from '@app/utils/date'
import showToast from '@app/utils/toast'
import getAccountTypeName from '@app/utils/getAccountTypeName'
import errorHandler from '@app/utils/errorHandler'
import { ACCOUNT_TYPES } from '@app/constants'

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
import EmptyStaff from '../EmptyStaff'
import AssignedStaffs from '../AssignedStaffs'

const validationSchema = yup.object().shape({
  reason: yup.mixed().label('Reason').nullable().required()
})

function Ticket() {
  const { handleSubmit, errors, control, register } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      reason: null
    }
  })
  const router = useRouter()
  const ticketId = router?.query?.ticket
  const [limitPage, setLimitPage] = useState(5)
  const [offsetPage] = useState(0)
  const [sortPage] = useState(-1)
  const [showHoldTicketModal, setShowHoldTicketModal] = useState(false)
  const [showCancelTicketModal, setShowCancelTicketModal] = useState(false)
  const [showAddStaffModal, setShowAddStaffModal] = useState(false)
  const [updateType, setUpdateType] = useState()
  const [selectedStaff, setSelectedStaff] = useState()
  const [imageLists, setImageLists] = useState([])
  const [imageIndex, setImageIndex] = useState(0)
  const [imageOpen, setImageOpen] = useState(false)

  const { data: issue, refetch: refetchIssue } = useQuery(GET_ISSUE_DETAILS, {
    variables: {
      id: ticketId
    }
  })

  const {
    data: comments,
    loading: loadingComments,
    refetch: refetchComments
  } = useQuery(GET_ISSUE_COMMENTS, {
    variables: {
      id: ticketId,
      limit: limitPage,
      offset: offsetPage,
      sort: sortPage
    }
  })

  const { data: staffs } = useQuery(GET_STAFFS, {
    enabled: issue?.getIssue?.issue,
    variables: {
      where: {
        accountTypes: [
          ACCOUNT_TYPES.COMPYAD.value,
          ACCOUNT_TYPES.COMPXAD.value,
          ACCOUNT_TYPES.BUIGAD.value,
          ACCOUNT_TYPES.RECEP.value
        ],
        companyId: issue?.getIssue?.issue?.company?._id,
        complexId: issue?.getIssue?.issue?.complex?._id,
        buildingId: issue?.getIssue?.issue?.building?._id
      }
    }
  })

  const [postComment] = useMutation(POST_ISSUE_COMMENT, {
    onCompleted: () => {
      showToast('success', 'Comment added!')
      refetchComments()
    },
    onError: e => {
      errorHandler(e)
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
      },
      onError: e => {
        errorHandler(e)
      }
    }
  )

  const [updateIssue, { loading: isUpdatingIssue }] = useMutation(
    UPDATE_ISSUE,
    {
      onCompleted: data => {
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
      },
      onError: e => {
        errorHandler(e)
      }
    }
  )

  const handleEnterComment = data => {
    postComment({
      variables: {
        data: {
          service: 'issue',
          srcId: ticketId,
          comment: data?.comment !== '' ? data?.comment : null,
          mediaAttachments: data?.imageAttachments
        }
      }
    })
  }

  const handleMoreComment = () => {
    setLimitPage(prev => prev + 5)
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
          assigneeAccountId: selectedStaff
            ? selectedStaff?.map(item => item.value)
            : null
        }
      }
    })
  }

  const handleImageOpen = index => {
    setImageOpen(true)
    handleImageIndex(index)
  }

  const handleImageClose = () => {
    setImageOpen(false)
  }

  const handleImageIndex = index => {
    setImageIndex(index)
  }

  useEffect(() => {
    const data = issue?.getIssue?.issue
    if (data?.assignee) {
      setSelectedStaff(
        issue?.getIssue?.issue?.assignee?.map(staff => {
          const user = staff.user
          return {
            label: (
              <span>
                {`${user.firstName} ${user.lastName} `}
                <span className="capitalize text-sm">
                  {getAccountTypeName(staff.accountType)}
                </span>
              </span>
            ),
            value: staff._id
          }
        })
      )
    }
    if (data?.mediaAttachments) {
      setImageLists(
        issue?.getIssue?.issue?.mediaAttachments.map(image => image.url)
      )
    }
  }, [issue])

  const ticket = issue?.getIssue?.issue ?? []
  const ticketComments = comments?.getIssue?.issue?.comments ?? {}
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
            <span>
              {`${user.firstName} ${user.lastName} `}
              <span className="capitalize text-sm">
                {getAccountTypeName(staff.accountType)}
              </span>
            </span>
          ),
          value: staff._id
        }
      })
    }
    return []
  }, [staffs?.getRepairsAndMaintenanceStaffs])

  return (
    <section className="content-wrap">
      <div className="w-full lg:w-8/12">
        <div className="flex flex-col justify-center items-end">
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
                <div className="w-full py-8 text-base leading-7">
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

                    <h2 className="font-bold text-4xl leading-10 break-words">
                      {ticket?.title || ''}
                    </h2>
                    <div className="w-2/3 flex justify-start mb-6 text-sm leading-7">
                      <span className="mr-2">
                        {dayjs(ticket?.createdAt).format('MMM DD, YYYY')}
                      </span>
                      <span className="text-gray-400 mr-2">&bull;</span>
                      <span className="mr-2 text-secondary-500">
                        {ticket?.category?.name}
                      </span>
                      <span className="text-gray-400 mr-2">&bull;</span>
                      <span className="text-secondary-500">{`Ticket ${ticket?.code}`}</span>
                    </div>
                    <p className="text-black mb-4 break-words">
                      {ticket?.content}
                    </p>

                    <div className="flex mt-6">
                      {ticket.mediaAttachments?.length > 0 && (
                        <div>
                          <h3 className="text-base font-medium mb-2">
                            Attached File
                          </h3>
                          <div className="flex">
                            {ticket.mediaAttachments.map((media, index) => (
                              <div
                                className="mr-1 w-16 h-16 rounded-md overflow-auto border border-neutral-300"
                                key={media._id}
                                role="button"
                                tabIndex={0}
                                onKeyDown={() => {}}
                                onClick={() => handleImageOpen(index)}
                              >
                                <img
                                  src={media.url}
                                  alt={`${ticket?.title}-${index}`}
                                  className="h-full w-full object-cover object-center"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col p-4 md:flex-row">
                    <div className="mb-4 w-full md:w-1/2">
                      <h4 className="text-base font-medium mb-2">
                        Submitted By
                      </h4>
                      <div>
                        <p className="font-medium text-black">
                          {`Unit ${ticket?.unit?.name}, ${ticket?.building?.name}`}
                        </p>
                        <p>
                          <Link
                            href={`/residents/view/${ticket?.reporter?._id}`}
                          >
                            <span className="text-secondary-500 cursor-pointer hover:underline">
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
                    <div className="w-full md:w-1/2">
                      <h4 className="text-base font-medium mb-2">
                        Staff in this ticket
                      </h4>
                      {issue?.getIssue?.issue?.assignee?.length > 0 ? (
                        <div className="flex">
                          <AssignedStaffs
                            staffs={issue.getIssue.issue.assignee}
                          />
                          <EmptyStaff
                            withText
                            onClick={() => setShowAddStaffModal(old => !old)}
                          />
                        </div>
                      ) : (
                        <EmptyStaff
                          withText
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
                <Tabs.TabLabel id="2">Activity History</Tabs.TabLabel>
              </Tabs.TabLabels>
              <Tabs.TabPanels>
                <Tabs.TabPanel id="1">
                  <Comments
                    data={ticketComments}
                    loading={loadingComments}
                    onEnterComment={handleEnterComment}
                    onLoadMore={handleMoreComment}
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
        options={staffOptions || []}
        onCancel={handleAddStaff}
        onOk={handleAddStaffSubmit}
        onSelectStaff={setSelectedStaff}
        selectedStaff={selectedStaff}
      />
      <LightBox
        isOpen={imageOpen}
        images={imageLists}
        imageIndex={imageIndex}
        onClick={handleImageIndex}
        onClose={handleImageClose}
      />
    </section>
  )
}

export default Ticket
