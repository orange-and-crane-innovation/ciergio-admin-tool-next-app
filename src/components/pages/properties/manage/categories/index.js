/* eslint-disable react/jsx-key */
import React, { useState } from 'react'
import { FaPlusCircle, FaEllipsisH } from 'react-icons/fa'
import { FiEdit2 } from 'react-icons/fi'

import Card from '@app/components/card'
import Button from '@app/components/button'
import Table from '@app/components/table'
import Pagination from '@app/components/pagination'
import Dropdown from '@app/components/dropdown'
import Pills from '@app/components/pills'

import styles from './index.module.css'

const CategoriesComponent = () => {
  const [activeKey, setActiveKey] = useState('post')
  let pageHeader = ''

  const dropdownData = [
    {
      label: 'Edit Category',
      icon: <FiEdit2 />,
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

  const pillData = [
    {
      name: 'Bulletin Board',
      value: 'post'
    },
    {
      name: 'Maintenance and Repairs',
      value: 'issue'
    },
    {
      name: 'Notifications',
      value: 'flash'
    }
  ]

  const onButtonClick = id => {
    setActiveKey(id)
  }

  if (activeKey === 'post') {
    pageHeader = 'Bulletin Board'
  } else if (activeKey === 'issue') {
    pageHeader = 'Maintenance and Repairs'
  } else if (activeKey === 'flash') {
    pageHeader = 'Flash Notifications'
  }

  return (
    <div className={styles.PageContainer}>
      <h1 className={styles.PageHeader}>Manage Global Categories</h1>
      <div className="flex">
        <div className="w-1/4 mr-4">
          <Pills
            data={pillData}
            activeKey={activeKey}
            onClick={onButtonClick}
          />
        </div>
        <div className="w-3/4">
          <Card
            noPadding
            header={
              <div className={styles.ContentFlex}>
                <span className={styles.CardHeader}>
                  Categories for {pageHeader}
                </span>
                <Button
                  default
                  leftIcon={<FaPlusCircle />}
                  label="Create Category"
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
      </div>
    </div>
  )
}

export default CategoriesComponent
