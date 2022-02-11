import React from 'react'

import Tabs from '@app/components/tabs'
import { SettingsTab } from './settings/Settings'
import { OverviewTab } from './overview/Overview'
import { AccountTab } from './about/About'
import { HistoryTab } from './history/History'
import { useRouter } from 'next/router'

import { IMAGES } from '@app/constants'

import styles from './property.module.css'

const COMPANY_ADMIN = 'company_admin'
const COMPLEX_ADMIN = 'complex_admin'

const OVERVIEW = 'Overview'
const ABOUT = 'About'
const HISTORY = 'History'
const SETTINGS = 'Settings'
const TABS = [
  {
    type: OVERVIEW,
    id: OVERVIEW
  },
  {
    type: ABOUT,
    id: ABOUT
  },
  {
    type: HISTORY,
    id: HISTORY
  },
  {
    type: SETTINGS,
    id: SETTINGS
  }
]

const settingsTabLabel = {
  COMPANY: TABS,
  COMPLEX: TABS.filter(tab => tab.id !== ABOUT)
}

const PropertyComponent = () => {
  const user = JSON.parse(localStorage.getItem('profile'))
  const accountType = user?.accounts?.data[0]?.accountType
  const companyID = user?.accounts?.data[0]?.company?._id

  const router = useRouter()
  const { type } = router.query
  const { route } = router
  const routeType = route.split('/')[2].toUpperCase()

  const DEFAULT_TAB =
    (type === OVERVIEW.toLowerCase() && OVERVIEW) ||
    (!type && OVERVIEW) ||
    (type === ABOUT.toLowerCase() && ABOUT) ||
    (type === HISTORY.toLowerCase() && HISTORY) ||
    (type === SETTINGS.toLowerCase() && SETTINGS)

  const accountTypeData =
    (accountType === COMPANY_ADMIN && user?.accounts?.data[0]?.company) ||
    (accountType === COMPLEX_ADMIN && user?.accounts?.data[0]?.complex)

  return (
    <div className={styles.PageContainer}>
      <div className={styles.PageHeaderContainer}>
        <div className="flex items-center">
          <div className={styles.PageHeaderLogo}>
            <img
              alt="logo"
              src={accountTypeData?.src || IMAGES.PROPERTY_AVATAR}
            />
          </div>
          <div className={styles.PageHeaderTitle}>
            <h1 className={styles.PageHeader}>{accountTypeData?.name || ''}</h1>
            <h2 className={styles.PageHeaderSmall}>
              {(accountType === COMPANY_ADMIN && 'Company') ||
                (accountType === COMPLEX_ADMIN && 'Complex')}
            </h2>
          </div>
        </div>
      </div>

      <Tabs defaultTab={DEFAULT_TAB}>
        <Tabs.TabLabels>
          {settingsTabLabel[routeType] &&
            settingsTabLabel[routeType].map((settingLabel, index) => {
              return (
                <Tabs.TabLabel
                  key={index}
                  id={settingLabel.id}
                  route={`/property/${routeType.toLowerCase()}/${settingLabel.type.toLowerCase()}`}
                >
                  {settingLabel.type}
                </Tabs.TabLabel>
              )
            })}
        </Tabs.TabLabels>
        <Tabs.TabPanels>
          <Tabs.TabPanel id={OVERVIEW}>
            <OverviewTab />
          </Tabs.TabPanel>
          <Tabs.TabPanel id={ABOUT}>
            <AccountTab />
          </Tabs.TabPanel>
          <Tabs.TabPanel id={HISTORY}>
            <HistoryTab />
          </Tabs.TabPanel>
          <Tabs.TabPanel id={SETTINGS}>
            <SettingsTab user={user} />
          </Tabs.TabPanel>
        </Tabs.TabPanels>
      </Tabs>
    </div>
  )
}

export { PropertyComponent }
