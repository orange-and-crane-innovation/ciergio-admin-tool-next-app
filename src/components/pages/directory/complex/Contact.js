import React, { useState, useMemo, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import P from 'prop-types'
import * as yup from 'yup'

import Button from '@app/components/button'
import FormInput from '@app/components/forms/form-input'
import FormSelect from '@app/components/forms/form-select'
import FormAddress from '@app/components/forms/form-address'
import PrimaryDataTable from '@app/components/globals/PrimaryDataTable'
import Modal from '@app/components/modal'
import UploaderImage from '@app/components/uploader/image'
import Dropdown from '@app/components/dropdown'
import { Card } from '@app/components/globals'

import showToast from '@app/utils/toast'

import { FaPlusCircle } from 'react-icons/fa'
import { AiOutlineEllipsis } from 'react-icons/ai'

import { initializeApollo } from '@app/lib/apollo/client'
import {
  GET_COMPLEXES,
  GET_COMPLEX,
  GET_CONTACTS,
  GET_CONTACT_CATEGORY,
  CREATE_CONTACT,
  EDIT_CONTACT,
  DELETE_CONTACT
} from '../queries'
import Can from '@app/permissions/can'

const validationSchema = yup.object().shape({
  name: yup.string().label('Contact Name').required(),
  contactNumber: yup.string().label('Contact Number').required(),
  address: yup.string().label('Contact Address'),
  category: yup.string().required
})

function Contact({ id }) {
  const { handleSubmit, control, errors, reset, setValue } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: '',
      contactNumber: '',
      address: '',
      category: ''
    }
  })

  const [showModal, setShowModal] = useState(false)
  const [imageUrl, setImageUrl] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedContact, setSelectedContact] = useState(undefined)
  const [showEditContactModal, setShowEditContactModal] = useState(false)
  const [showDeleteContactModal, setShowDeleteContactModal] = useState(false)
  const [pageLimit, setPageLimit] = useState(10)
  const [offset, setPageOffset] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  const { data: complexes } = useQuery(GET_COMPLEX, {
    variables: {
      id: id
    }
  })
  const {
    data: contacts,
    refetch: refetchContacts,
    loading: loadingContacts
  } = useQuery(GET_CONTACTS, {
    variables: {
      complexId: id,
      limit: pageLimit,
      offset
    }
  })
  const { data: categories } = useQuery(GET_CONTACT_CATEGORY, {
    variables: {
      complexId: id
    }
  })

  const [createContact, { loading: creatingContact }] = useMutation(
    CREATE_CONTACT,
    {
      onCompleted: () => {
        handleClearModal('create')
        showToast('success', `You have successfully added a new contact`)
        refetchContacts()
      }
    }
  )
  const [editContact, { loading: editingContact }] = useMutation(EDIT_CONTACT, {
    onCompleted: () => {
      handleClearModal('edit')
      showToast('success', `You have successfully updated a contact`)
      refetchContacts()
    }
  })
  const [deleteContact, { loading: deletingContact }] = useMutation(
    DELETE_CONTACT,
    {
      onCompleted: () => {
        handleClearModal('delete')
        showToast('success', `You have successfully deleted a contact`)
        refetchContacts()
      }
    }
  )

  const name = complexes?.getComplexes?.data[0]?.name || ''
  const companyId = complexes?.getComplexes?.data[0]?.company._id || ''

  useEffect(() => {
    if (selectedContact !== undefined) {
      reset({
        category: selectedContact?.category?._id,
        name: selectedContact.name,
        contactNumber: selectedContact.contactNumber,
        address: selectedContact?.address?.formattedAddress || ''
      })
    }
  }, [reset, selectedContact])

  const handleShowModal = view => {
    switch (view) {
      case 'create':
        setShowModal(old => !old)
        break
      case 'edit':
        setShowEditContactModal(old => !old)
        break
      case 'delete':
        setShowDeleteContactModal(old => !old)
        break
      default:
        break
    }
  }

  const handleClearModal = type => {
    setSelectedContact(undefined)
    reset({
      category: '',
      name: '',
      contactNumber: '',
      address: ''
    })
    handleShowModal(type)
  }

  const handleCreateContact = values => {
    const { category, name, contactNumber, address } = values

    const contactData = {
      name,
      logo: null,
      description: 'Test description',
      contactNumber,
      address: address !== '' ? address : null,
      categoryId: category || categories?.getContactCategories?.data[0]._id
    }

    createContact({
      variables: {
        data: contactData,
        companyId,
        complexId: id
      }
    })
  }

  const handleEditContact = values => {
    const { category, name, contactNumber, address } = values

    const contactData = {
      name,
      logo: null,
      description: 'Test description',
      contactNumber,
      address: address !== '' ? address : null,
      categoryId: category || categories?.getContactCategories?.data[0]._id
    }

    editContact({
      variables: {
        data: contactData,
        contactId: selectedContact._id
      }
    })
  }

  const handleDeleteContact = () => {
    deleteContact({
      variables: {
        contactId: selectedContact._id
      }
    })
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

  const columns = useMemo(
    () => [
      {
        name: 'Name',
        width: '35%'
      },
      {
        name: 'Category',
        width: ''
      },
      {
        name: 'Address',
        width: ''
      },
      {
        name: '',
        width: ''
      }
    ],
    []
  )

  const getMapValue = e => {
    setValue('location', e?.address?.formattedAddress)
    setValue('address', e?.address)
  }

  const contactsData = useMemo(() => {
    return {
      count: contacts?.getContacts?.count || 0,
      limit: contacts?.getContacts?.limit || 0,
      offset: contacts?.getContacts?.offset || 0,
      data:
        contacts?.getContacts?.data?.map(contact => {
          const dropdownData = [
            {
              label: 'Edit Contact',
              icon: <span className="ciergio-edit" />,
              function: () => {
                setSelectedContact(contact)
                handleShowModal('edit')
              }
            },
            {
              label: 'Delete Contact',
              icon: <span className="ciergio-trash" />,
              function: () => {
                setSelectedContact(contact)
                handleShowModal('delete')
              }
            }
          ]

          return {
            name: (
              <div className="flex items-center justify-start">
                <div>
                  <img
                    className="w-8 h-8 rounded-full"
                    src={
                      contact?.logo ??
                      `https://ui-avatars.com/api/?name=${contact.name}&rounded=true&size=32`
                    }
                    alt="contact-avatar"
                  />
                </div>
                <div className="ml-4">
                  <p>{contact.name}</p>
                  <p className="text-gray-600">{contact.contactNumber}</p>
                </div>
              </div>
            ),
            category: contact?.category.name,
            address: contact?.address?.formattedAddress,
            button: (
              <Can
                perform="directory:contact:update::delete"
                yes={
                  <Dropdown
                    label={<AiOutlineEllipsis />}
                    items={dropdownData}
                  />
                }
                no={null}
              />
            )
          }
        }) || []
    }
  }, [contacts?.getContacts])

  const categoryOptions = useMemo(() => {
    if (categories?.getContactCategories?.data?.length > 0) {
      return categories.getContactCategories?.data?.map(contact => ({
        label: contact.name,
        value: contact._id
      }))
    }

    return []
  }, [categories?.getContactCategories])

  return (
    <section className={`content-wrap pt-4 pb-8 px-8`}>
      <h1 className="content-title capitalize">{`${name} Directory`}</h1>
      <div className="flex items-center justify-between bg-white border rounded-t">
        <h1 className="font-bold text-base px-8 py-4">{`Directory (${contacts?.getContacts?.count})`}</h1>

        <div className="flex items-center">
          <Can
            perform="directory:create"
            yes={
              <Button
                default
                leftIcon={<FaPlusCircle />}
                label="Add Contact"
                onClick={() => setShowModal(old => !old)}
                className="my-4 mx-4"
              />
            }
            no={null}
          />
        </div>
      </div>
      <Card
        noPadding
        content={
          <PrimaryDataTable
            columns={columns}
            data={contactsData}
            loading={loadingContacts}
            currentPage={currentPage}
            pageLimit={pageLimit}
            setCurrentPage={setCurrentPage}
            setPageLimit={setPageLimit}
            setPageOffset={setPageOffset}
          />
        }
        className="rounded-t-none"
      />
      <Modal
        title="Add a Contact"
        okText="Okay"
        visible={showModal}
        onClose={() => handleClearModal('create')}
        onCancel={() => handleClearModal('create')}
        onOk={handleSubmit(handleCreateContact)}
        cancelText="Close"
        okButtonProps={{
          loading: creatingContact
        }}
      >
        <div className="w-full p-4">
          <h1 className="text-base font-bold mb-4">Contact Details</h1>
          <form>
            <div className="flex justify-between mb-4">
              <p>
                Upload a photo that’s easily recognizable by your residents.
              </p>

              <div>
                <UploaderImage
                  imageUrls={imageUrl}
                  loading={loading}
                  onUploadImage={handleUploadImage}
                  onRemoveImage={handleRemoveImage}
                  maxImages={3}
                />
              </div>
            </div>
            <Controller
              name="category"
              control={control}
              render={({ name, value, onChange }) => (
                <FormSelect
                  name={name}
                  options={categoryOptions}
                  placeholder="Choose a contact category"
                  onChange={onChange}
                  value={value}
                />
              )}
            />
            <Controller
              name="name"
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
              name="contactNumber"
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
              name="address"
              control={control}
              render={({ name, value, onChange }) => (
                <FormAddress
                  label="Contact Address"
                  placeholder="(optional) Enter contact address"
                  name={name}
                  onChange={onChange}
                  value={value}
                  error={errors?.contact_address?.message}
                  getValue={getMapValue}
                />
              )}
            />
          </form>
        </div>
      </Modal>
      <Modal
        title="Edit Contact"
        okText="Okay"
        visible={showEditContactModal}
        onClose={() => handleClearModal('edit')}
        onCancel={() => handleClearModal('edit')}
        onOk={handleSubmit(handleEditContact)}
        cancelText="Close"
        okButtonProps={{
          loading: editingContact
        }}
        width={550}
      >
        <div className="w-full p-4">
          <h1 className="text-base font-bold mb-4">Contact Details</h1>
          <form>
            <div className="flex justify-between mb-4">
              <p>
                Upload a photo that’s easily recognizable by your residents.
              </p>

              <div>
                <UploaderImage
                  imageUrls={imageUrl}
                  loading={loading}
                  onUploadImage={handleUploadImage}
                  onRemoveImage={handleRemoveImage}
                  maxImages={3}
                />
              </div>
            </div>
            <Controller
              name="category"
              control={control}
              render={({ name, value, onChange }) => (
                <FormSelect
                  name={name}
                  options={categoryOptions}
                  placeholder="Choose a contact category"
                  onChange={onChange}
                  value={value}
                />
              )}
            />
            <Controller
              name="name"
              control={control}
              render={({ name, value, onChange }) => (
                <FormInput
                  label="Contact Name"
                  placeholder="Enter contact name"
                  onChange={onChange}
                  name={name}
                  value={value || selectedContact?.name}
                  error={errors?.contact_name?.message ?? null}
                />
              )}
            />
            <Controller
              name="contactNumber"
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
              name="address"
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
      <Modal
        title="Delete Category"
        okText="Yes, delete"
        visible={showDeleteContactModal}
        onClose={() => handleClearModal('delete')}
        onCancel={() => handleClearModal('delete')}
        onOk={handleDeleteContact}
        okButtonProps={{
          loading: deletingContact
        }}
        width={450}
      >
        <div className="w-full p-4">
          <div>
            <p className="mb-4">
              <span className="font-medium">Warning: </span>{' '}
              {`You're about to delete `}
              <span className="font-medium">{selectedContact?.name}</span>
            </p>
            <p className="mb-4">
              You will remove this contact for everyone. Are you sure you want
              to delete?
            </p>
          </div>
        </div>
      </Modal>
    </section>
  )
}

Contact.propTypes = {
  id: P.string
}

const apolloClient = initializeApollo()

export async function getStaticPaths() {
  const complexes = await apolloClient.query({
    query: GET_COMPLEXES
  })

  const paths = complexes?.getComplexes?.data.map(c => ({
    params: { id: c._id }
  }))

  return {
    paths,
    fallback: false
  }
}

export async function getStaticProps({ params }) {
  const { id } = params
  await apolloClient.query({
    query: GET_COMPLEX,
    variables: {
      id
    }
  })

  await apolloClient.query({
    query: GET_CONTACTS,
    variables: {
      complexId: id
    }
  })

  await apolloClient.query({
    query: GET_CONTACT_CATEGORY,
    variables: {
      complexId: id
    }
  })

  return {
    props: {
      initialApolloState: apolloClient.cache.extract()
    }
  }
}

export default Contact
