import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import { useQuery, useMutation } from '@apollo/client'
import * as yup from 'yup'

import showToast from '@app/utils/toast'

import Button from '@app/components/button'
import FormInput from '@app/components/forms/form-input'
import FormSelect from '@app/components/forms/form-select'
import Modal from '@app/components/modal'
import UploaderImage from '@app/components/uploader/image'
import Table from '@app/components/table'
import Checkbox from '@app/components/forms/form-checkbox'
import Dropdown from '@app/components/dropdown'
import SelectBulk from '@app/components/globals/SelectBulk'
import { Card, Draggable } from '@app/components/globals'

import { FaPlusCircle } from 'react-icons/fa'
import { AiOutlineEllipsis } from 'react-icons/ai'

import { GET_CONTACTS, BULK_UPDATE_MUTATION } from '../queries'

import Can from '@app/permissions/can'

const bulkOptions = [
  {
    label: '',
    value: ''
  },
  {
    label: 'Unpublished',
    value: 'unpublished'
  },
  {
    label: 'Move to Trash',
    value: 'trashed'
  }
]

const draggableRowNames = [
  {
    name: 'Title',
    width: ''
  },
  {
    name: 'Name',
    width: ''
  },
  {
    name: 'Email',
    width: ''
  }
]

const validationSchema = yup.object().shape({
  category: yup.string().label('Contact Category').required,
  name: yup.string().label('Contact Name').required(),
  number: yup.string().label('Contact Number').required(),
  address: yup.string().label('Contact Address')
})

