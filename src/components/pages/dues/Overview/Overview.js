import { useState } from 'react'
import Card from '@app/components/card'
import PageLoader from '@app/components/page-loader'
import Table from '@app/components/table'
import DatePicker from '@app/components/forms/form-datepicker/'
import FormSelect from '@app/components/globals/FormSelect'
import { Bar } from '@reactchartjs/react-chart.js'

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

function Overview() {
  const [loading, setLoading] = useState(false)
  const [selectedOption, setSelectedOption] = useState()
  const [date, setDate] = useState(new Date())

  const onStatusSelect = val => {
    setSelectedOption(val)
  }

  const handleChangeDate = date => {
    setDate(date)
  }

  return (
    <>
      <div className={styles.tableContainer}>
        <Card
          noPadding
          header={
            <div className={styles.ContentFlex}>
              <span className={styles.CardHeader}>Buildings</span>
            </div>
          }
          content={loading ? <PageLoader /> : <Table items={dummyTableData} />}
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
              <span className={styles.CardHeader}>Sent vs Seen Bills</span>
            </div>
          }
          content={<Bar data={data} />}
        />
      </div>
    </>
  )
}

export default Overview
