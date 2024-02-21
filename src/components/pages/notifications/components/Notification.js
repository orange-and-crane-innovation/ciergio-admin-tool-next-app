import { useState, useMemo, useCallback, useEffect } from 'react'
import { useLazyQuery, useQuery, useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import Link from 'next/link'
import P from 'prop-types'
import { FaPlusCircle, FaEye, FaEllipsisH } from 'react-icons/fa'
import { FiFileText } from 'react-icons/fi'

import PrimaryDataTable from '@app/components/globals/PrimaryDataTable'
import Dropdown from '@app/components/dropdown'
import Checkbox from '@app/components/forms/form-checkbox'
import Button from '@app/components/button'
import Modal from '@app/components/modal'
import Table from '@app/components/table'
import { Card } from '@app/components/globals'
import NotifCard from '@app/components/globals/NotifCard'

import {
  friendlyDateTimeFormat,
  toFriendlyShortDateTime
} from '@app/utils/date'
import showToast from '@app/utils/toast'

import { BsFillClockFill } from 'react-icons/bs'

import {
  UPCOMING,
  PUBLISHED,
  DRAFT,
  TRASHED,
  upcomingTableRows,
  publishedTableRows,
  otherTableRows,
  modalColumns
} from '../constants'

import {
  GET_NOTIFICATION,
  TRASH_NOTIFICATION,
  GET_POST_HISTORY,
  GET_VIEW_HISTORY,
  DELETE_NOTIFICATION
} from '../queries'
import PreviewModal from './PreviewModal'
import RecurringType from './RecurringType'
import Can from '@app/permissions/can'

const getNotifDate = (type, notif) => {
  switch (type) {
    case UPCOMING:
      return notif.publishedAt
    case PUBLISHED:
      return notif.publishedAt
    case DRAFT:
    case TRASHED:
      return notif.updatedAt
    default:
      return null
  }
}

function Notifications({
  type,
  categoryId,
  searchText,
  query,
  dataBulk,
  calledBulk,
  resetBulk,
  selectedData,
  selectedBulk,
  setSelectedData,
  setIsBulkButtonDisabled,
  setIsBulkDisabled,
  setSelectedBulk
}) {
  const router = useRouter()
  const [currentLimit, setCurrentLimit] = useState(10)
  const [currentOffset, setCurrentOffset] = useState(0)
  const [activePage, setActivePage] = useState(1)
  const [previewNotification, setPreviewNotification] = useState(false)
  const [showTrashModal, setShowTrashModal] = useState(false)
  const [selectedNotifId, setSelectedNotifId] = useState(null)
  const [selectedNotif, setSelectedNotif] = useState(null)
  const [showEditHistoryModal, setShowEditHistoryModal] = useState(false)
  const [viewHistory, setViewHistory] = useState(false)

  const {
    data: notifications,
    loading: loadingNotifications,
    error: errorNotifications,
    refetch: refetchNotifications
  } = useQuery(query, {
    variables: {
      limit: currentLimit,
      offset: currentOffset,
      categoryId,
      search: searchText
    }
  })

  const [
    getNotifPreview,
    { data: notifPreview, loading: loadingNotifPreview }
  ] = useLazyQuery(GET_NOTIFICATION, {
    fetchPolicy: 'network-only',
    variables: {
      id: selectedNotifId
    }
  })

  const [
    getViewsHistory,
    { data: views, loading: loadingViewHistory }
  ] = useLazyQuery(GET_VIEW_HISTORY, {
    variables: {
      id: selectedNotifId
    }
  })

  const [
    getPostHistory,
    { data: postHistory, loading: loadingPostHistory }
  ] = useLazyQuery(GET_POST_HISTORY, {
    variables: {
      id: selectedNotifId
    }
  })

  const [moveToTrash, { loading: movingToTrash }] = useMutation(
    TRASH_NOTIFICATION,
    {
      onCompleted: () => {
        setShowTrashModal(old => !old)
        showToast(
          'success',
          'You have succesfully move to trash a notification.'
        )
        refetchNotifications()
      }
    }
  )

  const [deletePermanently, { loading: deletingNotification }] = useMutation(
    DELETE_NOTIFICATION,
    {
      onCompleted: () => {
        setShowTrashModal(old => !old)
        showToast('success', 'You have succesfully deleted a notification.')
        refetchNotifications()
      }
    }
  )

  const ITEM_COUNT = notifications?.getAllFlashNotifications?.count || 0
  const NOTIFICATIONS = notifications?.getAllFlashNotifications
  const PREVIEW_NOTIFICATION = notifPreview?.getAllFlashNotifications.post[0]
  const POST_HISTORY = postHistory?.getPostHistory
  const VIEWS_HISTORY = views?.getPostViewsHistory?.data
  const PARSED_JSON_HISTORY =
    POST_HISTORY?.post?.length > 0
      ? JSON.parse(POST_HISTORY.post[0].data)
      : undefined

  useEffect(() => {
    router.replace(`/notifications/list/${type}`)
    refetchNotifications()
  }, [])

  useEffect(() => {
    setActivePage(1)
    setCurrentOffset(0)
  }, [searchText])

  useEffect(() => {
    if (errorNotifications) {
      errorHandler(errorNotifications)
    }
  }, [errorNotifications])

  useEffect(() => {
    if (calledBulk && dataBulk) {
      if (dataBulk?.bulkUpdatePost?.message === 'success') {
        const allCheck = document.getElementsByName('checkbox_select_all')[0]
        const itemsCheck = document.getElementsByName('checkbox')
        let message

        if (allCheck?.checked) {
          allCheck.click()
        }

        for (let i = 0; i < itemsCheck.length; i++) {
          if (itemsCheck[i].checked) {
            itemsCheck[i].click()
          }
        }

        setIsBulkDisabled(true)
        setIsBulkButtonDisabled(true)
        setSelectedBulk(null)

        switch (selectedBulk) {
          case 'unpublished':
            message = `You have successfully unpublished (${selectedData?.length}) items.`
            break
          case 'trashed':
            message = `You have successfully sent (${selectedData?.length}) items to the trash.`
            break
          case 'deleted':
            message = `You have successfully deleted (${selectedData?.length}) items.`
            break
          case 'draft':
            message = `You have successfully restored (${selectedData?.length}) items.`
            break
          default:
            message = `You have successfully updated a post.`
            break
        }

        showToast('success', message)
        refetchNotifications()
      } else {
        showToast('danger', `Bulk update failed`)
      }
      resetBulk()
    }
  }, [
    calledBulk,
    dataBulk,
    resetBulk,
    refetchNotifications,
    setIsBulkButtonDisabled,
    setIsBulkDisabled,
    setSelectedBulk
  ])

  useEffect(() => {
    if (selectedNotifId !== null) {
      if (previewNotification) {
        getNotifPreview()
      }
      if (showEditHistoryModal) {
        getPostHistory()
      }
      if (viewHistory) {
        getViewsHistory()
      }
    }
  }, [
    selectedNotifId,
    getNotifPreview,
    previewNotification,
    showEditHistoryModal,
    getPostHistory,
    viewHistory,
    getViewsHistory
  ])

  const handleTrashNotification = () => {
    if (type === 'trashed') {
      deletePermanently({
        variables: {
          id: selectedNotif._id
        }
      })
    } else {
      moveToTrash({
        variables: {
          id: selectedNotif._id
        }
      })
    }
  }

  const onCheckAll = useCallback(
    e => {
      const checkboxes = document.getElementsByName('checkbox')

      setSelectedBulk('')
      setIsBulkDisabled(true)
      setIsBulkButtonDisabled(true)

      for (let i = 0; i < checkboxes.length; i++) {
        const data = checkboxes[i].getAttribute('data-id')
        if (e.target.checked) {
          if (!selectedData.includes(data)) {
            setSelectedData(prevState => [...prevState, data])
          }
          checkboxes[i].checked = true
          setIsBulkDisabled(false)
        } else {
          setSelectedData(prevState => [
            ...prevState.filter(item => item !== data)
          ])
          checkboxes[i].checked = false
        }
      }
    },
    [
      selectedData,
      setIsBulkButtonDisabled,
      setIsBulkDisabled,
      setSelectedBulk,
      setSelectedData
    ]
  )

  const onCheck = useCallback(
    e => {
      const data = e.target.getAttribute('data-id')
      const allCheck = document.getElementsByName('checkbox_select_all')[0]
      const checkboxes = document.querySelectorAll(
        'input[name="checkbox"]:checked'
      )

      if (e.target.checked) {
        if (!selectedData.includes(data)) {
          setSelectedData(prevState => [...prevState, data])
        }
        setIsBulkDisabled(false)
      } else {
        setSelectedData(prevState => [
          ...prevState.filter(item => item !== data)
        ])
        if (checkboxes.length === 0) {
          setSelectedBulk('')
          setIsBulkDisabled(true)
          setIsBulkButtonDisabled(true)
        }
      }

      if (checkboxes.length === currentLimit) {
        allCheck.checked = true
      } else {
        allCheck.checked = false
      }
    },
    [
      currentLimit,
      selectedData,
      setIsBulkButtonDisabled,
      setIsBulkDisabled,
      setSelectedBulk,
      setSelectedData
    ]
  )

  const goToCreate = () => router.push('/notifications/create')

  const onPageClick = e => {
    setActivePage(e)
    setCurrentOffset(e * currentLimit)
  }

  const onLimitChange = e => setCurrentLimit(e)

  const notificationsData = useMemo(() => {
    return {
      limit: NOTIFICATIONS?.limit || 0,
      offset: NOTIFICATIONS?.offset || 0,
      count: NOTIFICATIONS?.count || 0,
      data:
        NOTIFICATIONS?.post?.length > 0
          ? NOTIFICATIONS?.post?.map(notif => {
              const dropdownData = [
                {
                  label: 'Edit History',
                  icon: <span className="ciergio-edit" />,
                  function: () => {
                    setSelectedNotifId(notif._id)
                    setShowEditHistoryModal(old => !old)
                  }
                },
                {
                  label: 'View History',
                  icon: <FaEye />,
                  function: () => {
                    setSelectedNotifId(notif._id)
                    setViewHistory(old => !old)
                  }
                }
              ]

              const notifDate = getNotifDate(type, notif)

              return {
                checkbox: (
                  <Checkbox
                    primary
                    id={`checkbox-${notif._id}`}
                    name="checkbox"
                    data-id={notif._id}
                    onChange={onCheck}
                  />
                ),
                date: (
                  <span>
                    {toFriendlyShortDateTime(notifDate)}{' '}
                    <RecurringType
                      publishedAt={notif?.publishedAt}
                      recurringData={notif?.recurringSchedule}
                    />
                  </span>
                ),
                title: (
                  <div>
                    <p className="text-base">{notif.title}</p>
                    <p className="text-sm">
                      {(type === DRAFT || type === UPCOMING) && (
                        <Can
                          perform="notifications:update"
                          yes={
                            <>
                              <Link legacyBehavior href={`/notifications/edit/${notif._id}`}>
                                <a className="text-blue-600 hover:underline">
                                  Edit
                                </a>
                              </Link>
                              {' | '}
                            </>
                          }
                        />
                      )}
                      <Can
                        perform="notifications:view"
                        yes={
                          <>
                            <span
                              className="text-blue-600 cursor-pointer hover:underline"
                              onClick={() => {
                                setSelectedNotifId(notif._id)
                                setPreviewNotification(old => !old)
                              }}
                              role="button"
                              tabIndex={0}
                              onKeyDown={() => {}}
                            >
                              View
                            </span>
                            {' | '}
                          </>
                        }
                      />
                      <Can
                        perform="notifications:trash"
                        yes={
                          <span
                            className="text-red-600 cursor-pointer hover:underline"
                            onClick={() => {
                              setSelectedNotif(notif)
                              setShowTrashModal(old => !old)
                            }}
                            role="button"
                            tabIndex={0}
                            onKeyDown={() => {}}
                          >
                            {type === TRASHED
                              ? 'Permanently Delete'
                              : 'Move to Trash'}
                          </span>
                        }
                      />
                    </p>
                  </div>
                ),
                category: notif?.category?.name || 'Uncategorized',
                dropdown: (
                  <Can
                    perform="notifications:view::update"
                    yes={
                      <Dropdown label={<FaEllipsisH />} items={dropdownData} />
                    }
                  />
                )
              }
            })
          : []
    }
  }, [NOTIFICATIONS, onCheck, type])

  const editHistoryData = useMemo(() => {
    return {
      count: 1,
      limit: 1,
      offset: 0,
      data:
        POST_HISTORY?.post?.length > 0
          ? POST_HISTORY?.post?.map(p => {
              if (p !== undefined) {
                const parsedData = JSON.parse(p.data)
                return {
                  date: toFriendlyShortDateTime(p?.date),
                  editBy: `${parsedData?.authorName} published a notification: ${parsedData?.title}`
                }
              }

              return null
            })
          : []
    }
  }, [POST_HISTORY])

  const viewsHistoryData = useMemo(() => {
    return {
      count: 0,
      limit: 10,
      offset: 0,
      data:
        VIEWS_HISTORY?.user?.length > 0
          ? VIEWS_HISTORY.user.map(usr => {
              if (!usr) return null

              const { avatar, firstName, lastName, address } = usr

              const dropdownData = [
                {
                  label: 'View User',
                  icon: <span className="ciergio-user" />,
                  function: () => {}
                }
              ]

              return {
                avatar: <img src={avatar} alt="avatar" />,
                name: (
                  <div>
                    <p>{`${firstName} ${lastName}`}</p>
                    <p>
                      {address !== undefined
                        ? `${address?.line2 || ''} ${address?.line1 || ''}`
                        : 'No address provided'}
                    </p>
                  </div>
                ),
                dropdown: (
                  <Dropdown label={<FaEllipsisH />} items={dropdownData} />
                )
              }
            })
          : []
    }
  }, [VIEWS_HISTORY])

  const columnsWithCheckbox = useMemo(() => {
    switch (type) {
      case UPCOMING:
        return [
          {
            name: (
              <Checkbox
                primary
                id="checkbox_select_all"
                name="checkbox_select_all"
                onChange={e => onCheckAll(e)}
              />
            ),
            width: '5%'
          },
          ...upcomingTableRows
        ]
      case PUBLISHED:
        return [
          {
            name: (
              <Checkbox
                primary
                id="checkbox_select_all"
                name="checkbox_select_all"
                onChange={e => onCheckAll(e)}
              />
            ),
            width: '5%'
          },
          ...publishedTableRows
        ]
      case DRAFT:
      case TRASHED:
        return [
          {
            name: (
              <Checkbox
                primary
                id="checkbox_select_all"
                name="checkbox_select_all"
                onChange={e => onCheckAll(e)}
              />
            ),
            width: '5%'
          },
          ...otherTableRows
        ]
      default:
        return []
    }
  }, [onCheckAll, type])

  const errorHandler = data => {
    const errors = JSON.parse(JSON.stringify(data))

    if (errors) {
      const { graphQLErrors, networkError, message } = errors
      if (graphQLErrors)
        graphQLErrors.map(({ message, locations, path }) =>
          showToast('danger', message)
        )

      if (networkError?.result?.errors) {
        showToast('danger', errors?.networkError?.result?.errors[0]?.message)
      }

      if (
        message &&
        graphQLErrors?.length === 0 &&
        !networkError?.result?.errors
      ) {
        showToast('danger', message)
      }
    }
  }

  return (
    <>
      <Card
        title={
          <h1 className="font-bold text-base px-4 py-4 capitalize">
            {searchText
              ? `Search result for "${searchText}" (${ITEM_COUNT || 0})`
              : `${type} Notifications (${ITEM_COUNT || 0})`}
          </h1>
        }
        actions={[
          <Can
            key="create"
            perform="notifications:create"
            yes={
              <Button
                primary
                leftIcon={<FaPlusCircle />}
                label="Create Notification"
                onClick={goToCreate}
                className="mr-4 mt-4"
                key={`${type}-btn`}
              />
            }
            no={
              <Button
                primary
                leftIcon={<FaPlusCircle />}
                label="Create Notification"
                className="mr-4 mt-4"
                key={`${type}-btn`}
                disabled
              />
            }
          />
        ]}
        noPadding
        content={
          <PrimaryDataTable
            columns={columnsWithCheckbox}
            data={notificationsData}
            loading={loadingNotifications}
            currentPage={activePage}
            setCurrentPage={onPageClick}
            setPageOffset={setCurrentOffset}
            setPageLimit={onLimitChange}
            pageLimit={currentLimit}
            emptyText={
              <NotifCard
                icon={<FiFileText />}
                header="You haven’t created a notification yet"
                content="Notifications are a great way to share information with your members. Create one now!"
              />
            }
          />
        }
        className="rounded-t-none"
      />
      <PreviewModal
        showPreview={previewNotification}
        onClose={() => setPreviewNotification(old => !old)}
        previewData={PREVIEW_NOTIFICATION}
        loading={loadingNotifPreview}
      />
      <Modal
        title={type === 'trashed' ? 'Delete Permanently' : 'Move to Trash'}
        cancelText="No"
        okText={
          type === 'trashed' ? 'Yes, delete permanently' : 'Yes, move to trash'
        }
        visible={showTrashModal}
        onClose={() => setShowTrashModal(old => !old)}
        onCancel={() => setShowTrashModal(old => !old)}
        onOk={handleTrashNotification}
        okButtonProps={{
          loading: movingToTrash || deletingNotification
        }}
        width={450}
      >
        <div className="pb-4">
          <p className="text-base">
            {`Do you want to `}
            <strong>
              {type === 'trashed' ? 'delete permanently' : 'move to trash'}
            </strong>
            {` a notification: `}
            <strong>{selectedNotif?.title}</strong>?
          </p>
        </div>
      </Modal>
      <Modal
        title="Edit History"
        visible={showEditHistoryModal}
        onClose={() => setShowEditHistoryModal(old => !old)}
        onCancel={() => setShowEditHistoryModal(old => !old)}
        footer={null}
        width={850}
        loading={loadingPostHistory}
      >
        <div className="p-4">
          <div className="w-full flex justify-start items-start mb-8">
            <div className="w-1/2">
              <h4 className="text-base leading-5 mb-2">Date Created</h4>
              <p className="font-medium text-base">
                {friendlyDateTimeFormat(POST_HISTORY?.post?.[0]?.date, 'll')}
              </p>
            </div>
            <div className="w-1/2">
              <h4 className="text-base leading-5 mb-2">Created By</h4>
              <div className="flex items-center">
                <img
                  src={`https://ui-avatars.com/api/?name=${PARSED_JSON_HISTORY?.authorName}&rounded=true&size=16`}
                  alt="avatar"
                  className="max-w-sm"
                />
                <span className="font-medium text-base ml-2">
                  {PARSED_JSON_HISTORY?.authorName}
                </span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-base mb-4">Edit History</h4>
            <div className="-mx-8">
              <Table
                rowNames={modalColumns}
                items={editHistoryData}
                emptyText={
                  <div className="p-4">
                    <BsFillClockFill className="ciergio-user text-gray-500 text-7xl" />
                    <p className="text-gray-500">{`No history yet.`}</p>
                  </div>
                }
              />
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        title="View History"
        visible={viewHistory}
        loading={loadingViewHistory}
        width={650}
        onClose={() => setViewHistory(old => !old)}
        footer={null}
      >
        <div className="p-4">
          <div className="w-full flex justify-start items-start mb-8">
            <div className="w-1/2">
              <h4 className="text-base leading-5 mb-2">Viewed By</h4>
              <p className="font-medium text-base">
                {`${VIEWS_HISTORY?.count?.uniqViews || 0} `}
                <span className="text-neutral-500">users</span>
              </p>
            </div>
            <div className="w-1/2">
              <h4 className="text-base leading-5 mb-2">Not Viewed By</h4>
              <p className="font-medium text-base">
                {`${
                  VIEWS_HISTORY?.count?.audience -
                    VIEWS_HISTORY?.count?.uniqViews || 0
                } `}
                <span className="text-neutral-500">users</span>
              </p>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-base mb-4">View History</h4>
            <div className="-mx-8">
              <Table
                items={viewsHistoryData}
                emptyText={
                  <NotifCard
                    icon={<i className="ciergio-user" />}
                    header="No viewer yet"
                    content="Sorry, this post don't have any viewer yet."
                  />
                }
              />
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}

Notifications.propTypes = {
  type: P.string,
  searchText: P.string,
  categoryId: P.string,
  query: P.object,
  selectedData: P.array,
  selectedBulk: P.string,
  calledBulk: P.bool,
  dataBulk: P.object,
  resetBulk: P.func,
  setSelectedData: P.func,
  setSelectedBulk: P.func,
  setIsBulkDisabled: P.func,
  setIsBulkButtonDisabled: P.func
}

export default Notifications
