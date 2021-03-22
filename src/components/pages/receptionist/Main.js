// import Visitors from './visitors'
// import Deliveries from './deliveries'
// import Services from './services'
// import PickUps from './pick-ups'
import React, { useEffect } from 'react'
import Tabs from '@app/components/tabs'
import { useRouter } from 'next/router'
import Link from 'next/link'

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

  useEffect(() => {
    const routerName = _.split(router.pathname, '/')[2]
    console.log(SETTINGS[routerName])
  }, [])

  return (
    <>
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
      </Tabs>
    </>
  )
}
