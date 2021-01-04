import React, { useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'

import Button from '@app/components/button'
import FormInput from '@app/components/forms/form-input'
import FormSelect from '@app/components/forms/form-select'
import Modal from '@app/components/modal'
import Table from '@app/components/table'
import UploaderImage from '@app/components/uploader/image'
import { Card, Draggable } from '@app/components/globals'
import { FaPlusCircle } from 'react-icons/fa'

const tableRowData = [
  {
    name: 'Title',
    width: '40%'
  },
  {
    name: 'Name',
    width: '20%'
  },
  {
    name: 'Email',
    width: ''
  }
]

let tableData = {
  count: 161,
  limit: 10,
  offset: 0,
  data: [
    {
      title: 'Complex Administrator',
      name: 'Ashlynn Arias',
      email: 'ashlynn.arias@ciergio.com'
    },
    {
      title: 'Head Receptionist',
      name: 'Tori Corleone',
      email: 'tori.corleone@ciergio.com'
    },
    {
      title: 'Maintenance Officer',
      name: 'All Saab',
      email: 'all.saab@ciergio.com'
    }
  ]
}

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

const validationSchema = yup.object().shape({
  contact_category: yup.string().label('Contact Category').required,
  contact_name: yup.string().label('Contact Name').required(),
  contact_number: yup.string().label('Contact Number').required(),
  contact_address: yup.string().label('Contact Address')
})

function ContactUs() {
  const [list, setList] = useState(() => {
    return tableData.data.map((d, index) => ({
      ...d,
      id: index
    }))
  })

  const [reorder, setReorder] = useState(false)
  const [searchInput, setSearchInput] = useState('')

  const { handleSubmit, control, errors } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      contact_category: '',
      contact_name: '',
      contact_number: '',
      contact_address: ''
    }
  })

  const [showModal, setShowModal] = useState(false)
  const [contacts, setContacts] = useState(tableData)
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(false)

  const handleShowModal = () => setShowModal(old => !old)

  const handleClearModal = () => {
    handleShowModal()
  }

  const handleOk = values => {
    console.log({ values })
    const { contact_name: name } = values
    setContacts(old => ({
      ...old,
      data: [
        ...old.data,
        {
          title: name,
          name: 'Ashlynn Arias',
          email: 'ashlynn.arias@ciergio.com'
        }
      ]
    }))
    handleShowModal()
  }

  const handleUploadImage = e => {
    const reader = new FileReader()
    const formData = new FormData()
    const file = e.target.files ? e.target.files[0] : e.dataTransfer.files[0]

    setLoading(true)
    if (file) {
      reader.onloadend = () => {
        setImageUrl(reader.result)
      }
      reader.readAsDataURL(file)
      formData.append('photos', file)
      setLoading(false)
    }
  }

  const handleRemoveImage = () => {
    setImageUrl(null)
  }

  return (
    <section className={`content-wrap`}>
      <h1 className="content-title">Contact Page</h1>
      <span className="text-sm">
        Allow users to email specific people in your building
      </span>

      <div className="flex items-center justify-between mt-12 flex-col md:flex-row">
        <div className="flex items-center justify-between w-full md:w-1/4">
          <FormSelect options={bulkOptions} />
          <Button type="button" label="Apply" className="ml-2" />
        </div>
        <div>
          <FormInput
            type="text"
            placeholder="Search"
            name="search-contact-input"
            leftIcon="ciergio-search"
            onChange={e => setSearchInput(e.target.value)}
            value={searchInput}
          />
        </div>
      </div>
      <div className="w-full flex items-center justify-between pt-4 pr-4 bg-white border rounded">
        <div className="flex items-center pl-8 font-bold text-base leading-relaxed">
          <h3>{reorder ? 'Reorder Contacts' : `Directory (${list.length})`}</h3>
        </div>
        <div className="flex items-center">
          {reorder ? (
            <>
              <Button
                default
                label="Cancel"
                onClick={() => setReorder(old => !old)}
                className="mr-4"
              />
              <Button
                primary
                label="Save"
                onClick={() => {
                  tableData = {
                    ...tableData,
                    data: list
                  }
                  setReorder(old => !old)
                }}
              />
            </>
          ) : (
            <>
              <Button
                default
                label="Reorder"
                onClick={() => setReorder(old => !old)}
                className="mr-4"
              />
              <Button
                default
                leftIcon={<FaPlusCircle />}
                label="Add Contact"
                onClick={handleShowModal}
              />
            </>
          )}
        </div>
      </div>
      <Card
        content={
          reorder ? (
            <Draggable
              list={list}
              onListChange={setList}
              rowNames={tableRowData}
            />
          ) : (
            <Table rowNames={tableRowData} items={contacts} />
          )
        }
      />
      <Modal
        title="Add a Contact"
        okText="Okay"
        visible={showModal}
        onClose={handleClearModal}
        onCancel={handleClearModal}
        onOk={handleSubmit(handleOk)}
        cancelText="Close"
      >
        <div className="w-full">
          <h1 className="text-base font-bold mb-4">Contact Details</h1>
          <form>
            <div className="flex justify-between mb-4">
              <p>
                Upload a photo that’s easily recognizable by your residents.
              </p>

              <div>
                <UploaderImage
                  imageUrl={imageUrl}
                  loading={loading}
                  onUploadImage={handleUploadImage}
                  onRemoveImage={handleRemoveImage}
                />
              </div>
            </div>
            <Controller
              name="contact_category"
              control={control}
              render={({ name, value, onChange }) => (
                <FormSelect
                  name={name}
                  options={[
                    {
                      label: 'Emergency',
                      value: 'emergency'
                    },
                    {
                      label: 'Admin Contacts',
                      value: 'admin-contacts'
                    },
                    {
                      label: 'Sponsored',
                      value: 'sponsored'
                    },
                    {
                      label: 'Services',
                      value: 'services'
                    }
                  ]}
                  placeholder="Choose a contact category"
                  onChange={onChange}
                  value={value}
                />
              )}
            />
            <Controller
              name="contact_name"
              control={control}
              render={({ name, value, onChange }) => (
                <FormInput
                  label="Contact Name"
                  placeholder="Enter contact name"
                  onChange={onChange}
                  name={name}
                  value={value}
                  error={errors?.contact_name?.message ?? null}
                />
              )}
            />
            <Controller
              name="contact_number"
              control={control}
              render={({ name, value, onChange }) => (
                <FormInput
                  label="Contact Number"
                  placeholder="Enter contact number"
                  name={name}
                  onChange={onChange}
                  value={value}
                  error={errors?.contact_number?.message}
                />
              )}
            />
            <Controller
              name="contact_address"
              control={control}
              render={({ name, value, onChange }) => (
                <FormInput
                  label="Contact Address"
                  placeholder="(optional) Enter contact address"
                  name={name}
                  onChange={onChange}
                  value={value}
                  errors={errors?.contact_address?.message}
                />
              )}
            />
          </form>
        </div>
      </Modal>
    </section>
  )
}

export default ContactUs
