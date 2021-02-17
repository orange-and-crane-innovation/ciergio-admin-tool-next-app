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

import ManageCategories from '../ManageCategories'
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

function Overview({ complexID, complexName }) {
  const [selectedOption, setSelectedOption] = useState()
  const [date, setDate] = useState(new Date())
  const [tableData, setTableData] = useState({
    data: []
  })
  const [optionsData, setOptionsData] = useState(null)

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
      const optionsArray = [{ label: 'All', value: null }]
      data?.getBuildings?.data.forEach((building, index) => {
        tableArray.push({ [`building${index}`]: building.name })
        optionsArray.push({
          label: building.name,
          value: building._id
        })
      })

      setTableData({
        data: tableArray || []
      })

      setOptionsData(optionsArray)
    }
  }, [loading, data, error, refetch])

  const onStatusSelect = val => {
    setSelectedOption(val)
  }

  const handleChangeDate = date => {
    setDate(date)
  }

  return (
    <>
      <h1 className={styles.ComplexName}>{complexName}</h1>
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
                  !loading && tableData.data.length > 0 ? (
                    <Table items={tableData || []} />
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
                {optionsData && (
                  <FormSelect
                    onChange={onStatusSelect}
                    options={optionsData}
                    classNames="mt-6"
                  />
                )}
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
          <Tabs.TabPanel id="2">
            <ManageCategories complexID={complexID} />
          </Tabs.TabPanel>
        </Tabs.TabPanels>
      </Tabs>
    </>
  )
}

export default Overview

Overview.propTypes = {
  complexID: P.string.isRequired,
  complexName: P.string.isRequired
}
