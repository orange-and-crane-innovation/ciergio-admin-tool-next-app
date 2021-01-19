import { useState } from 'react'
import styles from './Main.module.css'
import SearchControl from '@app/components/globals/SearchControl'
import SelectCategory from '@app/components/globals/SelectCategory'
import SelectStatus from '@app/components/globals/SelectStatus'
import Table from '@app/components/table'
import Pagination from '@app/components/pagination'
import Button from '@app/components/button'
import Card from '@app/components/card'
import FormInput from '@app/components/forms/form-input'
import { FaEye } from 'react-icons/fa'

function Sent() {
  const [selectedFloor, setSelectedFloor] = useState('')
  const [searchText, setSearchText] = useState('')

  const tableData = {
    count: 161,
    limit: 10,
    offset: 0,
    data: [
      {
        bldgNo: '1'
      },
      {
        bldgNo: '',
        unit: '101',
        unitOwner: 'Cruz Santa',
        uploadFile: <Button default full />,
        amount: <FormInput type="text" placeholder="0.0" />,
        duedate: <FormInput type="text" placeholder="Due Date" />,
        button: <Button default full />
      }
    ]
  }

  const tableRowData = [
    {
      name: 'Seen',
      width: '10%'
    },
    {
      name: 'Unit',
      width: '10%'
    },
    {
      name: 'Unit Owner',
      width: '15%'
    },
    {
      name: 'Upload File',
      width: '15%'
    },
    {
      name: 'Amount (Optional)',
      width: '20%'
    },
    {
      name: 'Due Date',
      width: '15%'
    },
    {
      name: 'Paid',
      width: '15%'
    }
  ]

  //   Select Floors onchange
  const onFloorSelect = e => {}
  // =============

  //  Select Floors On Clear Category
  const onClearFloor = e => {}
  // ============

  // Handle Searches
  const onSearch = e => {}
  // ==========

  // Clear searches
  const onClearSearch = e => {}
  // ==============

  return (
    <>
      <div className={styles.FormContainer}>
        <div className={styles.StatusFloorControl}>
          <SelectStatus
            type="post"
            userType="administrators"
            onChange={onFloorSelect}
            onClear={onClearFloor}
            selected={selectedFloor}
          />
          <SelectCategory
            type="post"
            userType="administrators"
            onChange={onFloorSelect}
            onClear={onClearFloor}
            selected={selectedFloor}
          />
          <SearchControl
            placeholder="Search by title"
            searchText={searchText}
            onSearch={onSearch}
            onClearSearch={onClearSearch}
            className={styles.SearchControl}
          />
        </div>
      </div>

      <Card
        noPadding
        header={
          <div className={styles.ContentFlex}>
            <span className={styles.CardHeader}>My Dues</span>
            <div className={styles.InfoViewText}>
              <FaEye />
              <div>
                Bill viewed <span className={styles.BoldText}>0</span>/0 units
                bills
              </div>
            </div>
          </div>
        }
        content={<Table rowNames={tableRowData} items={{}} />}
      />

      <Pagination
        items={tableData}
        activePage={1}
        onPageClick={e => alert('Page ' + e)}
        onLimitChange={e => alert('Show ' + e.target.value)}
      />
    </>
  )
}

export default Sent
