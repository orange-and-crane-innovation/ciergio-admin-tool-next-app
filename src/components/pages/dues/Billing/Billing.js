import React, { useState } from 'react'
import styles from './Billing.module.css'
import DatePicker from '@app/components/forms/form-datepicker/'
import Unsent from './Unsent'
import Sent from './Sent'
import P from 'prop-types'
import Link from 'next/link'
import Tabs from '@app/components/tabs'
import { useRouter } from 'next/router'

const Billing = ({ categoriesBiling, buildingName }) => {
  const router = useRouter()
  const { buildingID } = router.query
  const [selectedDate, setSelectedDate] = useState(new Date())
  // const [activeTab, setActiveTab] = useState(1)
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(new Date().getFullYear())

  const user = JSON.parse(localStorage.getItem('profile'))

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
    <>
      <div className={styles.PageHeaderTitle}>
        <h1 className={styles.PageHeader}>
          {buildingName || user?.accounts?.data[0]?.building?.name}
        </h1>
      </div>
      <Tabs defaultTab="1">
        <Tabs.TabLabels>
          <Tabs.TabLabel id="1">
            {categoriesBiling &&
              categoriesBiling.map((category, index) => {
                return (
                  <Tabs.TabLabel key={index} id={String(index + 1)}>
                    <Link href={`/dues/billing/${buildingID}/${category._id}`}>
                      <a>{category.name}</a>
                    </Link>
                  </Tabs.TabLabel>
                )
              })}
          </Tabs.TabLabel>
        </Tabs.TabLabels>

        <Tabs.TabPanels>
          <Tabs.TabPanel id="1">
            <div className={styles.BillingPeriodContainer}>
              <DatePicker
                date={selectedDate}
                onChange={handleDateChange}
                label={'Billing Period'}
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
    </>
  )
}

Billing.propTypes = {
  categoriesBiling: P.array,
  buildingName: P.string
}

export default Billing
