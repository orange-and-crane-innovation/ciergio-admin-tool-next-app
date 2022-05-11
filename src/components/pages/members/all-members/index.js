import { debounce } from 'lodash'
import React, { useState } from 'react'
import { FaPlusCircle } from 'react-icons/fa'
import { FiDownload } from 'react-icons/fi'
import { HiOutlinePrinter } from 'react-icons/hi'

import Button from '@app/components/button'
import SearchControl from '@app/components/globals/SearchControl'
import { Action, Card, Table } from '@app/components/globals'
import AddResidentModal from '@app/components/pages/residents/components/AddResidentModal'

import ViewResidentModal from './../ViewResidentModal'

const tableRows = [
  {
    Header: 'Name',
    accessor: 'full_name'
  },
  {
    Header: 'Email',
    accessor: 'email'
  },
  {
    Header: 'Date Registered',
    accessor: 'date_reg'
  },
  {
    Header: 'Last Activity',
    accessor: 'last_active'
  },
  {
    id: 'action',
    accessor: row => row,
    Cell: Action
  }
]

const tableData = {
  count: 161,
  limit: 10,
  offset: 0,
  data: [
    {
      full_name: 'Jane Cooper',
      first_name: 'Jane',
      last_name: 'Cooper',
      email: 'jane.cooper@gmail.com',
      birthday: 'Jan 1, 1990',
      gender: 'female',
      date_reg: 'Jun 19, 2020',
      last_active: 'June 19, 2020',
      device_used: 'Apple - iPhone X'
    },
    {
      full_name: 'Cameron Williamson',
      first_name: 'Cameron',
      last_name: 'Williamson',
      email: 'cameron@gmail.com',
      birthday: 'Jan 1, 1990',
      gender: 'male',
      date_reg: 'Jun 19, 2020',
      last_active: 'June 19, 2020',
      device_used: 'Apple - iPhone 12'
    },
    {
      full_name: 'Jenny Wilson',
      first_name: 'Jenny',
      last_name: 'Wilson',
      email: 'jenny.wilson@gmail.com',
      birthday: 'Jan 1, 1990',
      gender: 'female',
      date_reg: 'Jun 19, 2020',
      last_active: 'June 19, 2020',
      device_used: 'Samsung - Note 10S'
    },
    {
      full_name: 'Jacob Jones',
      first_name: 'Jacob',
      last_name: 'Jones',
      email: 'jacob@gmail.com',
      birthday: 'Jan 1, 1990',
      gender: 'male',
      date_reg: 'Jun 19, 2020',
      last_active: 'June 19, 2020',
      device_used: 'Apple - iPhone 11'
    }
  ]
}

function MyMembers() {
  const [searchText, setSearchText] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [viewResident, setViewResident] = useState(false)
  const [selectedResident, setSelectedResident] = useState(null)

  const handleShowModal = () => setShowModal(old => !old)

  const handleResidentView = () => setViewResident(old => !old)

  const onSearch = debounce(e => {
    setSearchText(e.target.value !== '' ? e.target.value : null)
  }, 1000)

  const onClearSearch = () => {
    setSearchText(null)
  }

  return (
    <section className="content-wrap">
      <h1 className="content-title">Registered Members</h1>

      <div className="flex items-center justify-end mt-12 w-full">
        <div className="flex items-center justify-between w-8/12 flex-row flex-row-reverse">
          <SearchControl
            placeholder="Search"
            searchText={searchText}
            onSearch={onSearch}
            onClearSearch={onClearSearch}
          />
        </div>
      </div>

      <div className="flex items-center justify-between bg-white border-t border-l border-r rounded-t">
        <h1 className="font-bold text-base px-8 py-4">{`Residents`}</h1>
        <div className="flex items-center">
          <Button
            default
            icon={<HiOutlinePrinter />}
            onClick={() => {}}
            className="mr-4 mt-4"
          />
          <Button
            default
            icon={<FiDownload />}
            onClick={() => {}}
            className="mr-4 mt-4"
          />
          <Button
            default
            leftIcon={<FaPlusCircle />}
            label="Add Resident"
            onClick={handleShowModal}
            className="mr-4 mt-4"
          />
        </div>
      </div>
      <Card
        content={
          <Table
            columns={tableRows}
            payload={tableData}
            onRowClick={resident => {
              setSelectedResident(resident)
              setViewResident(old => !old)
            }}
            pagination
          />
        }
      />

      <AddResidentModal showModal={showModal} onShowModal={handleShowModal} />
      <ViewResidentModal
        showModal={viewResident}
        onShowModal={handleResidentView}
        resident={selectedResident}
      />
    </section>
  )
}

export default MyMembers
