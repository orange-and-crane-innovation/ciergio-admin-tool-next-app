import React, { useState } from 'react'
import P from 'prop-types'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'

import FormSelect from '@app/components/forms/form-select'
import FormInput from '@app/components/forms/form-input'
import Button from '@app/components/button'
import Table from '@app/components/table'
import Modal from '@app/components/modal'
import { Card } from '@app/components/globals'

import { FaTimes, FaSearch, FaPlusCircle } from 'react-icons/fa'
import { HiOutlinePrinter } from 'react-icons/hi'
import { FiDownload } from 'react-icons/fi'

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

const validationSchema = yup.object().shape({
  unit_number: yup.string().label('Unit #').required,
  first_name: yup.string().label('First Name').required(),
  last_name: yup.string().label('Last Name').required(),
  resident_type: yup.string().label('Resident Type').required,
  resident_email: yup.string().email().label('Resident Email')
})

function AllResidents() {
  const { handleSubmit, control, errors } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      unit_number: '',
      first_name: '',
      last_name: '',
      resident_type: '',
      resident_email: ''
    }
  })

  const [searchText, setSearchText] = useState('')
  const [showModal, setShowModal] = useState('')

  const handleShowModal = () => setShowModal(old => !old)

  const handleClearModal = () => {
    handleShowModal()
  }

  const handleOk = () => {
    handleClearModal()
  }

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
      <Modal
        title="Add Resident"
        okText="Add Resident"
        visible={showModal}
        onClose={handleClearModal}
        onCancel={handleClearModal}
        onOk={handleSubmit(handleOk)}
      >
        <AddResidentContent form={{ control, errors }} />
      </Modal>
    </section>
  )
}

function AddResidentContent({ form }) {
  const { control } = form

  return (
    <div className="w-full">
      <form>
        <h3 className="font-bold text-sm mb-4">Unit #</h3>
        <Controller
          name="unit_number"
          control={control}
          render={({ name, onChange, value }) => (
            <FormSelect
              name={name}
              onChange={onChange}
              value={value}
              options={[
                {
                  label: 'Unit 1',
                  value: 'unit-1'
                }
              ]}
            />
          )}
        />
        <div className="w-full flex flex-col">
          <h3 className="text-sm font-bold mb-4">About the Resident</h3>
          <div className="w-full flex justify-between align-center">
            <Controller
              name="first_name"
              control={control}
              render={({ name, value, onChange }) => (
                <FormInput
                  label="First Name"
                  placeholder="Enter first name"
                  onChange={onChange}
                  name={name}
                  value={value}
                  inputClassName="w-full rounded border-gray-300"
                />
              )}
            />
            <Controller
              name="last_name"
              control={control}
              render={({ name, value, onChange }) => (
                <FormInput
                  label="Last Name"
                  placeholder="Enter last name"
                  onChange={onChange}
                  name={name}
                  value={value}
                  inputClassName="w-full rounded border-gray-300"
                />
              )}
            />
          </div>
          <div>
            <h3 className="text-sm font-bold mb-4">Resident Type</h3>
            <Controller
              name="resident_type"
              control={control}
              render={({ name, value, onChange }) => (
                <FormSelect
                  name={name}
                  onChange={onChange}
                  value={value}
                  options={accountTypes}
                />
              )}
            />
          </div>
          <div>
            <h3 className="text-sm font-bold ">Resident Email (optional)</h3>
            <p className="text-xs mb-4">
              An invite will be sent if an email is provided.
            </p>
            <Controller
              name="resident_email"
              control={control}
              render={({ name, value, onChange }) => (
                <FormInput
                  placeholder="Enter email address"
                  type="email"
                  onChange={onChange}
                  name={name}
                  value={value}
                  inputClassName="w-full rounded border-gray-300"
                />
              )}
            />
          </div>
        </div>
      </form>
    </div>
  )
}

AddResidentContent.propTypes = {
  form: P.object
}

export default AllResidents
