import React, { useState, useMemo, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import P from 'prop-types'
import * as yup from 'yup'
import omit from 'lodash/omit'
import isEmpty from 'lodash/isEmpty'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import axios from '@app/utils/axios'
import { FaPlusCircle, FaEllipsisH } from 'react-icons/fa'

import Button from '@app/components/button'
import PrimaryDataTable from '@app/components/globals/PrimaryDataTable'
import Modal from '@app/components/modal'
import Dropdown from '@app/components/dropdown'
import { Card } from '@app/components/globals'

import showToast from '@app/utils/toast'
import errorHandler from '@app/utils/errorHandler'
import { ACCOUNT_TYPES } from '@app/constants'

import ContactModal from './ContactModal'
import {
  GET_COMPLEX,
  GET_CONTACTS,
  GET_CONTACT_CATEGORY,
  CREATE_CONTACT,
  EDIT_CONTACT,
  DELETE_CONTACT
} from '../queries'
import Can from '@app/permissions/can'

const validationSchema = yup.object().shape({
  name: yup.string().required('This field is required'),
  contactNumber: yup.string().required('This field is required'),
  address: yup
    .object()
    .shape({
      formattedAddress: yup.string(),
      city: yup.string()
    })
    .nullable(),
  category: yup
    .object()
    .shape({
      label: yup.string(),
      value: yup.string().required('This field is required')
    })
    .nullable()
})

const columns = [
  {
    name: '',
    width: ''
  },
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
]

const formatNumber = number => {
  if (number) {
    const split = number.split('')
    return split.map((s, i) => {
      if (i === 2 || i === 3 || i === 7) {
        return `${s} `
      }
      return s
    })
  }
  return ''
}

function Contact({ id }) {
  const router = useRouter()
  const profile = JSON.parse(window.localStorage.getItem('profile'))
  const profileData = profile?.accounts?.data[0]
  const accountType = profile?.accounts?.data[0]?.accountType
  const companyId = router?.query?.companyId ?? profileData?.company?._id
  const complexId = id ?? profileData?.complex?._id
  const [showContactModal, setShowContactModal] = useState(false)
  const [imageUrls, setImageUrls] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedContact, setSelectedContact] = useState(null)
  const [showDeleteContactModal, setShowDeleteContactModal] = useState(false)
  const [pageLimit, setPageLimit] = useState(10)
  const [offset, setPageOffset] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [fileUploadedData, setFileUploadedData] = useState([])

  const {
    getValues,
    control,
    errors,
    reset,
    setValue,
    trigger,
    setError,
    watch
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      logo: null,
      name: '',
      contactNumber: '',
      address: null,
      category: null
    }
  })

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
      complexId: complexId ?? null,
      companyId: companyId ?? null,
      limit: pageLimit,
      offset
    }
  })
  const { data: categories } = useQuery(GET_CONTACT_CATEGORY, {
    variables: {
      complexId: complexId ?? null,
      companyId: companyId ?? null
    }
  })

  const handleRefetchContacts = () => {
    refetchContacts({
      variables: {
        complexId: complexId ?? null,
        companyId: companyId ?? null,
        limit: pageLimit,
        offset
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

  const name = complexes?.getComplexes?.data[0]?.name || ''

  useEffect(() => {
    if (selectedContact) {
      reset({
        category: selectedContact?.category?._id,
        name: selectedContact.name,
        contactNumber: selectedContact.contactNumber,
        address: selectedContact?.address?.formattedAddress || ''
      })
    }
  }, [reset, selectedContact])

  const handleContactModal = () => {
    if (selectedContact) setSelectedContact(null)
    reset({
      category: null,
      name: '',
      contactNumber: '',
      address: null
    })
    setFileUploadedData([])
    setImageUrls([])
    setValue('images', null)
    setShowContactModal(old => !old)
  }

  const handleCreateContact = async () => {
    const values = getValues()
    const { category, name, contactNumber, address } = values
    const validated = await trigger()
    const phoneNumber = parsePhoneNumberFromString(contactNumber, 'PH')
    if (validated && !phoneNumber.isValid()) {
      setError('contactNumber', {
        type: 'manual',
        message:
          'Invalid phone/mobile number, must be a valid Philippine phone or mobile number'
      })
    }

    let addressData = {}
    if (selectedContact) {
      addressData = address?.formattedAddress
        ? {
            ...omit(address, '__typename')
          }
        : {
            ...omit(selectedContact?.address, '__typename')
          }
    } else {
      addressData = address
    }

    let contactData = {
      name,
      logo: fileUploadedData[0]?.url,
      contactNumber,
      categoryId: category?.value ?? selectedContact?.category?._id
    }

    if (!isEmpty(addressData)) {
      contactData = { ...contactData, address: addressData }
    }

    if (validated && phoneNumber.isValid()) {
      setFileUploadedData([])
      if (selectedContact) {
        setSelectedContact(null)
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
          companyId: companyId,
          complexId: complexId
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

  const uploadApi = async payload => {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        'company-id':
          accountType === ACCOUNT_TYPES.SUP.value ? 'oci' : companyId
      }
    }

    const response = await axios.post('/', payload, config)
    if (response?.data) {
      const files = response.data.map(item => {
        return {
          url: item.location,
          type: item.mimetype
        }
      })
      setLoading(false)
      setFileUploadedData(files)
    }
  }

  const handleUploadImage = e => {
    const files = e.target.files ? e.target.files : e.dataTransfer.files
    const formData = new FormData()
    const fileList = []

    if (files) {
      setLoading(true)
      for (const file of files) {
        const reader = new FileReader()

        reader.onloadend = () => {
          setImageUrls(imageUrls => [...imageUrls, reader.result])
        }
        reader.readAsDataURL(file)

        formData.append('files', file)
        fileList.push(file)
      }
      setValue('images', fileList)

      uploadApi(formData)
    }
  }

  const handleRemoveImage = e => {
    const images = imageUrls.filter(image => {
      return image !== e.currentTarget.dataset.id
    })
    setImageUrls(images)
    setFileUploadedData([])
    setValue('images', images.length !== 0 ? images : null)
  }

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
                handleContactModal()
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
            image: (
              <div className="w-11 h-11 rounded-full overflow-auto">
                <img
                  className="h-full w-full object-contain object-center"
                  src={
                    contact?.logo ??
                    `https://ui-avatars.com/api/?name=${contact.name}`
                  }
                  alt="contact-avatar"
                />
              </div>
            ),
            name: (
              <div className="flex items-center justify-start">
                <div>
                  <p>{contact.name}</p>
                  <p className="text-gray-600">
                    {formatNumber(contact.contactNumber)}
                  </p>
                </div>
              </div>
            ),
            category: contact?.category.name,
            address: contact?.address?.formattedAddress,
            button: (
              <Can
                perform="directory:contact:update::delete"
                yes={<Dropdown label={<FaEllipsisH />} items={dropdownData} />}
                no={null}
              />
            )
          }
        }) || []
    }
  }, [contacts?.getContacts?.data])

  const categoryOptions = useMemo(() => {
    if (categories?.getContactCategories?.data?.length > 0) {
      return categories.getContactCategories?.data?.map(contact => ({
        label: contact.name,
        value: contact._id
      }))
    }

    return []
  }, [categories?.getContactCategories?.data])

  return (
    <section className={`content-wrap pt-4 pb-8 px-8`}>
      <h1 className="content-title capitalize">{`Directory`}</h1>
      <div className="flex items-center justify-between bg-white border rounded-t">
        <h1 className="font-bold text-base px-8 py-4">{`Directory (${
          contacts?.getContacts?.count ?? 0
        })`}</h1>

        <div className="flex items-center">
          <Can
            perform="directory:contact:create"
            yes={
              <Button
                default
                leftIcon={<FaPlusCircle />}
                label="Add Contact"
                onClick={handleContactModal}
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
      <ContactModal
        onCancel={handleContactModal}
        open={showContactModal}
        onUploadImage={handleUploadImage}
        onRemoveImage={handleRemoveImage}
        onOk={handleCreateContact}
        categoryOptions={categoryOptions}
        onGetMapValue={getMapValue}
        imageURLs={imageUrls}
        form={{
          control,
          errors,
          setValue,
          watch
        }}
        loading={creatingContact || editingContact}
        uploading={loading}
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

export default Contact