function ContactUs() {
  const { data: contacts, refetch: refetchContacts } = useQuery(GET_CONTACTS)
  const [bulkUpdate, { called: calledBulk, data: dataBulk }] = useMutation(
    BULK_UPDATE_MUTATION
  )
  const [reorder, setReorder] = useState(false)
  const [searchInput, setSearchInput] = useState('')

  const { handleSubmit, control, errors } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      category: '',
      name: '',
      number: '',
      address: ''
    }
  })

  const [showModal, setShowModal] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [draggableList, setDraggableList] = useState([])
  const [isBulkDisabled, setIsBulkDisabled] = useState(false)
  const [isBulkButtonDisabled, setIsBulkButtonDisabled] = useState(false)
  const [selectedBulk, setSelectedBulk] = useState([])
  const [selectedData, setSelectedData] = useState([])

  const handleShowModal = () => setShowModal(old => !old)

  const handleClearModal = () => {
    handleShowModal()
  }

  const handleOk = values => {
    // const { name } = values
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

  const onCheck = useCallback(
    e => {
      const data = e.target.getAttribute('data-id')
      const checkboxes = document.querySelectorAll(
        'input[name="checkbox"]:checked'
      )

      if (e.target.checked) {
        if (!selectedData.includes(data)) {
          setSelectedData(prevState => [...prevState, data])
        }
        setIsBulkDisabled(false)
      } else {
        setSelectedData(prevState => [
          ...prevState.filter(item => item !== data)
        ])
        if (checkboxes.length === 0) {
          setSelectedBulk('')
          setIsBulkDisabled(true)
          setIsBulkButtonDisabled(true)
        }
      }
    },
    [selectedData]
  )

  const onCheckAll = useCallback(
    e => {
      const checkboxes = document.getElementsByName('checkbox')

      setSelectedBulk('')
      setIsBulkDisabled(true)
      setIsBulkButtonDisabled(true)

      for (let i = 0; i < checkboxes.length; i++) {
        const data = checkboxes[i].getAttribute('data-id')
        if (e.target.checked) {
          if (!selectedData.includes(data)) {
            setSelectedData(prevState => [...prevState, data])
          }
          checkboxes[i].checked = true
          setIsBulkDisabled(false)
        } else {
          setSelectedData(prevState => [
            ...prevState.filter(item => item !== data)
          ])
          checkboxes[i].checked = false
        }
      }
    },
    [selectedData]
  )

  const onBulkSubmit = () => {
    const data = { id: selectedData, status: selectedBulk }
    bulkUpdate({ variables: data })
  }

  const onClearBulk = () => {
    setSelectedBulk('')
  }

  const onBulkChange = e => {
    setSelectedBulk(e.target.value)
    if (e.target.value !== '') {
      setIsBulkButtonDisabled(false)
    } else {
      setIsBulkButtonDisabled(true)
    }
  }

  const columns = useMemo(
    () => [
      {
        name: (
          <Checkbox
            primary
            id="checkbox_select_all"
            name="checkbox_select_all"
            onChange={e => onCheckAll(e)}
          />
        ),
        width: '5%'
      },
      {
        name: 'Title',
        width: '20%'
      },
      {
        name: 'Name',
        width: '30%'
      },
      {
        name: 'Email',
        width: ''
      },
      {
        name: '',
        width: ''
      }
    ],
    [onCheckAll]
  )

  const contactsData = useMemo(
    () => ({
      count: contacts?.getContacts.count || 0,
      limit: contacts?.getContacts.limit || 0,
      offset: contacts?.getContacts.offset || 0,
      data:
        contacts?.getContacts.data.map(item => {
          const dropdownData = [
            {
              label: 'Edit Contact',
              icon: <span className="ciergio-edit" />,
              function: () => handleShowModal('details', item._id)
            },
            {
              label: 'Delete Contact',
              icon: <span className="ciergio-trash" />,
              function: () => handleShowModal('views', item._id)
            }
          ]

          return {
            checkbox: (
              <Checkbox
                primary
                id={`checkbox-${item._id}`}
                name="checkbox"
                data-id={item._id}
                onChange={onCheck}
              />
            ),
            title: item.description,
            name: item.name,
            email: item.email,
            button: (
              <Can
                perform="contactus:update::delete"
                yes={
                  <Dropdown
                    label={<AiOutlineEllipsis />}
                    items={dropdownData}
                  />
                }
              />
            )
          }
        }) || []
    }),
    [contacts?.getContacts, onCheck]
  )

  useEffect(() => {
    if (!contactsData?.data?.length) return []

    const draggables = contactsData?.data.map(c => ({
      title: c.title,
      name: c.name,
      email: c.email,
      button: c.button
    }))

    setDraggableList(draggables)
  }, [contactsData?.data])

  useEffect(() => {
    if (calledBulk && dataBulk) {
      if (dataBulk?.bulkUpdatePost?.message === 'success') {
        const allCheck = document.getElementsByName('checkbox_select_all')[0]
        const itemsCheck = document.getElementsByName('checkbox')

        if (allCheck.checked) {
          allCheck.click()
        }

        for (let i = 0; i < itemsCheck.length; i++) {
          if (itemsCheck[i].checked) {
            itemsCheck[i].click()
          }
        }

        setIsBulkDisabled(true)
        setIsBulkButtonDisabled(true)
        setSelectedBulk('')

        showToast('success', `You have successfully updated a contact`)
        refetchContacts()
      } else {
        showToast('danger', `Bulk update failed`)
      }
    }
  }, [calledBulk, dataBulk, refetchContacts])

  return (
    <section className={`content-wrap`}>
      <h1 className="content-title">Contact Page</h1>
      <span className="text-sm">
        Allow users to email specific people in your building
      </span>

      <div className="flex items-center justify-between mt-12 flex-col md:flex-row">
        <div className="flex items-center justify-between w-full">
          <SelectBulk
            placeholder="Select"
            options={bulkOptions}
            disabled={isBulkDisabled}
            isButtonDisabled={isBulkButtonDisabled}
            onBulkChange={onBulkChange}
            onBulkSubmit={onBulkSubmit}
            onBulkClear={onClearBulk}
            selected={selectedBulk}
          />
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
          <h3>
            {reorder
              ? 'Reorder Contacts'
              : `Directory (${contacts?.getContacts?.data?.length})`}
          </h3>
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
              <Can
                perform="contactus:create"
                yes={
                  <Button
                    default
                    leftIcon={<FaPlusCircle />}
                    label="Add Contact"
                    onClick={handleShowModal}
                  />
                }
                no={
                  <Button
                    default
                    leftIcon={<FaPlusCircle />}
                    label="Add Contact"
                    disabled
                  />
                }
              />
            </>
          )}
        </div>
      </div>
      <Card
        content={
          reorder ? (
            <Draggable
              list={draggableList}
              onListChange={setDraggableList}
              rowNames={draggableRowNames}
            />
          ) : (
            <Table rowNames={columns} items={contactsData} />
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
