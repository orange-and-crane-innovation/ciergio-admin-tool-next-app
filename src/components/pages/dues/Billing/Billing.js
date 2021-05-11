import React, { useState } from 'react'
import styles from './Billing.module.css'
import Unsent from './Unsent'
import Sent from './Sent'
import P from 'prop-types'
import Tabs from '@app/components/tabs'
import { useRouter } from 'next/router'
import { BsInfoCircle } from 'react-icons/bs'
import { DateInput } from '@app/components/datetime'

const Billing = ({ categoriesBiling, buildingName }) => {
  const router = useRouter()
  const { buildingID } = router.query
  const [selectedDate, setSelectedDate] = useState(new Date())

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

  const handleDateChange = e => {
    setSelectedDate(new Date(e))
    setMonth(handlingMonthOrYear(new Date(e), 'month'))
    setYear(handlingMonthOrYear(new Date(e)))
  }

  return (
    <>
      {categoriesBiling ? (
        <>
          <div className={styles.PageHeaderTitle}>
            <h1 className={styles.PageHeader}>
              {buildingName || user?.accounts?.data[0]?.building?.name}
            </h1>
          </div>
          <Tabs defaultTab="1" className="px-4">
            <Tabs.TabLabels>
              {categoriesBiling &&
                categoriesBiling.map((category, index) => {
                  return (
                    <Tabs.TabLabel
                      key={index}
                      id={String(index + 1)}
                      handleClick={() => alert('test')}
                      route={`/dues/billing/${buildingID}/${category._id}`}
                    >
                      {category.name}
                    </Tabs.TabLabel>
                  )
                })}
            </Tabs.TabLabels>

            <Tabs.TabPanels>
              {categoriesBiling &&
                categoriesBiling.map((category, index) => {
                  return (
                    <Tabs.TabPanel id={String(index + 1)} key={index}>
                      <div className={styles.BillingPeriodContainer}>
                        <DateInput
                          date={selectedDate}
                          onDateChange={handleDateChange}
                          dateFormat="MMMM"
                          showMonth={true}
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
                              buildingName={buildingName}
                            />
                          </Tabs.TabPanel>
                          <Tabs.TabPanel id="2">
                            <Sent
                              month={parseInt(month)}
                              year={parseInt(year)}
                            />
                          </Tabs.TabPanel>
                        </Tabs.TabPanels>
                      </Tabs>
                    </Tabs.TabPanel>
                  )
                })}
            </Tabs.TabPanels>
          </Tabs>{' '}
        </>
      ) : (
        <div className="w-full h-full flex justify-center items-center content-center">
          <div className="w-1/4 flex-col justify-center items-center content-center text-center">
            <BsInfoCircle
              size="100"
              className="w-full text-center"
              fill="rgb(238,52,12)"
            />
            <h3 className="text-5xl">
              Billing has not been setup. Please contact your administrator
            </h3>
          </div>
        </div>
      )}
    </>
  )
}

Billing.propTypes = {
  categoriesBiling: P.array,
  buildingName: P.string
}

export default Billing
