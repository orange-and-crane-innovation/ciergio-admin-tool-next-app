import { useState, useEffect } from 'react'
import Table from '@app/components/table'
import Card from '@app/components/card'
import Button from '@app/components/button'
import PageLoader from '@app/components/page-loader'
import { FaPlusCircle, FaTrashAlt } from 'react-icons/fa'

const dummyTableData = {
  data: [
    {
      data1: 'Category 1',
      button: (
        <div className="text-gray-400">
          <FaTrashAlt size="14" />
        </div>
      )
    },
    {
      data2: 'Category 2',
      button: (
        <div className="text-gray-400">
          <FaTrashAlt size="14" />
        </div>
      )
    },
    {
      data3: 'Category 3',
      button: (
        <div className="text-gray-400">
          <FaTrashAlt size="14" />
        </div>
      )
    },
    {
      data4: 'Category 4',
      button: (
        <div className="text-gray-400">
          <FaTrashAlt size="14" />
        </div>
      )
    }
  ]
}

function ManageCategories() {
  const [loading, setLoading] = useState(false)
  return (
    <>
      <div className="flex flex-col">
        <p className="font-bold">My Dues</p>
        <p>Building admins send specific bills through categories you add.</p>
      </div>
      <div className="mt-4 w-3/5">
        <Card
          noPadding
          header={
            <div className="flex items-center justify-between">
              <span className="font-heading font-black">Categories</span>
              <div className="flex items-center justify-end flex-col md:flex-row">
                <Button
                  full
                  primary
                  onClick={e => alert('wew')}
                  label="Add Category"
                  leftIcon={<FaPlusCircle size="13" />}
                />
              </div>
            </div>
          }
          content={loading ? <PageLoader /> : <Table items={dummyTableData} />}
        />
      </div>
    </>
  )
}

export default ManageCategories
