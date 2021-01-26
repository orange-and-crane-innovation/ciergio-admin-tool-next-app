import React, { useState } from 'react'
import { useMutation } from '@apollo/client'

import Tabs from '@app/components/tabs'
import FormSelect from '@app/components/forms/form-select'
import FormInput from '@app/components/forms/form-input'
import SelectBulk from '@app/components/globals/SelectBulk'

import Notification from '../components/Notification'

import { FaSearch, FaTimes } from 'react-icons/fa'

import {
  bulkOptions,
  categoryOptions,
  UPCOMING,
  PUBLISHED,
  DRAFT,
  TRASHED
} from '../constants'

import {
  GET_ALL_UPCOMING_NOTIFICATIONS,
  GET_ALL_PUBLISHED_NOTIFICATIONS,
  GET_ALL_DRAFT_NOTIFICATIONS,
  GET_ALL_TRASHED_NOTIFICATIONS,
  BULK_UPDATE_MUTATION
} from '../queries'

const tabs = [
  {
    type: UPCOMING,
    query: GET_ALL_UPCOMING_NOTIFICATIONS
  },
  {
    type: PUBLISHED,
    query: GET_ALL_PUBLISHED_NOTIFICATIONS
  },
  {
    type: DRAFT,
    query: GET_ALL_DRAFT_NOTIFICATIONS
  },
  {
    type: TRASHED,
    query: GET_ALL_TRASHED_NOTIFICATIONS
  }
]

const { TabPanels, TabPanel, TabLabel, TabLabels } = Tabs

function NotificationsList() {
  const [searchText, setSearchtext] = useState('')
  const [isBulkDisabled, setIsBulkDisabled] = useState(true)
  const [isBulkButtonDisabled, setIsBulkButtonDisabled] = useState(true)
  const [selectedBulk, setSelectedBulk] = useState()

  const [selectedData, setSelectedData] = useState([])

  const [bulkUpdate, { called: calledBulk, data: dataBulk }] = useMutation(
    BULK_UPDATE_MUTATION
  )

  const onClearBulk = () => {
    setSelectedBulk('')
  }

  const onBulkSubmit = () => {
    const data = { id: selectedData, status: selectedBulk }
    bulkUpdate({ variables: data })
  }

  const onBulkChange = e => {
    setSelectedBulk(e.target.value)
    if (e.target.value !== '') {
      setIsBulkButtonDisabled(false)
    } else {
      setIsBulkButtonDisabled(true)
    }
  }

  return (
    <section className="content-wrap">
      <h1 className="content-title">
        Orange and Crane Innovations Inc. Notifications
      </h1>

      <Tabs defaultTab={UPCOMING}>
        <TabLabels>
          {tabs.map(({ type }) => (
            <TabLabel key={type} id={type}>
              <span className="capitalize">{type}</span>
            </TabLabel>
          ))}
        </TabLabels>

        <div className="flex items-center justify-between mt-12 mx-4 flex-col md:flex-row">
          <SelectBulk
            placeholder="Select"
            options={bulkOptions}
            disabled={isBulkDisabled}
            isButtonDisabled={isBulkButtonDisabled}
            onBulkChange={onBulkChange}
            onBulkSubmit={onBulkSubmit}
            onBulkClear={onClearBulk}
            selected={selectedBulk}
          />
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
        <TabPanels>
          {tabs.map(({ type, query }) => (
            <TabPanel key={type} id={type}>
              <Notification
                type={type}
                query={query}
                calledBulk={calledBulk}
                dataBulk={dataBulk}
                selectedData={selectedData}
                setSelectedData={setSelectedData}
                setIsBulkButtonDisabled={setIsBulkButtonDisabled}
                setIsBulkDisabled={setIsBulkDisabled}
                setSelectedBulk={setSelectedBulk}
              />
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </section>
  )
}

export default NotificationsList
