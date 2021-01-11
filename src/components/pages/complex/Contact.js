import React, { useState } from 'react'
import P from 'prop-types'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import Pagination from '@app/components/pagination'

import Button from '@app/components/button'
import FormInput from '@app/components/forms/form-input'
import FormSelect from '@app/components/forms/form-select'
import { Card, Table } from '@app/components/globals'
import Modal from '@app/components/modal'
import UploaderImage from '@app/components/uploader/image'

import { FaPlusCircle } from 'react-icons/fa'

const tableData = {
  count: 161,
  limit: 10,
  offset: 0,
  data: [
    {
      name: 'Red Cross'
    },
    {
      name: 'PRHC Headquarters'
    },
    {
      name: 'McDonalds'
    },
    {
      name: 'Suds Laundry Services'
    }
  ]
}

const validationSchema = yup.object().shape({
  contact_name: yup.string().label('Contact Name').required(),
  contact_number: yup.string().label('Contact Number').required(),
  contact_address: yup.string().label('Contact Address')
})

function Contact({ name }) {
  const { handleSubmit, control, errors } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
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
    const { contact_name: name } = values
    setContacts(old => ({
      ...old,
      data: [
        ...old.data,
        {
          title: name
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

  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name'
      }
    ],
    []
  )

  return (
    <section className={`content-wrap pt-4 pb-8 px-8`}>
      <h1 className="content-title capitalize">{`${name} Directory`}</h1>
      <div className="flex items-center justify-between bg-white border rounded-t">
        <h1 className="font-bold text-base px-8 py-4">{`Directory(${tableData.data.length})`}</h1>

        <div className="flex items-center">
          <Button
            default
            leftIcon={<FaPlusCircle />}
            label="Add Contact"
            onClick={() => setShowModal(old => !old)}
            className="my-4 mx-4"
          />
        </div>
      </div>
      <Card
        noPadding
        content={<Table columns={columns} payload={contacts} />}
        className="rounded-t-none"
      />
      <Pagination
        items={contacts}
        activePage={1}
        onPageClick={e => alert('Page ' + e)}
        onLimitChange={e => alert('Show ' + e.target.value)}
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
              render={({ name, value, onChange, ...props }) => (
                <FormSelect
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
              render={({ name, value, onChange, ...props }) => (
                <FormInput
                  label="Contact Name"
                  placeholder="Enter contact name"
                  onChange={onChange}
                  name={name}
                  value={value}
                  inputProps={props}
                  error={errors?.contact_name?.message ?? null}
                />
              )}
            />
            <Controller
              name="contact_number"
              control={control}
              render={({ name, value, onChange, ...props }) => (
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
              render={({ name, value, onChange, ...props }) => (
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

Contact.propTypes = {
  name: P.string
}

export default Contact
