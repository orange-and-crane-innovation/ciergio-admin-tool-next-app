/* eslint-disable react/jsx-key */
import React, { useState, useMemo, useCallback, useEffect } from 'react'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/client'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'

import Pagination from '@app/components/pagination'
import Button from '@app/components/button'
import FormInput from '@app/components/forms/form-input'
import FormSelect from '@app/components/forms/form-select'
import Modal from '@app/components/modal'
import UploaderImage from '@app/components/uploader/image'
import Checkbox from '@app/components/forms/form-checkbox'
import Dropdown from '@app/components/dropdown'
import Table from '@app/components/table'
import { Card } from '@app/components/globals'

import { initializeApollo } from '@app/lib/apollo/client'

import { FaPlusCircle, FaTimes } from 'react-icons/fa'
import { FiFileText, FiEdit2, FiSearch } from 'react-icons/fi'
import { AiOutlineEllipsis } from 'react-icons/ai'

const GET_CONTACTS = gql`
  query Contacts($category: String, $building: String) {
    getContacts(
      where: { categoryId: $category, buildingId: $building, type: directory }
    ) {
      count
      limit
      data {
        _id
        name
        logo
        contactNumber
        building {
          name
        }
        address {
          formattedAddress
          city
        }
        category {
          _id
          name
          order
          __typename
        }
      }
      __typename
    }
  }
`

const GET_BUILDINGS = gql`
  {
    getBuildings {
      count
      limit
      data {
        _id
        name
      }
    }
  }
`

const GET_CONTACT_CATEGORIES = gql`
  {
    getContactCategories(where: { type: directory }) {
      count
      limit
      data {
        _id
        name
        order
      }
      __typename
    }
  }
`

const validationSchema = yup.object().shape({
  contact_name: yup.string().label('Contact Name').required(),
  contact_number: yup.string().label('Contact Number').required(),
  contact_address: yup.string().label('Contact Address')
})

const yupConfig = {
  resolver: yupResolver(validationSchema),
  defaultValues: {
    contact_name: '',
    contact_number: '',
    contact_address: ''
  }
}

