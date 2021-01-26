import { useState, useMemo } from 'react'
import { useQuery } from '@apollo/client'
import P from 'prop-types'

import Header from '../common/Header'
import Table from '@app/components/table'
import Dropdown from '@app/components/dropdown'
import Pagination from '@app/components/pagination'
import { Card } from '@app/components/globals'

import { initializeApollo } from '@app/lib/apollo/client'

import { FaEye } from 'react-icons/fa'
import { AiOutlineEllipsis } from 'react-icons/ai'

import { GET_ALL_NOTIFICATIONS } from '../queries'
import { upcomingTableRows } from '../list/options'

function Notifications({ type }) {
  const [currentLimit, setCurrentLimit] = useState(10)
  const [currentOffset, setCurrentOffset] = useState(0)
  const [activePage, setActivePage] = useState(1)

  const { data: notifications, loading: loadingNotifications } = useQuery(
    GET_ALL_NOTIFICATIONS,
    {
      variables: {
        limit: currentLimit,
        offset: currentOffset
      }
    }
  )

  const onPageClick = e => {
    setActivePage(e)
    setCurrentOffset(e * currentLimit)
  }

  const onLimitChange = e => {
    setCurrentLimit(Number(e.target.value))
  }

  const notificationsData = useMemo(() => {
    const notifData = notifications?.getAllFlashNotifications?.post
    return {
      limit: notifData?.limit || 0,
      offset: notifData?.offset || 0,
      count: notifData?.count || 0,
      data:
        notifData?.length > 0
          ? notifData?.map(notif => {
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

              return {
                checkbox: '',
                scheduled: '',
                title: notif?.title,
                category: notif?.category.name,
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
  }, [notifications?.getAllFlashNotifications])

  return (
    <>
      <Header title={`Upcoming Notifications (0)`} />
      <Card
        noPadding
        content={
          <>
            <Table
              rowNames={upcomingTableRows}
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
  type: P.string
}

export async function getStaticProps() {
  const apolloClient = initializeApollo()

  await apolloClient.query({
    query: GET_ALL_NOTIFICATIONS,
    variables: {
      limit: 10,
      offset: 0
    }
  })

  return {
    props: {
      initialApolloState: apolloClient.cache.extract()
    }
  }
}

export default Notifications
