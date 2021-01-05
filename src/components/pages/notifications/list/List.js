import React from 'react'
import P from 'prop-types'
import { useRouter } from 'next/router'
import Tabs from '@app/components/tabs'
import Table from '@app/components/table'
import Button from '@app/components/button'
import { Card } from '@app/components/globals'

import { FaPlusCircle } from 'react-icons/fa'
import {
  upcomingTableRows,
  publishedTableRows,
  otherTableRows,
  upcomingData,
  publishedData,
  draftsData,
  trashData
} from './mockData'

function NotificationsList() {
  return (
    <section className={`content-wrap pt-4 pb-8 px-8`}>
      <h1 className="content-title">
        Orange and Crane Innovations Inc. Notifications
      </h1>
      <Tabs defaultTab="1">
        <Tabs.TabLabels>
          <Tabs.TabLabel id="1">Upcoming</Tabs.TabLabel>
          <Tabs.TabLabel id="2">Published</Tabs.TabLabel>
          <Tabs.TabLabel id="3">Draft</Tabs.TabLabel>
          <Tabs.TabLabel id="4">Trash</Tabs.TabLabel>
        </Tabs.TabLabels>
        <Tabs.TabPanels>
          <Tabs.TabPanel id="1">
            <Header title="Upcoming Notifications" />
            <Card
              noPadding
              content={
                <Table rowNames={upcomingTableRows} items={upcomingData} />
              }
              className="rounded-t-none"
            />
          </Tabs.TabPanel>
          <Tabs.TabPanel id="2">
            <Header title="Published Notifications" />
            <Card
              noPadding
              content={
                <Table rowNames={publishedTableRows} items={publishedData} />
              }
            />
          </Tabs.TabPanel>
          <Tabs.TabPanel id="3">
            <Header title="Drafts" />
            <Card
              noPadding
              content={<Table rowNames={otherTableRows} items={draftsData} />}
            />
          </Tabs.TabPanel>
          <Tabs.TabPanel id="4">
            <Header title="Trash" />
            <Card
              noPadding
              content={<Table rowNames={otherTableRows} items={trashData} />}
            />
          </Tabs.TabPanel>
        </Tabs.TabPanels>
      </Tabs>
    </section>
  )
}

const Header = ({ title }) => {
  const router = useRouter()

  const goToCreate = () => router.push('/notifications/create')

  return (
    <div className="flex items-center justify-between">
      <h1 className="font-bold text-base px-8 py-4">{title}</h1>
      <Button
        primary
        leftIcon={<FaPlusCircle />}
        label="Create Notifications"
        onClick={goToCreate}
        className="mr-4 mt-4"
      />
    </div>
  )
}

Header.propTypes = {
  title: P.string.required
}

export default NotificationsList
