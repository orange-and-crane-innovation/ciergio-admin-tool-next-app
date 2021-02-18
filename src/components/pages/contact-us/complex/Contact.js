import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import P from 'prop-types'
import * as yup from 'yup'

import Pagination from '@app/components/pagination'
import Button from '@app/components/button'
import FormInput from '@app/components/forms/form-input'
import Table from '@app/components/table'
import Modal from '@app/components/modal'
import Dropdown from '@app/components/dropdown'
import { Card } from '@app/components/globals'
import Can from '@app/permissions/can'

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
import showToast from '@app/utils/toast'

const validationSchema = yup.object().shape({
  title: yup.string().label('Title').required(),
  name: yup.string().label('Contact Name').required(),
  email: yup.string().email().label('Contact Email')
})

function Contact({ id }) {
  const { handleSubmit, control, errors, reset } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      title: '',
      name: '',
      email: ''
    }
  })

  const { data: complexes } = useQuery(GET_COMPLEX, {
    variables: {
      id: id
    }
  })
  const { data: contacts, refetch: refetchContacts } = useQuery(GET_CONTACTS, {
    variables: {
      complexId: id
    }
  })

  const { data: contactCategories } = useQuery(GET_CONTACT_CATEGORY, {
    complexId: id
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

  const [showModal, setShowModal] = useState(false)
  const [selectedContact, setSelectedContact] = useState(undefined)
  const [showEditContactModal, setShowEditContactModal] = useState(false)
  const [showDeleteContactModal, setShowDeleteContactModal] = useState(false)

  const name = complexes?.getComplexes?.data[0]?.name || ''
  const companyId = complexes?.getComplexes?.data[0]?.company._id || ''

  useEffect(() => {
    if (selectedContact !== undefined) {
      reset({
        title: selectedContact?.description,
        name: selectedContact?.name,
        email: selectedContact?.email
      })
    }
  }, [reset, selectedContact])

  const handleShowModal = useCallback(view => {
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
  }, [])

  const handleClearModal = type => {
    setSelectedContact(undefined)
    reset({
      title: '',
      name: '',
      email: ''
    })
    handleShowModal(type)
  }

  const handleCreateContact = values => {
    const categoryId = contactCategories?.getContactCategories?.data[0]?._id
    const { title, name, email } = values

    const contactData = {
      name,
      logo: null,
      description: title,
      address: null,
      email: email,
      contactNumber: 'n/a',
      categoryId
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
    const { title, name, email } = values

    const contactData = {
      name,
      logo: null,
      description: title,
      address: null,
      email: email
    }

    reset({
      title,
      name,
      email
    })

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

  const columns = useMemo(
    () => [
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
      },
      {
        name: '',
        width: ''
      }
    ],
    []
  )

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
            title: contact.description,
            name: contact.name,
            email: contact.email,
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
    }
  }, [contacts?.getContacts, handleShowModal])

  return (
    <section className={`content-wrap pt-4 pb-8 px-8`}>
      <h1 className="content-title capitalize">{`${name} Page`}</h1>
      <p className="text-base mb-8">
        Allow users to email specific in people in your building.
      </p>

      <div className="flex items-center justify-between bg-white border rounded-t">
        <h1 className="font-bold text-base px-8 py-4">{`Contacts (${contacts?.getContacts?.data?.length})`}</h1>

        <div className="flex items-center">
          <Can
            perform="contactus:create"
            yes={
              <Button
                default
                leftIcon={<FaPlusCircle />}
                label="Add Contact"
                onClick={() => setShowModal(old => !old)}
                className="my-4 mx-4"
              />
            }
          />
        </div>
      </div>
      <Card
        noPadding
        content={<Table rowNames={columns} items={contactsData} />}
        className="rounded-t-none"
      />
      <Pagination
        items={contactsData}
        activePage={1}
        onPageClick={e => alert('Page ' + e)}
        onLimitChange={e => alert('Show ' + e.target.value)}
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
        width={450}
      >
        <div className="w-full p-4">
          <form>
            <Controller
              name="title"
              control={control}
              render={({ name, value, onChange }) => (
                <FormInput
                  label="Title"
                  labelClassName="text-base font-bold"
                  placeholder="Enter title of contact"
                  onChange={onChange}
                  name={name}
                  value={value}
                  error={errors?.contact_name?.message ?? null}
                />
              )}
            />
            <Controller
              name="name"
              control={control}
              render={({ name, value, onChange }) => (
                <FormInput
                  label="Contact Name"
                  labelClassName="text-base font-bold"
                  placeholder="Enter name of contact"
                  onChange={onChange}
                  name={name}
                  value={value}
                  error={errors?.contact_name?.message ?? null}
                />
              )}
            />
            <Controller
              name="email"
              control={control}
              render={({ name, value, onChange }) => (
                <FormInput
                  label="Contact Email"
                  labelClassName="text-base font-bold"
                  placeholder="Enter email of contact"
                  type="email"
                  name={name}
                  onChange={onChange}
                  value={value}
                  error={errors?.contact_number?.message}
                  inputClassName="w-full rounded border-gray-300"
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
        width={450}
      >
        <div className="w-full p-4">
          <form>
            <Controller
              name="title"
              control={control}
              render={({ name, value, onChange }) => (
                <FormInput
                  label="Title"
                  labelClassName="text-base font-bold"
                  placeholder="Enter title of contact"
                  onChange={onChange}
                  name={name}
                  value={value}
                  error={errors?.contact_name?.message ?? null}
                />
              )}
            />
            <Controller
              name="name"
              control={control}
              render={({ name, value, onChange }) => (
                <FormInput
                  label="Contact Name"
                  labelClassName="text-base font-bold"
                  placeholder="Enter name of contact"
                  onChange={onChange}
                  name={name}
                  value={value}
                  error={errors?.contact_name?.message ?? null}
                />
              )}
            />
            <Controller
              name="email"
              control={control}
              render={({ name, value, onChange }) => (
                <FormInput
                  label="Contact Email"
                  labelClassName="text-base font-bold"
                  placeholder="Enter email of contact"
                  type="email"
                  name={name}
                  onChange={onChange}
                  value={value}
                  error={errors?.contact_number?.message}
                  inputClassName="w-full rounded border-gray-300"
                />
              )}
            />
          </form>
        </div>
      </Modal>
      <Modal
        title="Delete Contact"
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
