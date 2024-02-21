import { useState, useEffect, useMemo } from 'react'
import Card from '@app/components/card'
import PageLoader from '@app/components/page-loader'
import Table from '@app/components/table'
import DatePicker from '@app/components/forms/form-datepicker/'
import FormSelect from '@app/components/forms/form-select'
import { HorizontalBar } from '@reactchartjs/react-chart.js'
import Tabs from '@app/components/tabs'
import * as Query from './Query'
import { useQuery } from '@apollo/client'
import P from 'prop-types'
import { useRouter } from 'next/router'
import Link from 'next/link'
import ManageCategories from '../ManageCategories'
import styles from './Overview.module.css'
import { DateInput } from '@app/components/datetime'

function Overview({ complexID, complexName, accountType }) {
  const router = useRouter()

  const [selectedOption, setSelectedOption] = useState()
  const [date, setDate] = useState(new Date())

  const [tableData, setTableData] = useState({
    data: []
  })
  const [period, setPeriod] = useState({})

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
        complexId: complexID || null
      }
    }
  })

  const {
    loading: loadingBreakdown,
    data: dataBreakdown,
    error: errorBreakdown,
    refetch: refetchBreakDown
  } = useQuery(Query.GET_BREAKDOWN, {
    variables: {
      where: {
        period: period,
        buildingIds: selectedOption?.value
      }
    }
  })

  useEffect(() => {
    if (!loadingBreakdown && dataBreakdown && !errorBreakdown) {
      const dataChart = dataBreakdown?.getDueBreakdown2?.data.map(item => {
        return {
          sent: item.count.sentDues,
          seen: item.count.uniqueSentViews
        }
      })

      if (dataChart[0]) {
        setChartData(prevChartData => ({
          ...prevChartData,
          datasets: [
            {
              label: 'Seen',
              data: [dataChart[0].sent],
              backgroundColor: 'rgb(238,52,12)'
            },
            {
              label: 'Sent',
              data: [dataChart[0].seen],
              backgroundColor: 'rgb(238,52,12)'
            }
          ]
        }))
      }
    }
  }, [loadingBreakdown, dataBreakdown, errorBreakdown, refetchBreakDown])

  useEffect(() => {
    if (!loading && !error && data) {
      const tableArray = []
      const optionsArray = [{ label: 'All', value: null }]
      const buildingIdsArray = []
      data?.getBuildings?.data.forEach((building, index) => {
        tableArray.push({ [`${building._id}`]: building.name })
        optionsArray.push({
          label: building.name,
          value: [building._id]
        })
        buildingIdsArray.push(building._id)
      })
      optionsArray[0].value = buildingIdsArray

      setTableData({
        data: tableArray || []
      })

      setOptionsData(optionsArray)
    }
  }, [loading, data, error, refetch])

  const onBuildingSelect = val => {
    setSelectedOption(val)
    refetchBreakDown()
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
    const parseDate = new Date(date)
    setDate(parseDate)
    setPeriod({
      month: handlingMonthOrYear(parseDate, 'month'),
      year: handlingMonthOrYear(parseDate)
    })
    refetchBreakDown()
  }

  const rowClicked = data => {
    const buildingID = Object.keys(data)
    router.push(`/dues/billing/${buildingID[0]}`)
  }

  const tabs = useMemo(() => {
    return (
      <>
        <h1 className={styles.ComplexName}>{complexName}</h1>
        <Tabs
          defaultTab={router.pathname === '/dues/manage-categories' ? '2' : '1'}
        >
          <Tabs.TabLabels>
            <Tabs.TabLabel id="1">
              <Link legacyBehavior href="/dues/overview">
                <a>Overview</a>
              </Link>
            </Tabs.TabLabel>
            <Tabs.TabLabel id="2">
              <Link legacyBehavior href="/dues/manage-categories">
                <a>Manage Categories</a>
              </Link>
            </Tabs.TabLabel>
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
                      <Table
                        items={tableData || []}
                        emptyText="No Buildings"
                        onRowClick={rowClicked}
                      />
                    ) : (
                      <PageLoader />
                    )
                  }
                />
              </div>
              <div className={styles.FormContainer}>
                <div className={styles.DateController}>
                  <DateInput
                    date={date}
                    onDateChange={handleDateChange}
                    dateFormat="MMMM YYYY"
                    showMonth={true}
                  />
                </div>
                <div className={styles.SelectControl}>
                  {optionsData && (
                    <FormSelect
                      value={selectedOption}
                      onChange={onBuildingSelect}
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
              <ManageCategories
                complexID={complexID}
                accountType={accountType}
              />
            </Tabs.TabPanel>
          </Tabs.TabPanels>
        </Tabs>
      </>
    )
  }, [
    router,
    complexID,
    accountType,
    onBuildingSelect,
    optionsData,
    handleDateChange,
    date,
    loading,
    tableData,
    complexName,
    rowClicked
  ])

  return <>{tabs}</>
}

export default Overview

Overview.propTypes = {
  complexID: P.string,
  complexName: P.string,
  accountType: P.string
}
