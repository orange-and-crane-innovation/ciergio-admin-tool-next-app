import { useState, useMemo, useCallback, useEffect } from 'react'
import { useLazyQuery, useQuery, useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import P from 'prop-types'

import PrimaryDataTable from '@app/components/globals/PrimaryDataTable'
import Dropdown from '@app/components/dropdown'
import Checkbox from '@app/components/forms/form-checkbox'
import Button from '@app/components/button'
import Modal from '@app/components/modal'
import Table from '@app/components/table'
import { Card } from '@app/components/globals'

import { friendlyDateTimeFormat, toFriendlyDate } from '@app/utils/date'
import showToast from '@app/utils/toast'

import { FaPlusCircle, FaEye } from 'react-icons/fa'
import { AiOutlineEllipsis } from 'react-icons/ai'
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

const getNotifDate = (type, notif) => {
  switch (type) {
    case UPCOMING:
      return notif.publishedNextAt
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
  selectedData,
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
    if (calledBulk && dataBulk) {
      if (dataBulk?.bulkUpdatePost?.message === 'success') {
        const allCheck = document.getElementsByName('checkbox_select_all')[0]
        const itemsCheck = document.getElementsByName('checkbox')

        if (allCheck.checked) {
          allCheck.click()
        }

        for (let i = 0; i < itemsCheck.length; i++) {
          if (itemsCheck[i].checked) {
            itemsCheck[i].click()
          }
        }

        setIsBulkDisabled(true)
        setIsBulkButtonDisabled(true)
        setSelectedBulk('')

        showToast('success', `You have successfully updated a post`)
        refetchNotifications()
      } else {
        showToast('danger', `Bulk update failed`)
      }
    }
  }, [
    calledBulk,
    dataBulk,
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

  const onLimitChange = e => setCurrentLimit(Number(e.target.value))

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
                date: toFriendlyDate(notifDate),
                title: (
                  <div>
                    <p className="text-base">{notif.title}</p>
                    <p className="text-sm">
                      <span
                        className="text-blue-600 cursor-pointer"
                        onClick={() => {
                          setSelectedNotifId(notif._id)
                          setPreviewNotification(old => !old)
                        }}
                        role="button"
                        tabIndex={0}
                        onKeyDown={() => {}}
                      >
                        View
                      </span>{' '}
                      |{' '}
                      <span
                        className="text-red-600 cursor-pointer"
                        onClick={() => {
                          setSelectedNotif(notif)
                          setShowTrashModal(old => !old)
                        }}
                        role="button"
                        tabIndex={0}
                        onKeyDown={() => {}}
                      >
                        {type === TRASHED
                          ? 'Delete Permanent'
                          : 'Move to Trash'}
                      </span>
                    </p>
                  </div>
                ),
                category: notif?.category?.name || '--',
                dropdown: (
                  <Dropdown
                    label={<AiOutlineEllipsis />}
                    items={dropdownData}
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
                  date: `${toFriendlyDate(p?.date)} - ${friendlyDateTimeFormat(
                    p?.date,
                    'LT'
                  )}`,
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
                  icon: <span className="ciergio-employees" />,
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
                  <Dropdown
                    label={<AiOutlineEllipsis />}
                    items={dropdownData}
                  />
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

  return (
    <>
      <Card
        title={
          <div className="flex items-center justify-between bg-white">
            <h1 className="font-bold text-base px-8 py-4 capitalize">{`${type} Notifications (${ITEM_COUNT})`}</h1>
          </div>
        }
        actions={[
          <Button
            primary
            leftIcon={<FaPlusCircle />}
            label="Create Notifications"
            onClick={goToCreate}
            className="mr-4 mt-4"
            key={`${type}-btn`}
          />
        ]}
        noPadding
        content={
          <PrimaryDataTable
            columns={columnsWithCheckbox}
            data={notificationsData}
            loading={loadingNotifications}
            currentPage={activePage}
            onPageChange={onPageClick}
            onPageLimitChange={onLimitChange}
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
        cancelText="No"
        okText="Yes"
        visible={showTrashModal}
        onCancel={() => setShowTrashModal(old => !old)}
        onOk={handleTrashNotification}
        okButtonProps={{
          loading: movingToTrash || deletingNotification
        }}
        width={450}
      >
        <div className="p-8">
          <p className="text-xl text-gray-600">
            {` Do you want to ${
              type === 'trashed' ? 'delete permanently' : 'move to trash'
            } a notification: ${selectedNotif?.title}?`}
          </p>
        </div>
      </Modal>
      <Modal
        title="Edit History"
        visible={showEditHistoryModal}
        onClose={() => setShowEditHistoryModal(old => !old)}
        footer={null}
        width={650}
        loading={loadingPostHistory}
      >
        <div className="p-4">
          <div className="w-full flex justify-start items-center mb-8">
            <div className="w-1/2">
              <h4 className="text-base">Date Created</h4>
              <p className="font-medium text-base">
                {friendlyDateTimeFormat(POST_HISTORY?.post?.[0]?.date, 'll')}
              </p>
            </div>
            <div className="w-1/2">
              <h4 className="text-base">Created By</h4>
              <div className="flex items-center">
                <img
                  src={`https://ui-avatars.com/api/?name=${PARSED_JSON_HISTORY?.authorName}&rounded=true&size=25`}
                  alt="avatar"
                  className="max-w-sm"
                />
                <p className="font-medium text-base ml-2">
                  {PARSED_JSON_HISTORY?.authorName}
                </p>
              </div>
            </div>
          </div>
          <Table
            rowNames={modalColumns}
            items={editHistoryData}
            emptyText={
              <div className="p-4">
                <BsFillClockFill className="ciergio-employees text-gray-500 text-7xl" />
                <p className="text-gray-500">{`No history yet.`}</p>
              </div>
            }
          />
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
          <div className="w-full flex justify-start items-center mb-8">
            <div className="w-1/2">
              <h4 className="text-base">Viewed By</h4>
              <p className="font-medium text-sm">
                {`${VIEWS_HISTORY?.count?.uniqViews || 0} `}
                <span className="text-gray-600">users</span>
              </p>
            </div>
            <div className="w-1/2">
              <h4 className="text-base">Not Viewed By</h4>
              <p className="font-bold text-sm">
                {`${
                  VIEWS_HISTORY?.count?.audience -
                    VIEWS_HISTORY?.count?.uniqViews || 0
                } `}
                <span className="text-gray-600">users</span>
              </p>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-xl">View History</h4>
            <Table
              rowNames={[
                { name: '', width: '5%' },
                { name: '', width: '90%' },
                {
                  name: '',
                  width: '5%'
                }
              ]}
              items={viewsHistoryData}
              emptyText={
                <div className="p-4">
                  <span className="ciergio-employees text-gray-500 text-7xl" />
                  <p className="text-gray-500 font-bold text-base">
                    No viewer yet.
                  </p>
                  <p className="text-gray-500">
                    {`Sorry, this post don't have any viewer yet.`}
                  </p>
                </div>
              }
            />
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
  calledBulk: P.bool,
  dataBulk: P.object,
  setSelectedData: P.func,
  setSelectedBulk: P.func,
  setIsBulkDisabled: P.func,
  setIsBulkButtonDisabled: P.func
}

export default Notifications