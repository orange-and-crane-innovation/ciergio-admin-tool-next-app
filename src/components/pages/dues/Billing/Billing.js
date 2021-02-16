import React, { useState, useEffect } from 'react'
import Tabs from '@app/components/tabs'
import styles from './Billing.module.css'
import DatePicker from '@app/components/forms/form-datepicker/'
import Unsent from './Unsent'
import Sent from './Sent'
import P from 'prop-types'

function Billing({ categoryID, buildingID, categoryName, accountID, data }) {
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
  const billingMemoTabs = React.useMemo(() => {
    if (categoryID && buildingID && categoryName && accountID && data) {
      return (
        <>
          {data
            ? data
                .find(acc => acc.accountId === accountID)
                ?.categories.map(category => {
                  return (
                    <Tabs defaultTab="1" key={category._id}>
                      <Tabs.TabLabels>
                        <Tabs.TabLabel id="1">{category.name}</Tabs.TabLabel>
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
                                <Unsent
                                  month={parseInt(month)}
                                  year={parseInt(year)}
                                  categoryID={categoryID}
                                  buildingID={buildingID}
                                  categoryName={categoryName}
                                />
                              </Tabs.TabPanel>
                              <Tabs.TabPanel id="2">
                                <Sent
                                  month={parseInt(month)}
                                  year={parseInt(year)}
                                  categoryID={categoryID}
                                  buildingID={buildingID}
                                  categoryName={categoryName}
                                />
                              </Tabs.TabPanel>
                            </Tabs.TabPanels>
                          </Tabs>
                        </Tabs.TabPanel>
                      </Tabs.TabPanels>
                    </Tabs>
                  )
                })
            : null}
        </>
      )
    }
  }, [categoryID, buildingID, categoryName, accountID])

  return <>{billingMemoTabs}</>
}

export default Billing

Billing.protoTypes = {
  categoryID: P.string.isRequired,
  buildingID: P.string.isRequired,
  categoryName: P.string.isRequired,
  accountID: P.string.isRequired,
  data: P.array.isRequired
}
