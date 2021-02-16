import { useState, useEffect } from 'react'
import Card from '@app/components/card'
import PageLoader from '@app/components/page-loader'
import Table from '@app/components/table'
import DatePicker from '@app/components/forms/form-datepicker/'
import FormSelect from '@app/components/globals/FormSelect'
import { Bar } from '@reactchartjs/react-chart.js'
import Tabs from '@app/components/tabs'
import * as Query from './Query'
import { useQuery } from '@apollo/client'
import P from 'prop-types'

import styles from './Overview.module.css'

const data = {
  labels: ['Sent', 'Seen'],
  datasets: [
    {
      label: 'Sent',
      data: [
        'Jan',
        'Feb',
        'March',
        'April',
        'May',
        'June',
        'July',
        'Aug',
        'Sept',
        'Oct',
        'Nov',
        'Decs'
      ],
      backgroundColor: ['rgb(238,52,12)'],
      borderWidth: 1
    },
    {
      label: 'Seen',
      data: [
        'Jan',
        'Feb',
        'March',
        'April',
        'May',
        'June',
        'July',
        'Aug',
        'Sept',
        'Oct',
        'Nov',
        'Decs'
      ],
      backgroundColor: ['rgba(238,52,12,0.2)'],
      borderWidth: 1
    }
  ]
}

const dummyOptions = [
  {
    label: 'All Status',
    value: null
  },
  {
    label: 'Paid',
    value: 'paid'
  },
  {
    label: 'Unpaid',
    value: 'unpaid'
  }
]

const dummyTableData = {
  data: [
    { building1: 'Building' },
    { building2: 'Building 2' },
    { building3: 'Building 3' },
    { building4: 'Building 4' }
  ]
}

function Overview({ complexID }) {
  const [selectedOption, setSelectedOption] = useState()
  const [date, setDate] = useState(new Date())
  const [tableData, setTableData] = useState()

  const { loading, data, error, refetch } = useQuery(Query.GET_BUILDINS, {
    variables: {
      where: {
        complexId: complexID
      }
    }
  })

  useEffect(() => {
    if (!loading && !error && data) {
      const tableArray = []
      data?.getBuildings?.data.forEach((building, index) => {
        tableArray.push({ [`building${index}`]: building.name })
      })

      setTableData({
        data: tableArray || []
      })
    }
  }, [loading, data, error, refetch])

  useEffect(() => {
    console.log(tableData)
  }, [tableData])

  const onStatusSelect = val => {
    setSelectedOption(val)
  }

  const handleChangeDate = date => {
    setDate(date)
  }

  return (
    <>
      <Tabs defaultTab="1">
        <Tabs.TabLabels>
          <Tabs.TabLabel id="1">Overview</Tabs.TabLabel>
          <Tabs.TabLabel id="2">Manage Categories</Tabs.TabLabel>
        </Tabs.TabLabels>
        <Tabs.TabPanels>
          <Tabs.TabPanel id="1">
            <div className={styles.tableContainer}>
              <Card
                noPadding
                header={
                  <div className={styles.ContentFlex}>
                    <span className={styles.CardHeader}>Buildings</span>
                  </div>
                }
                content={
                  !loading && data ? (
                    <Table items={tableData} />
                  ) : (
                    <PageLoader />
                  )
                }
              />
            </div>
            <div className={styles.FormContainer}>
              <div className={styles.DateController}>
                <DatePicker
                  rightIcon
                  selected={date}
                  onChange={handleChangeDate}
                  label={'Billing Period'}
                />
              </div>
              <div className={styles.SelectControl}>
                <FormSelect
                  onChange={onStatusSelect}
                  options={dummyOptions}
                  classNames="mt-6"
                />
              </div>
            </div>
            <div className={styles.ChartContainer}>
              <Card
                noPadding
                header={
                  <div className={styles.ContentFlex}>
                    <span className={styles.CardHeader}>
                      Sent vs Seen Bills
                    </span>
                  </div>
                }
                content={<Bar data={data} />}
              />
            </div>
          </Tabs.TabPanel>
        </Tabs.TabPanels>
      </Tabs>
    </>
  )
}

export default Overview

Overview.propTypes = {
  complexID: P.string.isRequired
}
