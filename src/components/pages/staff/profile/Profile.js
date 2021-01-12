import React from 'react'
import { useRouter } from 'next/router'

import Button from '@app/components/button'
import Tabs from '@app/components/tabs'
import { Card, Table } from '@app/components/globals'

import { GoKebabHorizontal } from 'react-icons/go'

const columns = [
  {
    Header: 'Name',
    accessor: 'name'
  },
  {
    Header: 'Activity',
    accessor: 'activity'
  }
]

function Profile() {
  const { query } = useRouter()
  const { name } = query
  console.log({ query })

  return (
    <section className="content-wrap">
      <div className="w-full flex align-center justify-between mb-10">
        <div className="w-3/12 flex justify-start align-center">
          <img
            src={`https://ui-avatars.com/api/?name=${name.replace(' ', '+')}`}
            alt="profile-avatar"
            className="border rounded-full mr-4"
          />
          <div>
            <h1 className="font-bold text-2xl capitalize mb-0">{name}</h1>
            <h2>Building Admin</h2>
          </div>
        </div>

        <div>
          <Button default icon={<GoKebabHorizontal />} />
        </div>
      </div>

      <Tabs defaultTab="1">
        <Tabs.TabLabels>
          <Tabs.TabLabel id="1">Overview</Tabs.TabLabel>
          <Tabs.TabLabel id="2">History</Tabs.TabLabel>
        </Tabs.TabLabels>

        <Tabs.TabPanels>
          <Tabs.TabPanel id="1">
            <div className="w-full bg-white p-4 border-t border-x rounded">
              <h2 className="font-bold text-based">Recent Activity</h2>
            </div>

            <Card
              noPadding
              content={
                <Table columns={columns} payload={{ count: 0, data: [] }} />
              }
              className="rounded-t-none"
            />
          </Tabs.TabPanel>
          <Tabs.TabPanel id="2">
            <div className="w-full bg-white p-4 border-t border-x rounded">
              <h2 className="font-bold text-based">History</h2>
            </div>
            <Card
              noPadding
              content={
                <Table columns={columns} payload={{ count: 0, data: [] }} />
              }
            />
          </Tabs.TabPanel>
        </Tabs.TabPanels>
      </Tabs>
    </section>
  )
}

export default Profile
