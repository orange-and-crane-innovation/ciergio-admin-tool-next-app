import React, { useState } from 'react'
import Tabs from '@app/components/tabs'
import { useRouter } from 'next/router'
import Link from 'next/link'
import styles from './main.module.css'
import DateAndSearch from './DateAndSearch'
import LogBook from './logbook'
import Cancelled from './cancelled'
import UpComing from './upcoming'

const _ = require('lodash')

const SETTINGS = {
  visitors: {
    tabs: ['Logbook', 'Upcoming', 'Cancelled']
  },
  deliveries: {
    tabs: ['Logbook', 'Upcoming', 'Cancelled']
  },
  services: {
    tabs: ['Logbook', 'Cancelled']
  },
  'pick-ups': {
    tabs: ['Logbook', 'Cancelled']
  }
}
export default function Main() {
  const router = useRouter()
  const routerName = _.split(router.pathname, '/')[2]
  const [selectedDate, setSelectedDate] = useState(new Date())

  return (
    <>
      <div className={styles.ReceptionistContainer}>
        <h1 className={styles.ReceptionistHeading}>
          Some building {routerName}
        </h1>

        <Tabs defaultTab="1">
          <Tabs.TabLabels>
            {SETTINGS[routerName] &&
              SETTINGS[routerName].tabs.map((tab, index) => {
                return (
                  <Tabs.TabLabel key={index} id={String(index + 1)}>
                    <Link
                      href={`/receptionist/${routerName}?${tab.toLowerCase()}`}
                    >
                      <a>{tab}</a>
                    </Link>
                  </Tabs.TabLabel>
                )
              })}
          </Tabs.TabLabels>
          <Tabs.TabPanels>
            <Tabs.TabPanel id="1">
              <DateAndSearch />
              <LogBook />
            </Tabs.TabPanel>
            <Tabs.TabPanel id="2">
              <UpComing />
            </Tabs.TabPanel>
            <Tabs.TabPanel id="3">
              <DateAndSearch />
              <Cancelled />
            </Tabs.TabPanel>
          </Tabs.TabPanels>
        </Tabs>
      </div>
    </>
  )
}
