import { useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'

import Card from '@app/components/card'
import Table from '@app/components/table'
import Pagination from '@app/components/pagination'
import PageLoader from '@app/components/page-loader'

import NotifCard from '@app/components/globals/NotifCard'

import { friendlyDateTimeFormat } from '@app/utils/date'
import getAccountTypeName from '@app/utils/getAccountTypeName'

import { GET_RESIDENTS, GET_RESIDENT_HISTORY } from '../queries'
import historyMessages from './historyMessages'

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

function Profile() {
  const router = useRouter()
  const [activePage, setActivePage] = useState(1)
  const [limitPage, setLimitPage] = useState(10)
  const [offsetPage, setOffsetPage] = useState(0)
  const { id } = router?.query

  const { data: profile } = useQuery(GET_RESIDENTS, {
    variables: {
      where: {
        _id: id
      }
    }
  })
  const { data: history, loading } = useQuery(GET_RESIDENT_HISTORY, {
    variables: {
      where: {
        accountId: id
      },
      limit: limitPage,
      skip: offsetPage
    }
  })

  const resident = profile?.getAccounts?.data[0]
  const residentProfile = resident?.user
  const fullName = `${residentProfile?.firstName} ${residentProfile?.lastName}`

  const historyData = useMemo(() => {
    return {
      count: history?.getAccountHistory?.count || 0,
      limit: history?.getAccountHistory?.limit,
      skip: history?.getAccountHistory?.skip,
      data:
        history?.getAccountHistory?.count > 0
          ? history.getAccountHistory.data.map(history => {
              const _data = history?.data ? JSON.parse(history.data) : undefined

              return {
                dateAndTime: friendlyDateTimeFormat(
                  history.date,
                  'MMMM DD, YYYY - hh:mm A'
                ),
                user: fullName,
                activity:
                  (historyMessages[history.action] &&
                    historyMessages[history.action](_data)) ||
                  'No activity'
              }
            })
          : []
    }
  }, [history?.getAccountHistory])

  const onPageClick = e => {
    setActivePage(e)
    setOffsetPage(limitPage * (e - 1))
  }

  const onLimitChange = e => {
    setLimitPage(Number(e.value))
    setActivePage(1)
    setOffsetPage(0)
  }

  return (
    <div className="content-wrap pb-4">
      {loading ? (
        <PageLoader />
      ) : resident ? (
        <>
          <div className="w-full flex items-center py-4">
            <div className="w-32 h-32 rounded-full overflow-auto border border-neutral-300">
              <img
                src={
                  residentProfile?.avatar ||
                  `https://ui-avatars.com/api/?name=${fullName}&rounded=true`
                }
                alt="Resident"
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div className="ml-4">
              <h4 className="text-neutral-dark">
                <span className="text-3xl font-bold block">{fullName}</span>
                <small className="block mt-4 capitalize text-base">
                  {getAccountTypeName(resident?.accountType)}
                </small>
              </h4>
            </div>
          </div>
          <div className="w-full grid grid-cols-12 gap-x-4">
            <div className="col-start-1 col-end-9">
              <Card
                noPadding
                header={
                  <h1 className="py-2 font-bold text-lg">Recent Activity</h1>
                }
                content={<Table rowNames={columns} items={historyData} />}
              />
              {historyData && historyData.count > 10 && (
                <Pagination
                  items={historyData}
                  activePage={activePage}
                  onPageClick={onPageClick}
                  onLimitChange={onLimitChange}
                />
              )}
            </div>
            <div className="col-start-9 col-end-13">
              <Card
                noPadding
                header={<h1 className="py-2 font-bold text-lg">About</h1>}
                content={
                  <div className="p-4 border-t text-base leading-7">
                    <div className="mb-4">
                      <h4 className="text-neutral-500 font-semibold">
                        Email Address
                      </h4>
                      <p>{residentProfile?.email ?? 'N/A'}</p>
                    </div>
                    <div className="mb-4">
                      <h4 className="text-neutral-500 font-semibold">
                        Company
                      </h4>
                      <p>{resident?.company?.name ?? 'N/A'}</p>
                    </div>
                    <div className="mb-4">
                      <h4 className="text-neutral-500 font-semibold">
                        Complex
                      </h4>
                      <p>{resident?.complex?.name ?? 'N/A'}</p>
                    </div>
                    <div className="mb-4">
                      <h4 className="text-neutral-500 font-semibold">
                        Building
                      </h4>
                      <p>{resident?.building?.name ?? 'N/A'}</p>
                    </div>
                    <div className="mb-4">
                      <h4 className="text-neutral-500 font-semibold">Unit</h4>
                      <p>{resident?.unit?.name ?? 'N/A'}</p>
                    </div>
                  </div>
                }
              />
            </div>
          </div>
        </>
      ) : (
        <NotifCard
          icon={<i className="ciergio-user" />}
          header="Resident not found"
        />
      )}
    </div>
  )
}

export default Profile
