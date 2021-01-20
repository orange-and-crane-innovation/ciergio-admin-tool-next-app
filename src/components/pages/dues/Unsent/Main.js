import { useState } from 'react'
import styles from './Main.module.css'
import SearchControl from '@app/components/globals/SearchControl'
import SelectCategory from '@app/components/globals/SelectCategory'
import Table from '@app/components/table'
import Pagination from '@app/components/pagination'
import Button from '@app/components/button'
import Card from '@app/components/card'
import FormInput from '@app/components/forms/form-input'

function Unsent() {
  const [selectedCategory, setSelectedCategory] = useState('')
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
        uploadFile: <Button default full label="Choose File" />,
        amount: <FormInput type="text" placeholder="0.0" />,
        duedate: <FormInput type="text" placeholder="Due Date" />,
        button: <Button default disabled label="Upload File" />
      }
    ]
  }

  const tableRowData = [
    {
      name: '',
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
      name: '',
      width: '15%'
    }
  ]

  //   Select Floors onchange
  const onCategorySelect = e => {}
  // =============

  //  Select Floors On Clear Category
  const onClearCategory = e => {}
  // ============

  // Handle Searches
  const onSearch = e => {}
  // ==========

  // Clear searches
  const onClearSearch = e => {}
  // ==============

  const calendarIcon = () => <span className="ciergio-calendar"></span>
  return (
    <>
      <div className={styles.FormContainer}>
        <div className={styles.DueDateControl}>
          <Button
            primary
            label="Apply Due Dates to All Units"
            leftIcon={calendarIcon()}
          />
        </div>
        <div className={styles.FloorControl}>
          <SelectCategory
            type="post"
            userType="administrators"
            onChange={onCategorySelect}
            onClear={onClearCategory}
            selected={selectedCategory}
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
              <span className="ciergio-dues"></span>
              <div>
                Bill sent <span className={styles.BoldText}>0</span>/17 units
              </div>
            </div>
          </div>
        }
        content={<Table rowNames={tableRowData} items={tableData} />}
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

export default Unsent
