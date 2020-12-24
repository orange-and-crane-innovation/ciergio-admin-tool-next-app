/* eslint-disable react/jsx-key */
import React from 'react'
import { FaPlusCircle } from 'react-icons/fa'

import { Card, Tabs, Table } from '@app/components/globals'
import Button from '@app/components/button'
import { DummyManageDirectoryList } from './DummyTable'

const tableRowData = [
  {
    name: 'Name',
    width: '40%'
  },
  {
    name: 'Category',
    width: '20%'
  },
  {
    name: 'Address',
    width: ''
  }
]

const tableData = {
  count: 161,
  limit: 10,
  offset: 0,
  data: [
    {
      name: 'Red Cross',
      category: 'Emergency',
      address: '96 Novella Knolls'
    },
    {
      title: 'PRHC Headquarters',
      category: 'Company',
      address: '0870 Dennis Stream'
    },
    {
      title: 'McDonalds',
      category: 'Delivery',
      address: '4182 Bartholome Drive Suite 279'
    },
    {
      title: 'Suds Laundry Services',
      category: 'Services',
      address: '65 Letitia Center Apt. 341'
    }
  ]
}

function Directory() {
  return (
    <section className={`content-wrap pt-4 pb-8 px-8`}>
      <h1 className="content-title">Directory</h1>
      <Tabs defaultTab="1">
        <Tabs.TabLabels>
          <Tabs.TabLabel id="1">Directory</Tabs.TabLabel>
          <Tabs.TabLabel id="2">Manage Directory</Tabs.TabLabel>
        </Tabs.TabLabels>
        <Tabs.TabPanels>
          <Tabs.TabPanel id="1">
            <div className="flex items-center justify-between">
              <h1 className="font-bold text-base px-8 py-4">Companies</h1>
            </div>
            <Card
              noPadding
              header={
                <div className="flex items-center justify-between">
                  <span>Companies</span>
                </div>
              }
              content={<Table rowNames={tableRowData} items={tableData} />}
              className="rounded-t-none"
            />
          </Tabs.TabPanel>
          <Tabs.TabPanel id="2">
            <div className="w-full flex items-center justify-end pt-4 pr-4">
              <Button
                default
                leftIcon={<FaPlusCircle />}
                label="Add Category"
                onClick={() => {}}
              />
            </div>
            <Card noPadding content={<DummyManageDirectoryList />} />
          </Tabs.TabPanel>
        </Tabs.TabPanels>
      </Tabs>
    </section>
  )
}

export default Directory
