import React, { useState } from 'react'

import FormSelect from '@app/components/forms/form-select'
import FormInput from '@app/components/forms/form-input'
import Button from '@app/components/button'
import Table from '@app/components/table'
import { Card } from '@app/components/globals'

import { FaTimes, FaSearch, FaPlusCircle } from 'react-icons/fa'
import { HiOutlinePrinter } from 'react-icons/hi'
import { FiDownload } from 'react-icons/fi'
import AddResidentModal from '../AddResidentModal'

const floors = [
  {
    label: 'First Floor',
    value: 'first-floor'
  },
  {
    label: 'Second Floor',
    value: 'second-floor'
  },
  {
    label: 'Third Floor',
    value: 'third-floor'
  }
]

const accountTypes = [
  {
    label: 'Unit Owner',
    value: 'unit-owner'
  },
  {
    label: 'Relative',
    value: 'relative'
  },
  {
    label: 'Other (Unregistered)',
    value: 'other'
  }
]

const tableRows = [
  {
    name: 'Unit #',
    width: ''
  },
  {
    name: 'Resident Name',
    width: ''
  },
  {
    name: 'Account Type',
    width: ''
  }
]

function AllResidents() {
  const [searchText, setSearchText] = useState('')
  const [showModal, setShowModal] = useState('')

  const handleShowModal = () => setShowModal(old => !old)

  return (
    <section className="content-wrap">
      <h1 className="content-title">Tower 1 Residents List</h1>

      <div className="flex items-center justify-end mt-12 mx-4 w-full">
        <div className="flex items-center justify-between w-8/12 flex-row">
          <FormSelect options={floors} className="mr-4" />
          <FormSelect options={[]} className="mr-4" placeholder="Choose One" />
          <FormSelect options={accountTypes} className="mr-4" />
          <div className="w-full relative mr-4">
            <FormInput
              name="search"
              placeholder="Search"
              inputClassName="pr-8"
              onChange={e => setSearchText(e.target.value)}
              value={searchText}
            />
            <span className="absolute top-4 right-4">
              {searchText ? (
                <FaTimes className="cursor-pointer" onClick={() => {}} />
              ) : (
                <FaSearch />
              )}
            </span>
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
      <Card content={<Table rowNames={tableRows} items={[]} />} />
      <AddResidentModal showModal={showModal} onShowModal={handleShowModal} />
    </section>
  )
}

export default AllResidents
