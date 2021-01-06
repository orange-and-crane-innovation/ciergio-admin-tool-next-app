import React, { useState } from 'react'
import Button from '@app/components/button'
import FormInput from '@app/components/forms/form-input'
import FormSelect from '@app/components/forms/form-select'
import Table from '@app/components/table'
import { Card } from '@app/components/globals'

import { FaTimes, FaSearch } from 'react-icons/fa'

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
    name: 'Invites',
    width: ''
  },
  {
    name: 'Account Type',
    width: ''
  },
  {
    name: 'Assignment',
    width: ''
  },
  {
    name: 'Date Sent',
    width: ''
  }
]

const bulkOptions = [
  {
    label: 'Unpublished',
    value: 'unpublish'
  },
  {
    label: 'Move to Trash',
    value: 'trash'
  }
]

function PendingInvites() {
  const [searchText, setSearchText] = useState('')

  return (
    <section className="content-wrap">
      <h1 className="content-title">Pending Staff Invites</h1>
      <div className="flex items-center justify-between mt-12 w-full">
        <div className="flex">
          <FormSelect options={bulkOptions} className="mr-2" disabled />
          <Button default label="Apply" className="w-60" disabled />
        </div>
        <div className="flex items-center justify-between flex-row">
          <FormSelect options={roleOptions} className="mr-2" />
          <FormSelect options={assignmentOptions} className="mr-2" />
          <div className="w-full relative">
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
        <h1 className="font-bold text-base px-8 py-4">{`Pending Staff (0)`}</h1>
      </div>
      <Card noPadding content={<Table rowNames={staffRows} items={[]} />} />
    </section>
  )
}

export default PendingInvites
