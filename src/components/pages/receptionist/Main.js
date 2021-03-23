import React, { useState, useEffect } from 'react'
import Tabs from '@app/components/tabs'
import { useRouter } from 'next/router'
import Link from 'next/link'
import styles from './main.module.css'
import DateAndSearch from './DateAndSearch'
import LogBook from './logbook'
import Cancelled from './cancelled'
import UpComing from './upcoming'
import { GET_CATEGORIES } from './query'
import { useQuery, gql } from '@apollo/client'

const _ = require('lodash')

const SETTINGS = {
  visitors: {
    tabs: ['Logbook', 'Upcoming', 'Cancelled'],
    mark: '_VISITORS_'
  },
  deliveries: {
    tabs: ['Logbook', 'Upcoming', 'Cancelled'],
    mark: '_DELIVERIES_'
  },
  services: {
    tabs: ['Logbook', 'Cancelled'],
    mark: '_SVC_WORKERS_'
  },
  'pick-ups': {
    tabs: ['Logbook', 'Cancelled'],
    mark: '_PICKUPS_'
  }
}
export default function Main() {
  const router = useRouter()
  const routerName = _.split(router.pathname, '/')[2]
  const [selectedDate, setSelectedDate] = useState(new Date())
  const user = JSON.parse(localStorage.getItem('profile'))
  const buildingId = user?.accounts?.data[0]?.building?._id
  const buildingName = user?.accounts?.data[0]?.building?.name
  const [categoryIds, setCategoryIds] = useState([])

  const { loading, data, error, refetch } = useQuery(GET_CATEGORIES)

  useEffect(() => {
    if (!loading && !error && data) {
      const categories = data?.getRegistryCategories?.data.map(category => {
        return [{ [`${category.mark}`]: category._id }]
      })
      setCategoryIds(categories)
    }
  }, [loading, data, error, refetch])

  return (
    <>
      <div className={styles.ReceptionistContainer}>
        <h1 className={styles.ReceptionistHeading}>
          {buildingName && `${buildingName} ${routerName}`}
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
