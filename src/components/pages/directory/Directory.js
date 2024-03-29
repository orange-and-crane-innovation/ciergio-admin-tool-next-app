/* eslint-disable react/jsx-key */
import React, { useState, useMemo } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Link from 'next/link'

import { Card, Tabs } from '@app/components/globals'
import Table from '@app/components/table'
import Modal from '@app/components/modal'
import FormInput from '@app/components/forms/form-input'
import Button from '@app/components/button'
import Dropdown from '@app/components/dropdown'
import Can from '@app/permissions/can'
import showToast from '@app/utils/toast'
import errorHandler from '@app/utils/errorHandler'

import ManageDirectory from './ManageDirectory'

import { initializeApollo } from '@app/lib/apollo/client'

import { FaPlusCircle, FaEllipsisH } from 'react-icons/fa'

import {
  GET_COMPANIES,
  GET_CONTACT_CATEGORY,
  CREATE_CATEGORY,
  EDIT_CATEGORY,
  DELETE_CATEGORY
} from './queries'

const validationSchema = yup.object().shape({
  category_name: yup.string().label('Category Name').required()
})

const validationSchemaEdit = yup.object().shape({
  edit_category_name: yup.string().label('Category Name').required()
})

const columns = [
  {
    name: 'Name',
    width: ''
  }
]

