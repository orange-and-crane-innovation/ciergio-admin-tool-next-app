import React, { useState, useEffect } from 'react'
import Tabs from '@app/components/tabs'
import styles from './Billing.module.css'
import DatePicker from '@app/components/forms/form-datepicker/'
import * as Query from './Query'
import Unsent from './Unsent'
import Sent from './Sent'
import { useQuery } from '@apollo/client'
import { isEmpty } from 'lodash'
import Overview from './Overview'

function Billing() {
  const [account, setAccount] = useState('')
  const [category, setCategory] = useState({})

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('profile'))
    const active = user?.accounts?.data.find(acc => acc.active === true)

    setAccount(active)
  }, [])

  const { loading, data, error, refetch } = useQuery(
    Query.GET_ALLOWED_CATEGORY,
    {
      variables: {
        where: {
          accountId: account?._id,
          accountType:
            account?.accountType === 'building_admin' ? 'building' : 'complex'
        },
        limit: 100
      }
    }
  )

  useEffect(() => {
    if (!loading && data) {
      setCategory(data?.getAllowedBillCategory)
    }
  }, [loading, data, error, refetch])

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
    const { data } = category

    return (
      <>
        {data
          ? data
              .find(acc => acc.accountId === account?._id)
              ?.categories.map(category => {
                console.log(category._id)
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
                                categoryID={category._id}
                                buildingID={account?.building._id}
                              />
                            </Tabs.TabPanel>
                            <Tabs.TabPanel id="2">
                              <Sent
                                month={parseInt(month)}
                                year={parseInt(year)}
                                category={category._id}
                                buildingID={account?.building._id}
                                categoryName={category?.name}
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
  }, [category, account])

  return (
    <div className={styles.BillingContainer}>
      <h1 className={styles.BillingHeader}>{account?.building?.name}</h1>
      {account?.accountType !== 'building_admin' ? (
        <Overview />
      ) : (
        billingMemoTabs
      )}
    </div>
  )
}

export default Billing
