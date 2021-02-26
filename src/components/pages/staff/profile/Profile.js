import React from 'react'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'

import Tabs from '@app/components/tabs'
import Table from '@app/components/table'
import { Card } from '@app/components/globals'

import { toFriendlyDate, friendlyDateTimeFormat } from '@app/utils/date'

// import Button from '@app/components/button'
// import { GoKebabHorizontal } from 'react-icons/go'

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
                activity: history?.action
              }
            })
          : []
    }),
    [data]
  )

  return (
    <section className="content-wrap">
      <div className="w-full flex align-center justify-between mb-10">
        <div className="w-3/12 flex justify-start align-center">
          <img
            src={`https://ui-avatars.com/api/?name=${fullName}`}
            alt="profile-avatar"
            className="border rounded-full mr-4"
          />
          <div>
            <h1 className="font-bold text-2xl capitalize mb-0">{fullName}</h1>
            <h2 className="capitalize">{user?.jobTitle || accountType}</h2>
          </div>
        </div>

        {/* <div>
          <Button default icon={<GoKebabHorizontal />} />
        </div> */}
      </div>

      <Tabs defaultTab="1">
        <Tabs.TabLabels>
          <Tabs.TabLabel id="1">Overview</Tabs.TabLabel>
        </Tabs.TabLabels>

        <Tabs.TabPanels>
          <Tabs.TabPanel id="1">
            <div className="w-full flex">
              <div className="w-8/12 mr-4">
                <div className="w-full bg-white p-4 border-t border-x rounded">
                  <h2 className="font-bold text-based">Recent Activity</h2>
                </div>
                <Card
                  noPadding
                  content={<Table rowNames={columns} items={activityData} />}
                />
              </div>
              <div className="w-4/12">
                <div className="w-full bg-white p-4 border-t border-x rounded">
                  <h2 className="font-bold text-based">About</h2>
                </div>
                <Card
                  noPadding
                  content={
                    <div className="py-2">
                      <div className="p-4">
                        <p className="font-xl text-gray-400 font-bold">
                          Email Address
                        </p>
                        <p className="font-xl">{user?.email}</p>
                      </div>

                      <div className="p-4">
                        <p className="font-xl text-gray-400 font-bold">
                          Company
                        </p>
                        <p className="font-xl">{companyName || 'No data'}</p>
                      </div>

                      <div className="p-4">
                        <p className="font-xl text-gray-400 font-bold">
                          Complex
                        </p>
                        <p className="font-xl">{complexName || 'No data'}</p>
                      </div>

                      <div className="p-4">
                        <p className="font-xl text-gray-400 font-bold">
                          Building
                        </p>
                        <p className="font-xl">{buildingName || 'No data'}</p>
                      </div>

                      <div className="p-4">
                        <p className="font-xl text-gray-400 font-bold">
                          Assignments
                        </p>
                        <p className="font-x">
                          <span className="capitalize">{`${
                            user?.jobTitle || accountType
                          }`}</span>{' '}
                          at {buildingName || complexName || companyName}
                        </p>
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