function Directory() {
  const [categoryPageLimit, setCategoryPageLimit] = useState(10)
  const [categoryPageOffset, setCategoryPageOffset] = useState(0)
  const [categoryCurrentPage, setCategoryCurrentPage] = useState(1)
  const [newCategory, setNewCategory] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedId, setSelectedId] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false)
  const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(false)

  const { handleSubmit, control, reset, watch, setValue, errors } = useForm({
    resolver: yupResolver(
      showEditCategoryModal ? validationSchemaEdit : validationSchema
    ),
    defaultValues: {
      category_name: '',
      edit_category_name: ''
    }
  })

  const { data: companies } = useQuery(GET_COMPANIES)
  const { data: categories, refetch: refetchCategories } = useQuery(
    GET_CONTACT_CATEGORY,
    {
      variables: {
        limit: categoryPageLimit,
        offset: categoryPageOffset
      }
    }
  )

  const handleOnError = err => {
    const statusCode = err.networkError.statusCode
    if (statusCode === 409) {
      const categoryName = watch('category_name') || watch('edit_category_name')
      showToast('danger', `${categoryName} already exists.`)
    } else {
      showToast('danger', `Unexpected Error. Please try again.`)
    }
  }

  const [createCategory] = useMutation(CREATE_CATEGORY, {
    onCompleted: () => {
      handleClearModal('create')
      showToast('success', 'You have successfully created a category.')
      refetchCategories()
    },
    onError: handleOnError
  })

  const [editCategory] = useMutation(EDIT_CATEGORY, {
    onCompleted: () => {
      handleClearModal('edit')
      refetchCategories()
    },
    onError: handleOnError
  })

  const [deleteCategory] = useMutation(DELETE_CATEGORY, {
    onCompleted: () => {
      handleClearModal('delete')
      refetchCategories()
    },
    onError: e => {
      errorHandler(e)
    }
  })

  const handleShowModal = (view, id) => {
    setSelectedId(id)
    switch (view) {
      case 'create':
        setShowModal(old => !old)
        break
      case 'edit':
        setShowEditCategoryModal(old => !old)
        break
      case 'delete':
        setShowDeleteCategoryModal(old => !old)
        break
      default:
        break
    }
  }

  const handleClearModal = type => {
    if (newCategory !== '') {
      setNewCategory('')
    }
    reset({
      category_name: '',
      edit_category_name: ''
    })
    handleShowModal(type, '')
  }

  const handleOk = values => {
    createCategory({ variables: { data: { name: values.category_name } } })
  }

  const handleEditCategory = values => {
    setSelectedCategory('')
    editCategory({
      variables: {
        data: { name: values.edit_category_name },
        categoryId: selectedId
      }
    })
  }

  const handleDeleteCategory = () => {
    deleteCategory({ variables: { categoryId: selectedId } })
  }

  const directoryData = useMemo(
    () => ({
      count: companies?.getCompanies.count || 0,
      limit: companies?.getCompanies.limit || 0,
      data:
        companies?.getCompanies?.data?.map(item => {
          return {
            name: (
              <Link href={`/directory/companies/${item._id}`}>
                <span className="text-blue-600 cursor-pointer">
                  {item.name}
                </span>
              </Link>
            )
          }
        }) || []
    }),
    [companies?.getCompanies]
  )

  const directoryCategories = useMemo(() => {
    const cats = categories?.getContactCategories

    return {
      count: cats?.count || 0,
      limit: cats?.limit || categoryPageLimit,
      data:
        cats?.count > 0
          ? cats.data.map(c => {
              const dropdownData = [
                {
                  label: 'Edit Category',
                  icon: <span className="ciergio-edit" />,
                  function: () => {
                    setValue('edit_category_name', c.name)
                    setSelectedCategory(c.name)
                    handleShowModal('edit', c._id)
                  }
                },
                {
                  label: 'Delete Category',
                  icon: <span className="ciergio-trash" />,
                  function: () => {
                    setSelectedCategory(c.name)
                    handleShowModal('delete', c._id)
                  }
                }
              ]

              return {
                name: c.name,
                dropdown: (
                  <Can
                    perform="directory:categories:update::delete"
                    yes={
                      <Dropdown label={<FaEllipsisH />} items={dropdownData} />
                    }
                  />
                )
              }
            })
          : []
    }
  }, [categories?.getContactCategories])

  return (
    <section className={`content-wrap pt-4 pb-8 px-8`}>
      <h1 className="content-title">Directory</h1>
      <Tabs defaultTab="1">
        <Tabs.TabLabels>
          <Tabs.TabLabel id="1">Directory</Tabs.TabLabel>
          <Tabs.TabLabel id="2">Manage Directory</Tabs.TabLabel>
        </Tabs.TabLabels>
        <Tabs.TabPanels>
          <Tabs.TabPanel id="1">
            <Card
              noPadding
              title={
                <div className="flex items-center justify-between">
                  <span className="text-base leading-5 font-bold">
                    Companies
                  </span>
                </div>
              }
              content={<Table rowNames={columns} items={directoryData} />}
              className="rounded-t-none"
            />
          </Tabs.TabPanel>
          <Tabs.TabPanel id="2">
            <Card
              title=" "
              actions={[
                <Button
                  key="add"
                  default
                  leftIcon={<FaPlusCircle />}
                  label="Add Category"
                  onClick={() => handleShowModal('create', null)}
                />
              ]}
              content={
                <ManageDirectory
                  data={directoryCategories}
                  pageLimit={categoryPageLimit}
                  currentPage={categoryCurrentPage}
                  setPageLimit={setCategoryPageLimit}
                  setCurrentPage={setCategoryCurrentPage}
                  setPageOffset={setCategoryPageOffset}
                />
              }
            />
            <Modal
              title="Add Category"
              okText="Add"
              visible={showModal}
              onClose={() => handleClearModal('create')}
              onCancel={() => handleClearModal('create')}
              onOk={handleSubmit(handleOk)}
              width={450}
            >
              <div className="w-full p-4">
                <form>
                  <p className="text-base leading-5 font-semibold">
                    New Category Name
                  </p>
                  <Controller
                    name="category_name"
                    control={control}
                    render={({ value, onChange, name }) => (
                      <FormInput
                        name={name}
                        placeholder="Enter new category"
                        onChange={onChange}
                        value={value}
                        error={errors?.category_name?.message ?? null}
                      />
                    )}
                  />
                </form>
              </div>
            </Modal>
            <Modal
              title="Edit Category"
              okText="Okay"
              visible={showEditCategoryModal}
              onClose={() => handleClearModal('edit')}
              onCancel={() => handleClearModal('edit')}
              onOk={handleSubmit(handleEditCategory)}
              width={450}
            >
              <div className="w-full p-4">
                <form>
                  <p className="text-base leading-5 font-semibold">
                    New Category Name
                  </p>
                  <Controller
                    name="edit_category_name"
                    control={control}
                    render={({ value, onChange, name }) => (
                      <FormInput
                        name={name}
                        placeholder="Enter new category"
                        onChange={onChange}
                        value={value}
                        error={errors?.edit_category_name?.message ?? null}
                      />
                    )}
                  />
                </form>
              </div>
            </Modal>
            <Modal
              title="Delete Category"
              okText="Yes, delete"
              visible={showDeleteCategoryModal}
              onClose={() => handleClearModal('delete')}
              onCancel={() => handleClearModal('delete')}
              onOk={handleDeleteCategory}
              width={450}
            >
              <div className="w-full p-4 leading-7">
                <div>
                  <p className="mb-4">
                    <span className="font-medium">Warning: </span>{' '}
                    {`You're about to delete `}
                    <span className="font-medium">{selectedCategory}</span>
                  </p>
                  <p className="mb-4">
                    You will remove this category for everyone together with the
                    contacts associated with it.
                  </p>
                  <p>Are you sure you want to delete?</p>
                </div>
              </div>
            </Modal>
          </Tabs.TabPanel>
        </Tabs.TabPanels>
      </Tabs>
    </section>
  )
}

export async function getStaticProps() {
  const apolloClient = initializeApollo()

  await apolloClient.query({
    query: GET_COMPANIES
  })

  await apolloClient.query({
    query: GET_CONTACT_CATEGORY
  })

  return {
    props: {
      initialApolloState: apolloClient.cache.extract()
    }
  }
}

export default Directory
