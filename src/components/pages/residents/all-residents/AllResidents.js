import React, { useState } from 'react'
import P from 'prop-types'

import FormSelect from '@app/components/forms/form-select'
import FormInput from '@app/components/forms/form-input'
import Button from '@app/components/button'
import Table from '@app/components/globals/Table'
import { Card } from '@app/components/globals'

import { FaTimes, FaSearch, FaPlusCircle } from 'react-icons/fa'
import { HiOutlinePrinter } from 'react-icons/hi'
import { FiDownload } from 'react-icons/fi'
import { GoKebabHorizontal } from 'react-icons/go'

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

function AllResidents() {
  const [searchText, setSearchText] = useState('')
  const [showModal, setShowModal] = useState('')

  const columns = React.useMemo(
    () => [
      {
        Header: 'Unit #',
        accessor: 'unit_number'
      },
      {
        Header: 'Resident Name',
        accessor: row => row,
        Cell: ResidentCell
      },
      {
        Header: 'Account Type',
        accessor: row => row,
        Cell: ResidentType
      },
      {
        id: 'invite',
        accessor: row => row,
        Cell: ResidentInviteButton
      },
      {
        id: 'action',
        accessor: row => row,
        Cell: ResidentAction
      }
    ],
    []
  )

  const residentsData = React.useMemo(
    () => [
      {
        unit_number: 101,
        resident_name: 'Brandie Lane',
        contact_number: '09778562090',
        account_type: 'Unit Owner',
        active: true
      },
      {
        unit_number: 101,
        resident_name: 'Max Murphy',
        contact_number: '09778562090',
        account_type: 'Relative',
        active: false
      },
      {
        unit_number: 102,
        resident_name: 'Ralph Bell',
        contact_number: '09778562090',
        account_type: 'Other',
        active: false
      },
      {
        unit_number: 103,
        resident_name: 'Victoria Miles',
        contact_number: '09778562090',
        account_type: 'Unit Owner',
        active: true
      },
      {
        unit_number: 103,
        resident_name: 'Wendy Jones',
        contact_number: '09778562090',
        account_type: 'Staff',
        active: true
      },
      {
        unit_number: 104,
        resident_name: 'Judith Cooper',
        contact_number: '09778562090',
        account_type: 'Staff',
        active: true
      },
      {
        unit_number: 105,
        resident_name: 'Wendy Jones',
        contact_number: '09778562090',
        account_type: 'Unit Owner',
        active: true
      },
      {
        unit_number: 105,
        resident_name: 'Albert Howard',
        contact_number: '09778562090',
        account_type: 'Housemate',
        active: true
      },
      {
        unit_number: 105,
        resident_name: 'Priscilla Richards',
        contact_number: '09778562090',
        account_type: 'Housemate',
        active: false
      }
    ],
    []
  )

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
      <Card content={<Table columns={columns} data={residentsData} />} />
      <AddResidentModal showModal={showModal} onShowModal={handleShowModal} />
    </section>
  )
}

function ResidentCell({ value }) {
  return (
    <div>
      <div>{value.resident_name}</div>
      <div>{value.contact_number}</div>
    </div>
  )
}

function ResidentAction({ value }) {
  return (
    <div className="w-full flex justify-end pr-8">
      <GoKebabHorizontal onClick={() => console.log({ value })} />
    </div>
  )
}

function ResidentInviteButton({ value }) {
  if (value.active) return null

  return (
    <div>
      <Button label="Invite" onClick={() => console.log('invited')} />
    </div>
  )
}

function ResidentType({ value }) {
  return (
    <div>
      <span>{`${value.account_type} ${
        !value.active ? '(Unregistered)' : ''
      }`}</span>
    </div>
  )
}

ResidentCell.propTypes = {
  value: P.object
}

ResidentAction.propTypes = {
  value: P.object
}

ResidentInviteButton.propTypes = {
  value: P.object
}

ResidentType.propTypes = {
  value: P.object
}

export default AllResidents
