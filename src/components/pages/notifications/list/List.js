import React, { useState } from 'react'

import Tabs from '@app/components/tabs'
import Button from '@app/components/button'
import FormSelect from '@app/components/forms/form-select'
import FormInput from '@app/components/forms/form-input'

import Notification from '../components/Notification'

import { FaSearch, FaTimes } from 'react-icons/fa'

import { bulkOptions, categoryOptions } from '../constants'

import {
  GET_ALL_UPCOMING_NOTIFICATIONS,
  GET_ALL_PUBLISHED_NOTIFICATIONS,
  GET_ALL_DRAFT_NOTIFICATIONS,
  GET_ALL_TRASHED_NOTIFICATIONS
} from '../queries'

function NotificationsList() {
  const [searchText, setSearchtext] = useState('')

  return (
    <section className={`content-wrap pt-4 pb-8 px-8`}>
      <h1 className="content-title">
        Orange and Crane Innovations Inc. Notifications
      </h1>

      <Tabs defaultTab="upcoming" onClick={e => console.log('e', e)}>
        <Tabs.TabLabels>
          <Tabs.TabLabel id="upcoming">Upcoming</Tabs.TabLabel>
          <Tabs.TabLabel id="published">Published</Tabs.TabLabel>
          <Tabs.TabLabel id="draft">Draft</Tabs.TabLabel>
          <Tabs.TabLabel id="trashed">Trash</Tabs.TabLabel>
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
          <Tabs.TabPanel id="upcoming">
            <Notification
              type="upcoming"
              query={GET_ALL_UPCOMING_NOTIFICATIONS}
            />
          </Tabs.TabPanel>
          <Tabs.TabPanel id="published">
            <Notification
              type="published"
              query={GET_ALL_PUBLISHED_NOTIFICATIONS}
            />
          </Tabs.TabPanel>
          <Tabs.TabPanel id="draft">
            <Notification type="draft" query={GET_ALL_DRAFT_NOTIFICATIONS} />
          </Tabs.TabPanel>
          <Tabs.TabPanel id="trashed">
            <Notification
              type="trashed"
              query={GET_ALL_TRASHED_NOTIFICATIONS}
            />
          </Tabs.TabPanel>
        </Tabs.TabPanels>
      </Tabs>
    </section>
  )
}

export default NotificationsList
