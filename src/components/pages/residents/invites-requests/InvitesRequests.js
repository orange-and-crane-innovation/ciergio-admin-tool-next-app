import React, { useState } from 'react'

import FormSelect from '@app/components/forms/form-select'
import FormInput from '@app/components/forms/form-input'
import Button from '@app/components/button'
import { Card, Table, Action } from '@app/components/globals'

import { FaTimes, FaSearch, FaPlusCircle } from 'react-icons/fa'
import { HiOutlinePrinter } from 'react-icons/hi'
import { FiDownload } from 'react-icons/fi'

import AddResidentModal from '../AddResidentModal'

const bulkOptions = [
  {
    label: 'Reinvite',
    value: 'reinvite'
  }
]

function InvitesRequests() {
  const [searchText, setSearchText] = useState('')
  const [showModal, setShowModal] = useState('')

  const columns = React.useMemo(
    () => [
      {
        Header: 'Unit #',
        accessor: 'unit_number'
      },
      {
        Header: 'Email',
        accessor: 'email_address'
      },
      {
        Header: 'Account Type',
        accessor: 'account_type'
      },
      {
        accessor: 'date_sent'
      },
      {
        id: 'action',
        accessor: row => row,
        Cell: Action
      }
    ],
    []
  )

  const residentsData = React.useMemo(
    () => ({
      count: 161,
      limit: 10,
      offset: 0,
      data: [
        {
          unit_number: 101,
          email_address: 'brandie.lane@gmail.com',
          account_type: 'Unit Owner',
          date_sent: 'December 20, 2020'
        },
        {
          unit_number: 102,
          email_address: 'max_murphy@gmail.com',
          account_type: 'Relative',
          date_sent: 'December 20, 2020'
        }
      ]
    }),
    []
  )

  const handleShowModal = () => setShowModal(old => !old)

  return (
    <section className="content-wrap">
      <h1 className="content-title">Residents</h1>

      <div className="flex items-center justify-between mt-12 mx-4 w-full">
        <div className="flex items-center w-2/12">
          <FormSelect options={bulkOptions} className="mr-4" />
          <Button label="Apply" />
        </div>
        <div className="relative mr-4">
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

      <div className="flex items-center justify-between bg-white border-t border-l border-r rounded-t">
        <h1 className="font-bold text-base px-8 py-4">{`Pending Invites`}</h1>
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
            columns={columns}
            payload={residentsData}
            rowSelection
            pagination
            enableSorting
          />
        }
      />
      <AddResidentModal showModal={showModal} onShowModal={handleShowModal} />
    </section>
  )
}

export default InvitesRequests
