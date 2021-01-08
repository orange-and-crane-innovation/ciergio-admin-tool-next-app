import React, { useState } from 'react'

import FormSelect from '@app/components/forms/form-select'
import FormInput from '@app/components/forms/form-input'
import Button from '@app/components/button'
import Table from '@app/components/table'
import Pagination from '@app/components/pagination'
import { Card } from '@app/components/globals'

import { FaTimes, FaSearch, FaPlusCircle } from 'react-icons/fa'
import { HiOutlinePrinter } from 'react-icons/hi'
import { FiDownload } from 'react-icons/fi'

import AddResidentModal from '@app/components/pages/residents/AddResidentModal'
import ViewResidentModal from './ViewResidentModal'

const tableRows = [
  {
    name: 'Name',
    width: ''
  },
  {
    name: 'Email',
    width: ''
  },
  {
    name: 'Date Registered',
    width: ''
  },
  {
    name: 'Last Activity',
    width: ''
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

  return (
    <section className="content-wrap">
      <h1 className="content-title">Registered Members</h1>

      <div className="flex items-center justify-end mt-12 mx-4 w-full">
        <div className="flex items-center justify-between w-8/12 flex-row">
          <FormSelect options={[]} className="mr-4" placeholder="Choose One" />
          <FormSelect
            options={[]}
            className="mr-4"
            placeholder="Filter Verified Email"
          />
          <div className="w-full relative mr-4">
            <span className="absolute top-4 left-4">
              {searchText ? (
                <FaTimes className="cursor-pointer" onClick={() => {}} />
              ) : (
                <FaSearch />
              )}
            </span>
            <FormInput
              name="search"
              placeholder="Search"
              inputClassName="pl-8"
              onChange={e => setSearchText(e.target.value)}
              value={searchText}
            />
          </div>
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
            rowNames={tableRows}
            items={tableData}
            onRowClick={resident => {
              setSelectedResident(resident)
              setViewResident(old => !old)
            }}
          />
        }
      />
      <Pagination
        items={tableData}
        activePage={1}
        onPageClick={e => alert('Page ' + e)}
        onLimitChange={e => alert('Show ' + e.target.value)}
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
