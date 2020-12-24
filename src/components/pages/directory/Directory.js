/* eslint-disable react/jsx-key */
import React from 'react'
import { FaPlusCircle } from 'react-icons/fa'

import { Card, Tabs, Button } from '@app/components/globals'
import { DummyDirectoryTable, DummyManageDirectoryList } from './DummyTable'

function Directory() {
  return (
    <section className={`content-wrap`}>
      <h1 className="content-title mb-5">Directory</h1>
      <Tabs defaultTab="1">
        <Tabs.TabLabels>
          <Tabs.TabLabel id="1">Directory</Tabs.TabLabel>
          <Tabs.TabLabel id="2">Manage Directory</Tabs.TabLabel>
        </Tabs.TabLabels>
        <Tabs.TabPanels>
          <Tabs.TabPanel id="1">
            <Card
              noPadding
              header={
                <div className="flex items-center justify-between">
                  <span>Companies</span>
                </div>
              }
              content={<DummyDirectoryTable />}
            />
          </Tabs.TabPanel>
          <Tabs.TabPanel id="2">
            <Card
              noPadding
              header={
                <div className="flex items-center justify-between">
                  <Button
                    default
                    leftIcon={<FaPlusCircle />}
                    label="Add Category"
                    onClick={() => {}}
                  />
                </div>
              }
              content={<DummyManageDirectoryList />}
            />
          </Tabs.TabPanel>
        </Tabs.TabPanels>
      </Tabs>
    </section>
  )
}

export default Directory
