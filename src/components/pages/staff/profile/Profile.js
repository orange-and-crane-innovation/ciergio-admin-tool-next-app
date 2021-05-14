import React from 'react'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'

import Tabs from '@app/components/tabs'
import Table from '@app/components/table'
import { Card } from '@app/components/globals'
import { toFriendlyDate, friendlyDateTimeFormat } from '@app/utils/date'
import HISTORY_MESSAGES from '../constants'
import { GET_ACCOUNT } from '../queries'

const columns = [
  {
    name: 'Date',
    width: '40%'
  },
  {
    name: 'Activity',
    width: ''
  }
]

function Profile() {
  const { query } = useRouter()
  const { id } = query

  const { data: accounts } = useQuery(GET_ACCOUNT, {
    variables: {
      id
    }
  })

  const data = accounts?.getAccounts?.data[0]
  const user = data?.user
  const companyName = data?.company?.name
  const complexName = data?.complex?.name
  const buildingName = data?.building?.name
  const fullName = `${user?.firstName} ${user?.lastName}`
  const accountType = accounts?.getAccounts?.data[0]?.accountType.replace(
    '_',
    ' '
  )

  const activityData = React.useMemo(
    () => ({
      count: data?.history?.count || 0,
      limit: data?.history?.limit || 0,
      data:
        data?.history?.data?.length > 0
          ? data?.history.data?.map(history => {
              const historyDate = history?.date

              return {
                date: `${toFriendlyDate(
                  historyDate
                )} - ${friendlyDateTimeFormat(historyDate, 'LT')}`,
                activity:
                  (HISTORY_MESSAGES[history.action] &&
                    HISTORY_MESSAGES[history.action](
                      JSON.parse(history?.data)
                    )) ||
                  'No activity'
              }
            })
          : []
    }),
    [data]
  )

  return (
    <section className="content-wrap">
      <div className="w-full flex items-center mb-4">
        <div className="h-32 w-32 overflow-auto shadow-md rounded-full">
          <img
            className="h-full w-full object-contain object-center"
            src={
              data?.user?.avatar ??
              `https://ui-avatars.com/api/?name=${fullName}`
            }
            alt="profile-avatar"
          />
        </div>
        <div className="ml-4">
          <h1 className="font-bold text-3xl leading-10 capitalize">
            {fullName ?? ''}
          </h1>
          <h2 className="capitalize">{user?.jobTitle || accountType || ''}</h2>
        </div>
      </div>

      <Tabs defaultTab="1">
        <Tabs.TabLabels>
          <Tabs.TabLabel id="1">Overview</Tabs.TabLabel>
        </Tabs.TabLabels>

        <Tabs.TabPanels>
          <Tabs.TabPanel id="1">
            <div className="w-full flex">
              <div className="w-8/12 mr-4">
                <Card
                  noPadding
                  title={
                    <h2 className="-mt-2 font-bold text-lg">Recent Activity</h2>
                  }
                  content={<Table rowNames={columns} items={activityData} />}
                />
              </div>
              <div className="w-4/12 text-base leading-7">
                <Card
                  noPadding
                  title={<h2 className="-mt-4 font-bold text-lg">About</h2>}
                  content={
                    <div className="border-t">
                      <div className="p-4">
                        <div className="text-gray-400 font-bold">
                          Email Address
                        </div>
                        <div>{user?.email}</div>
                      </div>

                      <div className="p-4">
                        <div className="text-gray-400 font-bold">Company</div>
                        <div>{companyName || 'No data'}</div>
                      </div>

                      <div className="p-4">
                        <div className="text-gray-400 font-bold">Complex</div>
                        <div>{complexName || 'No data'}</div>
                      </div>

                      <div className="p-4">
                        <div className=" text-gray-400 font-bold">Building</div>
                        <div>{buildingName || 'No data'}</div>
                      </div>

                      <div className="p-4">
                        <div className=" text-gray-400 font-bold">
                          Assignments
                        </div>
                        <div className="capitalize">
                          {`${user?.jobTitle || accountType} at ${
                            buildingName || complexName || companyName
                          }`}
                        </div>
                      </div>
                    </div>
                  }
                />
              </div>
            </div>
          </Tabs.TabPanel>
        </Tabs.TabPanels>
      </Tabs>
    </section>
  )
}

export default Profile
