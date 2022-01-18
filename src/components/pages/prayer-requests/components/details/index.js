import { useMemo, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useQuery, useMutation } from '@apollo/client'
import Link from 'next/link'
import Tabs from '@app/components/tabs'
import Table from '@app/components/table'
import { Card } from '@app/components/globals'
import {
  toFriendlyDate,
  friendlyDateTimeFormat,
  toFriendlyTime
} from '@app/utils/date'
import isEmpty from 'lodash/isEmpty'
import {
  GET_PRAYER_REQUEST_DETAILS,
  GET_PRAYER_REQUEST_HISTORY,
  UPDATE_PRAYER_REQUEST
} from '../../queries'
import errorHandler from '@app/utils/errorHandler'

import PageLoader from '@app/components/page-loader'

const columns = [
  {
    name: 'Date & Time',
    width: ''
  },
  {
    name: 'User',
    width: ''
  },
  {
    name: 'Activity',
    width: ''
  }
]

export default function PrayerRequestDetails() {
  const router = useRouter()
  const id = router?.query?.id
  const complexId = router?.query?.complexId
  const [updatePrayerRequest] = useMutation(UPDATE_PRAYER_REQUEST)

  const { data: details, loading } = useQuery(GET_PRAYER_REQUEST_DETAILS, {
    variables: {
      id
    },
    onError: error => {
      errorHandler(error)
    }
  })
  const pr = details?.getIssue?.issue
  const unread = isEmpty(pr?.readAt)

  const { data: history } = useQuery(GET_PRAYER_REQUEST_HISTORY, {
    variables: {
      id,
      limit: 10,
      offset: 0,
      sort: -1
    }
  })

  useEffect(() => {
    if (pr && unread) {
      const now = new Date().toISOString()
      updatePrayerRequest({
        variables: {
          id,
          data: {
            readAt: now
          }
        }
      })
    }
  }, [pr, unread])

  const prHistory = history?.getIssue?.issue?.history
  const prayerRequestHistoryDate = useMemo(() => {
    return {
      count: prHistory?.count || 0,
      limit: prHistory?.limit || 10,
      data:
        prHistory?.count > 0
          ? prHistory?.data.map(h => {
              const { firstName, lastName } = h.by.user
              return {
                dateCreated: friendlyDateTimeFormat(
                  h.createdAt,
                  'MMMM DD YYYY - HH:MM A'
                ),
                user: `${firstName} ${lastName}`,
                activity: h.activity
              }
            })
          : []
    }
  }, [prHistory])

  let path = `/prayer-requests/list?category=${pr?.category?._id}`
  if (complexId) {
    path += `&complexId=${complexId}`
  }

  if (loading) {
    return <PageLoader />
  }

  return (
    <section className="content-wrap">
      <div className="w-8/12">
        <div className="w-full bg-white p-4">
          <h2 className="font-bold text-4xl leading-10 mb-2 break-words">{`${pr?.category?.name} - ${pr?.prayer?.for}`}</h2>
          <small className="font-normal text-base">
            {' '}
            {toFriendlyDate(pr?.createdAt)}
          </small>{' '}
          <span className="text-neutral-500 text-base">&middot; </span>
          <Link href={path}>
            <small className="text-blue-500 cursor-pointer font-normal text-base">
              {pr?.category?.name}
            </small>
          </Link>
        </div>
        <Card
          noPadding
          content={
            <div className="py-2">
              <div className="p-4">
                <p className="text-base text-gray-500 font-bold">
                  Date of Mass
                </p>
                <p className="text-base text-neutral-dark">
                  {toFriendlyDate(pr?.prayer?.date)}
                </p>
              </div>
              {/* <div className="p-4">
                <p className="text-base text-gray-500 font-bold">
                  Time of Mass
                </p>
                <p className="text-base text-neutral-dark">
                  {toFriendlyTime(new Date(pr?.prayer?.time))}
                </p>
              </div> */}

              <div className="p-4">
                <p className="text-base text-gray-500 font-bold">Prayer For</p>
                <p className="text-base text-neutral-dark break-words">
                  {pr?.prayer?.for || 'No data'}
                </p>
              </div>

              <div className="p-4">
                <p className="text-base text-gray-500 font-bold">Message</p>
                <p className="text-base text-neutral-dark break-words">
                  {pr?.content || 'No data'}
                </p>
              </div>

              <div className="p-4">
                <p className="text-base text-gray-500 font-bold">Prayer From</p>
                <p className="text-base text-neutral-dark break-words">
                  {pr?.prayer?.from || 'No data'}
                </p>
              </div>
            </div>
          }
        />
        <Tabs defaultTab="1">
          <Tabs.TabLabels>
            <Tabs.TabLabel id="1">Activity History</Tabs.TabLabel>
          </Tabs.TabLabels>

          <Tabs.TabPanels>
            <Tabs.TabPanel id="1">
              <div className="w-full">
                <Card
                  noPadding
                  title={
                    <h2 className="font-bold text-lg">Activity History</h2>
                  }
                  content={
                    <Table
                      rowNames={columns}
                      items={prayerRequestHistoryDate}
                    />
                  }
                />
              </div>
            </Tabs.TabPanel>
          </Tabs.TabPanels>
        </Tabs>
      </div>
    </section>
  )
}
