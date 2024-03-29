import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'

import Tabs from '@app/components/tabs'

import VisitorIcon from '@app/assets/svg/gnd-visitor.svg'
import DeliveryIcon from '@app/assets/svg/gnd-delivery.svg'
import PickUpIcon from '@app/assets/svg/gnd-pick-up.svg'
import ServiceIcon from '@app/assets/svg/gnd-service.svg'

import LogBook from './logbook'
import Cancelled from './cancelled'
import UpComing from './upcoming'

import { GET_CATEGORIES } from './query'

import styles from './main.module.css'

const _ = require('lodash')

const SETTINGS = {
  visitors: {
    tabs: ['Logbook', 'Upcoming', 'Cancelled'],
    status: {
      logbook: ['checkedIn', 'checkedOut'],
      upcoming: 'scheduled',
      cancelled: 'cancelled'
    },
    mark: '_VISITORS_',
    name: 'Visitors',
    icon: <VisitorIcon />
  },
  deliveries: {
    tabs: ['Logbook', 'Upcoming', 'Cancelled'],
    status: {
      logbook: ['checkedIn', 'checkedOut'],
      upcoming: 'scheduled',
      cancelled: 'cancelled'
    },
    mark: '_DELIVERIES_',
    name: 'Deliveries',
    icon: <DeliveryIcon />
  },
  services: {
    tabs: ['Logbook', 'Cancelled'],
    status: {
      logbook: ['checkedIn', 'checkedOut'],
      cancelled: 'cancelled'
    },
    mark: '_SVC_WORKERS_',
    name: 'Services',
    icon: <ServiceIcon />
  },
  'pick-ups': {
    tabs: ['Logbook', 'Cancelled'],
    status: {
      logbook: ['checkedIn', 'checkedOut'],
      cancelled: 'cancelled'
    },
    mark: '_PICKUPS_',
    name: 'Pick-ups',
    icon: <PickUpIcon />
  }
}

export default function Main() {
  const router = useRouter()

  const routerName = _.split(router.pathname, '/')[2]
  const tabName = Object.keys(router.query)[0]
  const user = JSON.parse(localStorage.getItem('profile'))
  const buildingId = user?.accounts?.data[0]?.building?._id
  const buildingName = user?.accounts?.data[0]?.building?.name
  const [categoryIds, setCategoryIds] = useState({})

  const { loading, data, error, refetch } = useQuery(GET_CATEGORIES)

  useEffect(() => {
    if (!loading && !error && data) {
      const categories = {}
      data?.getRegistryCategories?.data.forEach(category => {
        categories[`${category.mark}`] = category._id
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

        <Tabs
          defaultTab={
            (tabName === 'upcoming' && '2') ||
            (tabName === 'cancelled' && '3') ||
            (tabName === 'logbook' && '1') ||
            (tabName === undefined && '1')
          }
        >
          <Tabs.TabLabels>
            {SETTINGS[routerName] &&
              SETTINGS[routerName].tabs.map((tab, index) => {
                return (
                  <Tabs.TabLabel
                    key={index}
                    id={String(index + 1)}
                    route={`${routerName}?${String(tab).toLocaleLowerCase()}`}
                  >
                    {tab}
                  </Tabs.TabLabel>
                )
              })}
          </Tabs.TabLabels>
          <Tabs.TabPanels>
            <Tabs.TabPanel id="1">
              {routerName && categoryIds && buildingId && (
                <LogBook
                  buildingId={buildingId ?? ''}
                  categoryId={categoryIds[SETTINGS[routerName]?.mark]}
                  status={SETTINGS[routerName]?.status?.logbook ?? ''}
                  name={SETTINGS[routerName]?.name ?? ''}
                  buildingName={buildingName ?? ''}
                  type={routerName ?? ''}
                  icon={SETTINGS[routerName]?.icon ?? ''}
                />
              )}
            </Tabs.TabPanel>
            <Tabs.TabPanel id="2">
              {routerName && categoryIds && buildingId && (
                <UpComing
                  buildingId={buildingId ?? ''}
                  categoryId={categoryIds[SETTINGS[routerName]?.mark]}
                  status={SETTINGS[routerName]?.status?.upcoming ?? ''}
                  name={SETTINGS[routerName]?.name ?? ''}
                  buildingName={buildingName ?? ''}
                  type={routerName ?? ''}
                  icon={SETTINGS[routerName]?.icon ?? ''}
                />
              )}
            </Tabs.TabPanel>
            <Tabs.TabPanel id="3">
              {routerName && categoryIds && buildingId && (
                <Cancelled
                  buildingId={buildingId ?? ''}
                  categoryId={categoryIds[SETTINGS[routerName]?.mark]}
                  status={SETTINGS[routerName]?.status?.cancelled ?? ''}
                  name={SETTINGS[routerName]?.name ?? ''}
                  buildingName={buildingName ?? ''}
                  type={routerName ?? ''}
                  icon={SETTINGS[routerName]?.icon ?? ''}
                />
              )}
            </Tabs.TabPanel>
          </Tabs.TabPanels>
        </Tabs>
      </div>
    </>
  )
}
