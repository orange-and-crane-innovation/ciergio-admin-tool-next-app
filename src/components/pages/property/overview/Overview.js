import Table from '@app/components/table'
import styles from './overview.module.css'
import Card from '@app/components/card'
import Button from '@app/components/button'
import { AiOutlinePlusCircle } from 'react-icons/ai'
import { SubscriptionsCard } from '../common'

const TableComplex = () => {
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
  return (
    <Card
      header={
        <div className="flex flex-row justify-between">
          <h2 className="font-bold text-lg">Complex(2)</h2>
          <Button
            label="Add Complex"
            className="bg-white text-black"
            leftIcon={<AiOutlinePlusCircle size={20} />}
          />
        </div>
      }
      content={<Table rowNames={ROWS} />}
    />
  )
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
