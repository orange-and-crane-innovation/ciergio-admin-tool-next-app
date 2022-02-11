import { useState, useEffect } from 'react'
import Table from '@app/components/table'
import Props from 'prop-types'
import styles from './overview.module.css'
import Card from '@app/components/card'
import Button from '@app/components/button'
import { AiOutlinePlusCircle } from 'react-icons/ai'
import { SubscriptionsCard } from '../common'
import { useQuery } from '@apollo/client'
import { getComplexes } from '../_query'
import showToast from '@app/utils/toast'

const ROWS = [
  {
    name: 'Complex Name',
    width: '40%'
  },
  {
    name: '# of Buildings',
    width: '22%'
  },
  {
    name: 'Point of Contact',
    width: '23%'
  },
  {
    name: '',
    width: '5%'
  }
]

const TableComplex = ({ companyId }) => {
  const user = JSON.parse(localStorage.getItem('profile'))
  const companyID = user?.accounts?.data[0]?.company?._id

  const [rows, setRows] = useState([])

  const { data, loading, error } = useQuery(getComplexes, {
    variables: {
      companyId: companyID
    }
  })

  useEffect(() => {
    if (!loading && data && !error) {
      const temp = data.getComplexes?.data?.map(complex => ({
        name: complex.name,
        numOfBuildings: complex.buildings.count,
        pointOfContact: ''
      }))
      const items = {
        count: data.getComplexes?.count,
        limit: data.getComplexes?.limit,
        data: temp
      }

      setRows(items)
    }

    if (!loading && error) {
      showToast('danger', 'Bulk update failed')
    }
  }, [loading, data, error])

  const numberOfComplex = loading && !error ? 0 : data.getComplexes?.count

  return (
    <Card
      header={
        <div className="flex flex-row justify-between">
          <h2 className="font-bold text-lg">{`Complex (${numberOfComplex})`}</h2>
          <Button
            label="Add Complex"
            className="bg-white text-black"
            leftIcon={<AiOutlinePlusCircle size={20} />}
          />
        </div>
      }
      content={<Table rowNames={ROWS} loading={loading} items={rows} />}
    />
  )
}

TableComplex.propTypes = {
  companyId: Props.string
}

const RecentActivityTable = () => {
  const ROWS = [
    {
      name: 'Date',
      width: '25%'
    },
    {
      name: 'User',
      width: '25%'
    },
    {
      name: 'Activity',
      width: '50%'
    }
  ]

  return (
    <Card
      header={
        <div>
          <h2 className="font-bold text-lg">Recent Activity</h2>
        </div>
      }
      content={<Table rowNames={ROWS} />}
    />
  )
}

const OverviewTab = () => {
  return (
    <div className="p-4 flex flex-row justify-between">
      <div className={styles.tableContainer}>
        <TableComplex />
        <RecentActivityTable />
      </div>
      <SubscriptionsCard />
    </div>
  )
}

export { OverviewTab }
