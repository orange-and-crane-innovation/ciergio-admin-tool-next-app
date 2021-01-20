import { useState } from 'react'
import Tabs from '@app/components/tabs'
import FormInput from '@app/components/forms/form-input'
import styles from './Billing.module.css'

import Unsent from './Unsent'
import Sent from './Sent'

function Billing() {
  const [searchInput, setSearchInput] = useState('')
  return (
    <div className={styles.BillingContainer}>
      <h1 className={styles.BillingHeader}>Sample Building Unit</h1>
      <Tabs defaultTab="1">
        <Tabs.TabLabels>
          <Tabs.TabLabel id="1">Wellington Building A Dues</Tabs.TabLabel>
        </Tabs.TabLabels>
        <Tabs.TabPanels>
          <Tabs.TabPanel id="1">
            <div className={styles.BillingPeriodContainer}>
              <h1 className={styles.HeaderSmall}>Billing Periods</h1>
              <FormInput
                type="text"
                placeholder={new Date()}
                name="search-contact-input"
                leftIcon="ciergio-search"
                onChange={e => setSearchInput(e.target.value)}
                value={searchInput}
              />
            </div>

            <Tabs defaultTab="1">
              <Tabs.TabLabels>
                <Tabs.TabLabel id="1">Unsent</Tabs.TabLabel>
                <Tabs.TabLabel id="2">Sent</Tabs.TabLabel>
              </Tabs.TabLabels>
              <Tabs.TabPanels>
                <Tabs.TabPanel id="1">
                  <Unsent />
                </Tabs.TabPanel>
                <Tabs.TabPanel id="2">
                  <Sent />
                </Tabs.TabPanel>
              </Tabs.TabPanels>
            </Tabs>
          </Tabs.TabPanel>
        </Tabs.TabPanels>
      </Tabs>
    </div>
  )
}

export default Billing
