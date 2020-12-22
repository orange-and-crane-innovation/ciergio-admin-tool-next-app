/* eslint-disable react/jsx-key */
import React, { useState } from 'react'
import { Card, Tabs } from '@app/components/globals'
import ActiveDummyTable from './DummyTable'

const tabs = [
  { label: 'Directory', value: 1 },
  { label: 'Manage Directory', value: 2 }
]

function Directory() {
  const [activeTab, setActiveTab] = useState(1)

  return (
    <section className={`content-wrap`}>
      <h1 className="content-title mb-5">Directory</h1>
      <div className="toolbar">
        <Tabs tabs={tabs} activeTab={activeTab} handleTab={setActiveTab} />
      </div>
      <Card
        title="Companies"
        content={<ActiveDummyTable active={activeTab} />}
      />
    </section>
  )
}

export default Directory
