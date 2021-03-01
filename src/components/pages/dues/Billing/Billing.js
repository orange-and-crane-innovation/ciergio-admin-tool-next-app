import React, { useState, useEffect, useMemo } from 'react'

import styles from './Billing.module.css'
import DatePicker from '@app/components/forms/form-datepicker/'
import Unsent from './Unsent'
import Sent from './Sent'
import P from 'prop-types'
import { useQuery } from '@apollo/client'
import * as Query from './Query'
import Link from 'next/link'
import Tabs from '@app/components/tabs'
import { useRouter } from 'next/router'

const Billing = () => {
  const router = useRouter()
  const { buildingID } = router.query
  const [selectedDate, setSelectedDate] = useState(new Date())
  // const [activeTab, setActiveTab] = useState(1)
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(new Date().getFullYear())
  const [categories, setCategories] = useState([])
  const [building, setBuilding] = useState([])
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

  const { loading, data, error } = useQuery(Query.GET_ALLOWED_CATEGORY, {
    variables: {
      where: {
        accountType: 'building'
      },
      limit: 100
    }
  })

  const {
    loading: loadingBuilding,
    data: dataBuilding,
    error: errorBuilding
  } = useQuery(Query.GET_BUILDINS, {
    variables: {
      where: {
        _id: buildingID,
        status: 'active'
      },
      limit: 100
    }
  })

  useEffect(() => {
    if (!loadingBuilding && dataBuilding) {
      setBuilding(dataBuilding)
    }
  }, [loadingBuilding, dataBuilding, errorBuilding])

  useEffect(() => {
    if (!loading && data && !error) {
      setCategories(data?.getAllowedBillCategory?.data)
    }
  }, [loading, data, error])

  useEffect(() => {
    console.log(categories)
  }, [categories])

  const handleDateChange = date => {
    setSelectedDate(date)
    setMonth(handlingMonthOrYear(date, 'month'))
    setYear(handlingMonthOrYear(date))
  }

  return (
    <>
      <div className={styles.PageHeaderTitle}>
        <h1 className={styles.PageHeader}>
          {user?.accounts?.data[0]?.building?.name}
        </h1>
      </div>
      <Tabs defaultTab="1">
        <Tabs.TabLabels>
          <Tabs.TabLabel id="1">
            {categories &&
              categories.length > 0 &&
              categories.map((category, index) => {
                return (
                  <>
                    <Tabs.TabLabel id={index + 1}>
                      <Link
                        href={`/dues/billing/${buildingID}/${category?.categories[0]?._id}`}
                      >
                        <a>{category?.categories[0]?.name}</a>
                      </Link>
                    </Tabs.TabLabel>
                  </>
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

Billing.protoTypes = {
  categoryID: P.string.isRequired,
  buildingID: P.string.isRequired,
  categoryName: P.string.isRequired,
  accountID: P.string.isRequired,
  data: P.array.isRequired
}

export default Billing
