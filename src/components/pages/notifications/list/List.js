import React, { useState } from 'react'
import P from 'prop-types'
import { useRouter } from 'next/router'
import Tabs from '@app/components/tabs'
import Table from '@app/components/table'
import Button from '@app/components/button'
import FormSelect from '@app/components/forms/form-select'
import FormInput from '@app/components/forms/form-input'
import { Card } from '@app/components/globals'

import { FaPlusCircle, FaSearch, FaTimes } from 'react-icons/fa'

import {
  upcomingTableRows,
  publishedTableRows,
  otherTableRows,
  upcomingData,
  publishedData,
  draftsData,
  trashData
} from './mockData'

const bulkOptions = [
  {
    label: 'Unpublished',
    value: 'unpublish'
  },
  {
    label: 'Move to Trash',
    value: 'trash'
  }
]

const categoryOptions = [
  {
    label: 'Announcements',
    value: 'announcements'
  },
  {
    label: 'Emergency',
    value: 'emergency'
  }
]

function NotificationsList() {
  const [searchText, setSearchtext] = useState('')

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

        <div className="flex items-center justify-between mt-12 mx-4 flex-col md:flex-row">
          <div className="flex items-center justify-between w-full md:w-1/4">
            <FormSelect options={bulkOptions} />
            <Button default type="button" label="Apply" className="ml-2" />
          </div>
          <div className="flex items-center justify-between w-full flex-col md:w-1/3 md:flex-row">
            <FormSelect options={categoryOptions} />
            <div className="w-full md:w-80 md:ml-2 relative">
              <FormInput
                name="search"
                placeholder="Search by title"
                inputClassName="pr-8"
                onChange={e => setSearchtext(e.target.value)}
                value={searchText}
              />
              <span className="absolute top-4 right-4">
                {searchText ? (
                  <FaTimes className="cursor-pointer" onClick={() => {}} />
                ) : (
                  <FaSearch />
                )}
              </span>
            </div>
          </div>
        </div>
        <Tabs.TabPanels>
          <Tabs.TabPanel id="1">
            <Header
              title={`Upcoming Notifications (${upcomingData.data.length})`}
            />
            <Card
              noPadding
              content={
                <Table rowNames={upcomingTableRows} items={upcomingData} />
              }
              className="rounded-t-none"
            />
          </Tabs.TabPanel>
          <Tabs.TabPanel id="2">
            <Header
              title={`Published Notifications (${publishedData.data.length})`}
            />
            <Card
              noPadding
              content={
                <Table rowNames={publishedTableRows} items={publishedData} />
              }
            />
          </Tabs.TabPanel>
          <Tabs.TabPanel id="3">
            <Header title={`Drafts (${draftsData.data.length})`} />
            <Card
              noPadding
              content={<Table rowNames={otherTableRows} items={draftsData} />}
            />
          </Tabs.TabPanel>
          <Tabs.TabPanel id="4">
            <Header title={`Trash (${trashData.data.length})`} />
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
    <>
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
    </>
  )
}

Header.propTypes = {
  title: P.string.required
}

export default NotificationsList
