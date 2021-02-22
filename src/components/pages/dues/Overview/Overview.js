import { useState, useEffect } from 'react'
import Card from '@app/components/card'
import PageLoader from '@app/components/page-loader'
import Table from '@app/components/table'
import DatePicker from '@app/components/forms/form-datepicker/'
import FormSelect from '@app/components/globals/FormSelect'
import { HorizontalBar } from '@reactchartjs/react-chart.js'
import Tabs from '@app/components/tabs'
import * as Query from './Query'
import { useQuery } from '@apollo/client'
import P from 'prop-types'

import ManageCategories from '../ManageCategories'
import styles from './Overview.module.css'

function Overview({ complexID, complexName, accountType }) {
  const [selectedOption, setSelectedOption] = useState()
  const [date, setDate] = useState(new Date())
  const [tableData, setTableData] = useState({
    data: []
  })
  const [period, setPeriod] = useState({})
  const [buildingIds, setBuildingIds] = useState()
  const [optionsData, setOptionsData] = useState(null)
  const [chartData, setChartData] = useState({
    labels: ['Monthly Amortization'],
    datasets: [
      {
        label: 'Seen',
        data: [0],
        backgroundColor: 'rgb(238,52,12)'
      },
      {
        label: 'Sent',
        data: [0],
        backgroundColor: 'rgb(200,52,12)'
      }
    ]
  })

  const { loading, data, error, refetch } = useQuery(Query.GET_BUILDINS, {
    variables: {
      where: {
        complexId: complexID
      }
    }
  })

  const {
    loading: loadingBreakdown,
    data: dataBreakdown,
    error: errorBreakdown
  } = useQuery(Query.GET_BUILDINS, {
    variables: {
      where: {
        period: period,
        buildingIds: buildingIds
      }
    }
  })

  useEffect(() => {
    if (!loadingBreakdown && dataBreakdown && !errorBreakdown) {
      console.log(dataBreakdown)
    }
  }, [loadingBreakdown, dataBreakdown, errorBreakdown])

  useEffect(() => {
    if (!loading && !error && data) {
      const tableArray = []
      const optionsArray = [{ label: 'All', value: null }]
      const buildingIdsArray = []
      data?.getBuildings?.data.forEach((building, index) => {
        tableArray.push({ [`${building._id}`]: building.name })
        optionsArray.push({
          label: building.name,
          value: building._id
        })
        buildingIdsArray.push(building._id)
      })
      setBuildingIds(buildingIdsArray)
      setTableData({
        data: tableArray || []
      })

      setOptionsData(optionsArray)
    }
  }, [loading, data, error, refetch])

  const onStatusSelect = val => {
    setSelectedOption(val)
  }

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
    setDate(date)
    setPeriod({
      month: handlingMonthOrYear(date, 'month'),
      year: handlingMonthOrYear(date)
    })
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
                  onChange={handleDateChange}
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
                content={<HorizontalBar data={chartData} />}
              />
            </div>
          </Tabs.TabPanel>
          <Tabs.TabPanel id="2">
            <ManageCategories complexID={complexID} accountType={accountType} />
          </Tabs.TabPanel>
        </Tabs.TabPanels>
      </Tabs>
    </>
  )
}

export default Overview

Overview.propTypes = {
  complexID: P.string.isRequired,
  complexName: P.string.isRequired,
  accountType: P.string.isRequired
}
