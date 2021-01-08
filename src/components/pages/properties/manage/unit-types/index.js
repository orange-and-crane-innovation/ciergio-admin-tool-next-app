/* eslint-disable react/jsx-key */
import React from 'react'
import { FaPlusCircle, FaEllipsisH } from 'react-icons/fa'
import { FiEdit2, FiTrash2 } from 'react-icons/fi'

import Card from '@app/components/card'
import Button from '@app/components/button'
import Table from '@app/components/table'
import Pagination from '@app/components/pagination'
import Dropdown from '@app/components/dropdown'

import styles from './index.module.css'

const UnitTypeComponent = () => {
  const dropdownData = [
    {
      label: 'Edit Unit Type',
      icon: <FiEdit2 />,
      function: () => alert('clicked')
    },
    {
      label: 'Delete Unit Type',
      icon: <FiTrash2 />,
      function: () => alert('clicked')
    }
  ]

  const tableData = {
    count: 161,
    limit: 10,
    offset: 0,
    data: [
      {
        unit: 'Mid-Rise',
        button: <Dropdown label={<FaEllipsisH />} items={dropdownData} />
      },
      {
        unit: '3 Rooms Unit',
        button: <Dropdown label={<FaEllipsisH />} items={dropdownData} />
      },
      {
        unit: 'Mid Zone (Floor 11 - 20)',
        button: <Dropdown label={<FaEllipsisH />} items={dropdownData} />
      },
      {
        unit: '2BR',
        button: <Dropdown label={<FaEllipsisH />} items={dropdownData} />
      }
    ]
  }

  return (
    <div className={styles.PageContainer}>
      <h1 className={styles.PageHeader}>Manage Unit Types</h1>
      <Card
        noPadding
        header={
          <div className={styles.ContentFlex}>
            <span className={styles.CardHeader}>Global Unit Type</span>
            <Button
              default
              leftIcon={<FaPlusCircle />}
              label="Create Unit Type"
              onClick={() => alert('Button clicked!')}
            />
          </div>
        }
        content={<Table items={tableData} />}
      />
      <Pagination
        items={tableData}
        activePage={1}
        onPageClick={e => alert('Page ' + e)}
        onLimitChange={e => alert('Show ' + e.target.value)}
      />
    </div>
  )
}

export default UnitTypeComponent
