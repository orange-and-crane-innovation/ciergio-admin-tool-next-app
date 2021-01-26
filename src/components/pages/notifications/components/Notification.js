import { useState, useMemo } from 'react'
import { useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import P from 'prop-types'

import Table from '@app/components/table'
import Dropdown from '@app/components/dropdown'
import Pagination from '@app/components/pagination'
import Checkbox from '@app/components/forms/form-checkbox'
import Button from '@app/components/button'
import { Card } from '@app/components/globals'

import { FaPlusCircle, FaEye } from 'react-icons/fa'

import { AiOutlineEllipsis } from 'react-icons/ai'

import { toFriendlyDate } from '@app/utils/date'

import {
  upcomingTableRows,
  publishedTableRows,
  otherTableRows
} from '../list/options'

import { UPCOMING, PUBLISHED, DRAFT, TRASHED } from '../constants'

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

  const goToCreate = () => router.push('/notifications/create')

  const onPageClick = e => {
    setActivePage(e)
    setCurrentOffset(e * currentLimit)
  }

  const onLimitChange = e => {
    setCurrentLimit(Number(e.target.value))
  }

  const notificationsData = useMemo(() => {
    const notifData = notifications?.getAllFlashNotifications

    return {
      limit: notifData?.limit || 0,
      offset: notifData?.offset || 0,
      count: notifData?.count || 0,
      data:
        notifData?.post?.length > 0
          ? notifData?.post?.map(notif => {
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
  }, [notifications?.getAllFlashNotifications, type])

  const columnsWithCheckbox = useMemo(() => {
    if (type === UPCOMING) {
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
    }
    if (type === PUBLISHED) {
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
    }
    if (type === DRAFT || type === TRASHED) {
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
    }

    return []
  }, [type])

  return (
    <>
      <Card
        title={
          <div className="flex items-center justify-between bg-white">
            <h1 className="font-bold text-base px-8 py-4 capitalize">{`${type} Notifications (${notifications?.getAllFlashNotifications?.count})`}</h1>
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
          <>
            <Table
              rowNames={columnsWithCheckbox}
              items={notificationsData}
              loading={loadingNotifications}
            />
            {!loadingNotifications && notificationsData && (
              <div className="px-8">
                <Pagination
                  items={notificationsData}
                  activePage={activePage}
                  onPageClick={onPageClick}
                  onLimitChange={onLimitChange}
                />
              </div>
            )}
          </>
        }
        className="rounded-t-none"
      />
    </>
  )
}

Notifications.propTypes = {
  type: P.string,
  query: P.string
}

export default Notifications
