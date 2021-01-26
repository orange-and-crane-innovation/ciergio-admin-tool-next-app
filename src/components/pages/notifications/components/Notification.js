import { useState, useMemo } from 'react'
import { useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import P from 'prop-types'

import PrimaryDataTable from '@app/components/globals/PrimaryDataTable'
import Dropdown from '@app/components/dropdown'
import Checkbox from '@app/components/forms/form-checkbox'
import Button from '@app/components/button'
import { Card } from '@app/components/globals'

import { toFriendlyDate } from '@app/utils/date'

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

function Notifications({ type, query }) {
  const router = useRouter()

  const [currentLimit, setCurrentLimit] = useState(10)
  const [currentOffset, setCurrentOffset] = useState(0)
  const [activePage, setActivePage] = useState(1)

  const { data: notifications, loading: loadingNotifications } = useQuery(
    query,
    {
      variables: {
        limit: currentLimit,
        offset: currentOffset
      }
    }
  )

  const ITEM_COUNT = notifications?.getAllFlashNotifications?.count
  const NOTIFICATIONS = notifications?.getAllFlashNotifications

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
                    // onChange={onCheck}
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
  }, [NOTIFICATIONS, type])

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
                // onChange={e => onCheckAll(e)}
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
                // onChange={e => onCheckAll(e)}
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
                // onChange={e => onCheckAll(e)}
              />
            ),
            width: '5%'
          },
          ...otherTableRows
        ]
      default:
        return []
    }
  }, [type])

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
  query: P.string
}

export default Notifications
