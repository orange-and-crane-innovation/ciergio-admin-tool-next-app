import React, { useState } from 'react'
import Tabs from '@app/components/tabs'
import styles from './Billing.module.css'
// import { useRouter } from 'next/router'

import DatePicker from '@app/components/forms/form-datepicker/'

import Unsent from './Unsent'
import Sent from './Sent'

function Billing() {
  // const router = useRouter()
  const [selectedDate, setSelectedDate] = useState(new Date())
  // const [activeTab, setActiveTab] = useState(1)
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(new Date().getFullYear())

  const handlingMonthOrYear = (date, type = 'year') => {
    if (date instanceof Date) {
      if (type === 'month') {
        return new Date(date).getMonth() + 1
      } else {
        return new Date(date).getFullYear()
      }
    }
    return new Date()
  }

  const handleDateChange = date => {
    setSelectedDate(date)
    setMonth(handlingMonthOrYear(date, 'month'))
    setYear(handlingMonthOrYear(date))
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
                onChange={handleDateChange}
                label={'Billing'}
                showMonthYearPicker
                rightIcon
              />
            </div>

            <Tabs defaultTab="1">
              <Tabs.TabLabels>
                <Tabs.TabLabel id="1">Unsent</Tabs.TabLabel>
                <Tabs.TabLabel id="2">Sent</Tabs.TabLabel>
              </Tabs.TabLabels>
              <Tabs.TabPanels>
                <Tabs.TabPanel id="1">
                  <Unsent month={parseInt(month)} year={parseInt(year)} />
                </Tabs.TabPanel>
                <Tabs.TabPanel id="2">
                  <Sent month={parseInt(month)} year={parseInt(year)} />
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
