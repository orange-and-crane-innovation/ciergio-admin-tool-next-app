import React, { useState } from 'react'
import Button from '@app/components/button'
import FormInput from '@app/components/forms/form-input'
import FormSelect from '@app/components/forms/form-select'
import Table from '@app/components/table'
import Modal from '@app/components/modal'
import { Card } from '@app/components/globals'

import { FaTimes, FaSearch, FaPlusCircle } from 'react-icons/fa'
import { HiOutlinePrinter } from 'react-icons/hi'
import { FiDownload } from 'react-icons/fi'

const roleOptions = [
  {
    label: 'Super User',
    value: 'super-user'
  },
  {
    label: 'Parish Head',
    value: 'parish-head'
  },
  {
    label: 'Parish Admin',
    value: 'parish-admin'
  }
]

const assignmentOptions = [
  {
    label: 'For deletion 1',
    value: 'deletion-1'
  },
  {
    label: 'For deletion 2',
    value: 'deletion-2'
  },
  {
    label: 'Mary Queen The Path',
    value: 'mary-queen-path'
  }
]

const staffRows = [
  {
    name: 'Name',
    width: ''
  },
  {
    name: 'Role',
    width: ''
  },
  {
    name: 'Assignment',
    width: ''
  }
]

function AllStaff() {
  const [searchText, setSearchText] = useState('')
  const [showModal, setShowModal] = useState('')
  const [staffEmail, setStaffEmail] = useState('')

  const handleShowModal = () => setShowModal(old => !old)

  const handleClearModal = () => {
    handleShowModal()
  }

  const handleOk = () => {
    handleClearModal()
  }

  return (
    <section className="content-wrap">
      <h1 className="content-title">Staff List</h1>
      <div className="flex items-center justify-end mt-12 mx-4 w-full">
        <div className="flex items-center justify-between w-8/12 flex-row">
          <FormSelect options={roleOptions} className="mr-4" />
          <FormSelect options={assignmentOptions} className="mr-4" />
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
        <h1 className="font-bold text-base px-8 py-4">{`All Staff (0)`}</h1>
        <div className="flex items-center">
          <Button
            default
            icon={<HiOutlinePrinter />}
            onClick={() => {}}
            className="mr-4 mt-4"
            disabled
          />
          <Button
            default
            icon={<FiDownload />}
            onClick={() => {}}
            className="mr-4 mt-4"
            disabled
          />
          <Button
            default
            leftIcon={<FaPlusCircle />}
            label="Invite Staff"
            onClick={handleShowModal}
            className="mr-4 mt-4"
          />
        </div>
      </div>
      <Card noPadding content={<Table rowNames={staffRows} items={[]} />} />
      <Modal
        title="Invite Staff"
        okText="Invite Staff"
        visible={showModal}
        onClose={handleClearModal}
        onCancel={handleClearModal}
        onOk={handleOk}
      >
        <div className="w-full">
          <h1 className="font-bold text-sm mb-4">Staff Type</h1>
          <FormSelect options={roleOptions} />
          <FormInput
            label="Email Address"
            placeholder="Enter staff email address"
            type="email"
            onChange={e => setStaffEmail(e.target.value)}
            name="staff-email"
            value={staffEmail}
            inputClassName="w-full rounded border-gray-300"
          />
        </div>
      </Modal>
    </section>
  )
}

export default AllStaff
