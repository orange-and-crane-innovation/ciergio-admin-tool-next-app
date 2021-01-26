import { useState, useMemo, useCallback, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import P from 'prop-types'

import PrimaryDataTable from '@app/components/globals/PrimaryDataTable'
import Dropdown from '@app/components/dropdown'
import Checkbox from '@app/components/forms/form-checkbox'
import Button from '@app/components/button'
import { Card } from '@app/components/globals'

import { toFriendlyDate } from '@app/utils/date'
import showToast from '@app/utils/toast'

import { FaPlusCircle, FaEye } from 'react-icons/fa'
import { AiOutlineEllipsis } from 'react-icons/ai'

import {
  UPCOMING,
  PUBLISHED,
  DRAFT,
  TRASHED,
  upcomingTableRows,
  publishedTableRows,
  otherTableRows
} from '../constants'

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

  const {
    data: notifications,
    loading: loadingNotifications,
    refetch: refetchNotifications
  } = useQuery(query, {
    variables: {
      limit: currentLimit,
      offset: currentOffset
    }
  })

  const ITEM_COUNT = notifications?.getAllFlashNotifications?.count || 0
  const NOTIFICATIONS = notifications?.getAllFlashNotifications

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
                  function: () => {}
                },
                {
                  label: 'View History',
                  icon: <FaEye />,
                  function: () => {}
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
                      <span className="text-blue-600 cursor-pointer">View</span>{' '}
                      |{' '}
                      <span className="text-red-600 cursor-pointer">
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
  )
}

Notifications.propTypes = {
  type: P.string,
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
