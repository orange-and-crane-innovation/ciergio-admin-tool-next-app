import React, { useState } from 'react'

import FormSelect from '@app/components/forms/form-select'
import FormInput from '@app/components/forms/form-input'
import Button from '@app/components/button'
import Table from '@app/components/table'
import { Card } from '@app/components/globals'

import { FaTimes, FaSearch, FaPlusCircle } from 'react-icons/fa'
import { HiOutlinePrinter } from 'react-icons/hi'
import { FiDownload } from 'react-icons/fi'

import AddResidentModal from '@app/components/pages/residents/AddResidentModal.js'

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

function MyMembers() {
  const [searchText, setSearchText] = useState('')
  const [showModal, setShowModal] = useState(false)

  const handleShowModal = () => setShowModal(old => !old)

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
      <Card content={<Table rowNames={tableRows} items={[]} />} />
      <AddResidentModal showModal={showModal} onShowModal={handleShowModal} />
    </section>
  )
}

export default MyMembers
