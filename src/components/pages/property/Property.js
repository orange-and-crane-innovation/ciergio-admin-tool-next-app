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

const PropertyComponent = () => {
  const user = JSON.parse(localStorage.getItem('profile'))
  const accountType = user?.accounts?.data[0]?.accountType

  const router = useRouter()
  const { type } = router.query

  const DEFAULT_TAB =
    (type === 'overview' && '1') ||
    (!type && '1') ||
    (type === 'about' && '2') ||
    (type === 'history' && '3') ||
    (type === 'settings' && '4')

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
          <Tabs.TabLabel id="1" route="/property/company/overview">
            Overview
          </Tabs.TabLabel>
          <Tabs.TabLabel id="2" route="/property/company/about">
            About
          </Tabs.TabLabel>
          <Tabs.TabLabel id="3" route="/property/company/history">
            History
          </Tabs.TabLabel>
          <Tabs.TabLabel id="4" route="/property/company/settings">
            Settings
          </Tabs.TabLabel>
        </Tabs.TabLabels>
        <Tabs.TabPanels>
          <Tabs.TabPanel id="1">
            <OverviewTab />
          </Tabs.TabPanel>
          <Tabs.TabPanel id="2">
            <AccountTab />
          </Tabs.TabPanel>
          <Tabs.TabPanel id="3">
            <HistoryTab />
          </Tabs.TabPanel>
          <Tabs.TabPanel id="4">
            <SettingsTab user={user} />
          </Tabs.TabPanel>
        </Tabs.TabPanels>
      </Tabs>
    </div>
  )
}

export { PropertyComponent }
