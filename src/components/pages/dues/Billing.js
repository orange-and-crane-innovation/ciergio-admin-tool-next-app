import React, { useState } from 'react'
import Tabs from '@app/components/tabs'
import styles from './Billing.module.css'

import DatePicker from '@app/components/forms/form-datepicker/'

import Unsent from './Unsent'
import Sent from './Sent'

function Billing() {
  const [selectedDate, setSelectedDate] = useState(new Date())

  const handleDateChange = date => {
    setSelectedDate(date)
  }

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
              <DatePicker
                date={selectedDate}
                handleChange={handleDateChange}
                label={'Billing'}
                showMonthYearPicker
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