function Directory() {
  const { handleSubmit, control, errors } = useForm(yupConfig)
  const [categoryId, setCategoryId] = useState('')
  const [buildingId, setBuildingId] = useState('')

  const { data: contacts, refetch: refetchContacts } = useQuery(GET_CONTACTS, {
    variables: {
      building: buildingId,
      category: categoryId
    }
  })
  const { data: buildings } = useQuery(GET_BUILDINGS)
  const { data: categories } = useQuery(GET_CONTACT_CATEGORIES)
  const [showModal, setShowModal] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [selectedData, setSelectedData] = useState([])

  useEffect(() => {
    refetchContacts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId, buildingId])

  const onCheckAll = useCallback(
    e => {
      const checkboxes = document.getElementsByName('checkbox')

      for (let i = 0; i < checkboxes.length; i++) {
        const data = checkboxes[i].getAttribute('data-id')
        if (e.target.checked) {
          if (!selectedData.includes(data)) {
            setSelectedData(old => [...old, data])
          }
          checkboxes[i].checked = true
        } else {
          setSelectedData(old => [...old.filter(item => item !== data)])
          checkboxes[i].checked = false
        }
      }
    },
    [selectedData]
  )

  const onCheck = useCallback(
    e => {
      const data = e.target.getAttribute('data-id')

      if (e.target.checked) {
        if (!selectedData.includes(data)) {
          setSelectedData(old => [...old, data])
        }
      } else {
        setSelectedData(old => [...old.filter(item => item !== data)])
      }
    },
    [selectedData]
  )

  const handleShowModal = () => setShowModal(old => !old)

  const handleClearModal = () => {
    handleShowModal()
  }

  const handleOk = values => {
    console.log({ values })
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
        name: 'Name',
        width: '35%'
      },
      {
        name: 'Category',
        width: '20%'
      },
      {
        name: 'Address',
        width: '20%'
      },
      {
        name: '',
        width: ''
      }
    ],
    [onCheckAll]
  )

  const directoryData = useMemo(
    () => ({
      count: contacts?.getContacts.count || 0,
      limit: contacts?.getContacts.limit || 0,
      offset: contacts?.getContacts.offset || 0,
      data:
        contacts?.getContacts.data.map(item => {
          const dropdownData = [
            {
              label: 'Edit Contact',
              icon: <FiEdit2 />,
              function: () => console.log({ item })
            },
            {
              label: 'Delete Contact',
              icon: <FiFileText />,
              function: () => console.log({ item })
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
            name: (
              <div className="flex items-center justify-start">
                <div>
                  <img
                    className="rounded-full w-8 h-8"
                    src={
                      item?.logo ??
                      `https://ui-avatars.com/api/?name=${item?.name}&rounded=true&size=32`
                    }
                    alt="avatar"
                  />
                </div>
                <div className="ml-4">
                  <p>{item.name}</p>
                  <p className="text-gray-600">{item.contactNumber}</p>
                </div>
              </div>
            ),
            category: item.category.name,
            address: item.address?.formattedAddress ?? item.address?.city,
            button: (
              <Dropdown label={<AiOutlineEllipsis />} items={dropdownData} />
            )
          }
        }) || []
    }),
    [contacts, onCheck]
  )

  const buildingOptions = useMemo(() => {
    if (buildings?.getBuildings?.data?.length > 0) {
      return buildings.getBuildings.data.map(building => ({
        label: building.name,
        value: building._id
      }))
    }

    return []
  }, [buildings])

  const directoryCategories = useMemo(() => {
    if (categories?.getContactCategories?.data?.length > 0) {
      return categories.getContactCategories.data.map(category => ({
        label: category.name,
        value: category._id
      }))
    }

    return []
  }, [categories])

  return (
    <section className={`content-wrap pt-4 pb-8 px-8`}>
      <h1 className="content-title capitalize">{`Directory`}</h1>
      <div className="flex items-center justify-end mt-12 mx-4 w-full">
        <div className="flex items-center justify-between w-6/12 flex-row">
          <div className="w-full mr-4">
            <FormSelect
              options={[{ label: 'All', value: '' }, ...directoryCategories]}
              onChange={e => setCategoryId(e.target.value)}
            />
          </div>
          <div className="w-full mr-4">
            <FormSelect
              options={[
                { label: 'All Buildings', value: '' },
                ...buildingOptions
              ]}
              onChange={e => setBuildingId(e.target.value)}
            />
          </div>
          <div className="w-full relative mr-4">
            <span className="absolute top-3.5 left-3">
              {searchText ? (
                <FaTimes className="cursor-pointer" onClick={() => {}} />
              ) : (
                <FiSearch className="text-gray-600 text-base" />
              )}
            </span>
            <FormInput
              name="search"
              placeholder="Search"
              inputClassName="pl-8"
              onChange={e => setSearchText(e.target.value)}
              value={searchText}
            />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between bg-white border rounded-t">
        <h1 className="font-bold text-base px-8 py-4">{`Directory (${
          contacts?.getContacts?.data?.length ?? 0
        })`}</h1>

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
        content={<Table rowNames={columns} items={directoryData} />}
        className="rounded-t-none"
      />
      <Pagination
        items={directoryData}
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
                  inputProps={props}
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
                  inputProps={props}
                />
              )}
            />
          </form>
        </div>
      </Modal>
    </section>
  )
}

export async function getStaticProps() {
  const apolloClient = initializeApollo()

  await apolloClient.query({
    query: GET_CONTACTS
  })

  await apolloClient.query({
    query: GET_BUILDINGS
  })

  await apolloClient.query({
    query: GET_CONTACT_CATEGORIES
  })

  return {
    props: {
      initialApolloState: apolloClient.cache.extract()
    }
  }
}

export default Directory
