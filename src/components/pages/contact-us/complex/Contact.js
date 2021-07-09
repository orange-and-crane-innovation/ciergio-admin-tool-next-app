import React, { useState, useMemo, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import P from 'prop-types'
import * as yup from 'yup'
import Button from '@app/components/button'
import PrimaryDataTable from '@app/components/globals/PrimaryDataTable'
import Modal from '@app/components/modal'
import Dropdown from '@app/components/dropdown'
import { Card } from '@app/components/globals'
import Can from '@app/permissions/can'
import { FaPlusCircle, FaEllipsisH } from 'react-icons/fa'
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
import errorHandler from '@app/utils/errorHandler'

import ContactModal from './ContactModal'

const validationSchema = yup.object().shape({
  title: yup.string().required('This field is required'),
  name: yup.string().required('This field is required'),
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('This field is required')
})

const columns = [
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
]

function Contact({ id }) {
  const router = useRouter()
  const profile = JSON.parse(window.localStorage.getItem('profile'))
  const profileData = profile?.accounts?.data[0]
  const companyId = router?.query?.companyId ?? profileData?.company?._id
  const complexId = id ?? profileData?.complex?._id

  const { control, errors, reset, getValues, trigger } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      title: '',
      name: '',
      email: ''
    }
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [pageLimit, setPageLimit] = useState(10)
  const [pageOffset, setPageOffset] = useState(0)

  const { data: complexes } = useQuery(GET_COMPLEX, {
    variables: {
      id: complexId
    }
  })
  const {
    data: contacts,
    refetch: refetchContacts,
    loading: loadingContacts
  } = useQuery(GET_CONTACTS, {
    variables: {
      limit: 100,
      skip: 0,
      where: {
        type: 'contactus'
      },
      contactWhere: {
        complexId: complexId,
        companyId: companyId ?? null
      },
      contactsLimit: pageLimit,
      contactsSkip: pageOffset
    }
  })

  const { data: contactCategories } = useQuery(GET_CONTACT_CATEGORY, {
    complexId: complexId,
    companyId: companyId ?? null
  })

  const handleRefetchContacts = () => {
    refetchContacts({
      variables: {
        limit: 100,
        skip: 0,
        where: {
          type: 'contactus'
        },
        contactWhere: {
          complexId: complexId,
          companyId: companyId ?? null
        },
        contactsLimit: pageLimit,
        contactsSkip: pageOffset
      }
    })
  }

  const [createContact, { loading: creatingContact }] = useMutation(
    CREATE_CONTACT,
    {
      onCompleted: () => {
        handleContactModal()
        showToast('success', `You have successfully added a new contact`)
        handleRefetchContacts()
      },
      onError: e => {
        errorHandler(e)
      }
    }
  )
  const [editContact, { loading: editingContact }] = useMutation(EDIT_CONTACT, {
    onCompleted: () => {
      handleContactModal()
      showToast('success', `You have successfully updated a contact`)
      handleRefetchContacts()
    },
    onError: e => {
      errorHandler(e)
    }
  })
  const [deleteContact, { loading: deletingContact }] = useMutation(
    DELETE_CONTACT,
    {
      onCompleted: () => {
        setShowDeleteContactModal(old => !old)
        showToast('success', `You have successfully deleted a contact`)
        handleRefetchContacts()
      },
      onError: e => {
        errorHandler(e)
      }
    }
  )

  const [showContactModal, setShowContactModal] = useState(false)
  const [selectedContact, setSelectedContact] = useState(undefined)
  const [showDeleteContactModal, setShowDeleteContactModal] = useState(false)

  const name = complexes?.getComplexes?.data[0]?.name || ''

  useEffect(() => {
    if (selectedContact !== undefined) {
      reset({
        title: selectedContact?.description,
        name: selectedContact?.name,
        email: selectedContact?.email
      })
    }
  }, [reset, selectedContact])

  const handleContactModal = () => {
    if (selectedContact) setSelectedContact(undefined)
    reset({
      title: '',
      name: '',
      email: ''
    })
    setShowContactModal(old => !old)
  }

  const handleContactForm = async () => {
    const categoryId = contactCategories?.getContactCategories?.data[0]?._id
    const { title, name, email } = getValues()
    const validated = await trigger()

    const contactData = {
      name,
      logo: null,
      description: title,
      address: null,
      email: email,
      contactNumber: 'n/a',
      categoryId
    }

    if (validated) {
      if (selectedContact) {
        editContact({
          variables: {
            data: contactData,
            contactId: selectedContact._id
          }
        })
        return
      }

      createContact({
        variables: {
          data: contactData,
          companyId,
          complexId
        }
      })
    }
  }

  const handleDeleteContact = () => {
    deleteContact({
      variables: {
        contactId: selectedContact._id
      }
    })
  }
  const contactsData = useMemo(() => {
    return {
      count: contacts?.getContactCategories?.data[0]?.contacts?.count || 0,
      limit: contacts?.getContactCategories?.data[0]?.contacts?.limit || 0,
      offset: contacts?.getContactCategories?.data[0]?.contacts?.skip || 0,
      data:
        contacts?.getContactCategories?.data[0]?.contacts?.data?.map(
          contact => {
            const dropdownData = [
              {
                label: 'Edit Contact',
                icon: <span className="ciergio-edit" />,
                function: () => {
                  setSelectedContact(contact)
                  setShowContactModal(old => !old)
                }
              },
              {
                label: 'Delete Contact',
                icon: <span className="ciergio-trash" />,
                function: () => {
                  setSelectedContact(contact)
                  setShowDeleteContactModal(old => !old)
                }
              }
            ]

            return {
              title: contact.description ?? 'n/a',
              name: contact.name ?? 'n/a',
              email: contact.email ?? 'n/a',
              button: (
                <Can
                  perform="contactus:update::delete"
                  yes={
                    <Dropdown label={<FaEllipsisH />} items={dropdownData} />
                  }
                />
              )
            }
          }
        ) || []
    }
  }, [contacts?.getContactCategories?.data[0]?.contacts?.data])

  return (
    <section className={`content-wrap pt-4 pb-8 px-8`}>
      <h1 className="content-title capitalize">{`${name} Page`}</h1>
      <p className="text-base mb-8">
        Allow users to email specific in people in your building.
      </p>

      <div className="flex items-center justify-between bg-white border rounded-t">
        <h1 className="font-bold text-base px-8 py-4">{`Contacts (${
          contacts?.getContactCategories?.data[0]?.contacts?.count ?? 0
        })`}</h1>

        <div className="flex items-center">
          <Can
            perform="contactus:create"
            yes={
              <Button
                default
                leftIcon={<FaPlusCircle />}
                label="Add Contact"
                onClick={handleContactModal}
                className="my-4 mx-4"
              />
            }
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
      <ContactModal
        loading={creatingContact || editingContact}
        onOk={handleContactForm}
        onCancel={handleContactModal}
        open={showContactModal}
        form={{
          errors,
          control
        }}
        selected={selectedContact}
      />
      <Modal
        title="Delete Contact"
        okText="Yes, delete"
        visible={showDeleteContactModal}
        onClose={() => setShowDeleteContactModal(old => !old)}
        onCancel={() => setShowDeleteContactModal(old => !old)}
        onOk={handleDeleteContact}
        okButtonProps={{
          loading: deletingContact
        }}
        width={450}
      >
        <div className="w-full p-4 leading-7">
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
