/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-key */
import React, { useState, useEffect } from 'react'
import { gql, useQuery, useMutation } from '@apollo/client'
import { FaPlusCircle, FaEllipsisH } from 'react-icons/fa'
import { FiEdit2 } from 'react-icons/fi'

import Card from '@app/components/card'
import Button from '@app/components/button'
import Table from '@app/components/table'
import Pagination from '@app/components/pagination'
import Dropdown from '@app/components/dropdown'
import Pills from '@app/components/pills'
import PageLoader from '@app/components/page-loader'

import showToast from '@app/utils/toast'

import CreateEditModal from './components/createEditModal'

import styles from './index.module.css'

const GET_POST_CATEGORY_QUERY = gql`
  query getPostCategory(
    $where: PostCategoryInput
    $sort: PostCategorySort
    $limit: Int
    $offset: Int
  ) {
    getPostCategory(
      where: $where
      sort: $sort
      limit: $limit
      offset: $offset
    ) {
      count
      limit
      offset
      category {
        _id
        name
        type
        status
      }
    }
  }
`

const CREATE_POST_CATEGORY_MUTATION = gql`
  mutation createPostCategory($name: String, $type: CategoryType) {
    createPostCategory(name: $name, type: $type) {
      _id
      processId
      message
    }
  }
`

const UPDATE_POST_CATEGORY_MUTATION = gql`
  mutation updatePostCategory($id: String, $data: category) {
    updatePostCategory(id: $id, data: $data) {
      _id
      processId
      message
    }
  }
`

const CategoriesComponent = () => {
  const system = process.env.NEXT_PUBLIC_SYSTEM_TYPE
  const [categories, setCategories] = useState()
  const [categoryType, setCategoryType] = useState('post')
  const [activePage, setActivePage] = useState(1)
  const [limitPage, setLimitPage] = useState(10)
  const [offsetPage, setOffsetPage] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('create')
  const [modalTitle, setModalTitle] = useState('')
  const [modalData, setModalData] = useState()
  const isSystemPray = system === 'pray'
  const isSystemCircle = system === 'circle'
  let pageHeader = ''

  const pillData = [
    {
      name: 'Bulletin Board',
      value: 'post'
    },
    {
      name: isSystemPray ? 'Prayer Requests' : 'Maintenance and Repairs',
      value: 'issue',
      hidden: isSystemCircle
    },
    {
      name: 'Notifications',
      value: 'flash'
    }
  ]

  const { loading, data, error, refetch } = useQuery(GET_POST_CATEGORY_QUERY, {
    enabled: false,
    variables: {
      where: {
        type: categoryType
      },
      sort: {
        by: 'name',
        order: 'asc'
      },
      limit: limitPage,
      offset: offsetPage
    }
  })

  const [
    createPostCategory,
    {
      loading: loadingCreate,
      called: calledCreate,
      data: dataCreate,
      error: errorCreate
    }
  ] = useMutation(CREATE_POST_CATEGORY_MUTATION)

  const [
    updatePostCategory,
    {
      loading: loadingUpdate,
      called: calledUpdate,
      data: dataUpdate,
      error: errorUpdate
    }
  ] = useMutation(UPDATE_POST_CATEGORY_MUTATION)

  useEffect(() => {
    refetch()
  }, [])

  useEffect(() => {
    if (error) {
      errorHandler(error)
    }
    if (!loading && data) {
      const tableData = {
        count: data?.getPostCategory.count || 0,
        limit: data?.getPostCategory.limit || 0,
        offset: data?.getPostCategory.offset || 0,
        data:
          data?.getPostCategory?.category.map(item => {
            const dropdownData = [
              {
                label: 'Edit Category',
                icon: <FiEdit2 />,
                function: () => handleShowModal('edit', item)
              }
            ]

            return {
              name: item?.name,
              button: <Dropdown label={<FaEllipsisH />} items={dropdownData} />
            }
          }) || null
      }

      setCategories(tableData)
    }
  }, [loading, data, error])

  useEffect(() => {
    if (!loadingCreate) {
      if (errorCreate) {
        errorHandler(errorCreate)
      }
      if (calledCreate && dataCreate) {
        showToast('success', 'You have successfully created a category.')
        onCancel()
        refetch()
      }
    }
  }, [loadingCreate, calledCreate, dataCreate, errorCreate])

  useEffect(() => {
    if (!loadingUpdate) {
      if (errorUpdate) {
        errorHandler(errorUpdate)
      }
      if (calledUpdate && dataUpdate) {
        showToast('success', 'You have successfully updated a category.')
        onCancel()
        refetch()
      }
    }
  }, [loadingUpdate, calledUpdate, dataUpdate, errorUpdate])

  const errorHandler = data => {
    const errors = JSON.parse(JSON.stringify(data))

    if (errors) {
      const { graphQLErrors, networkError, message } = errors
      if (graphQLErrors)
        graphQLErrors.map(({ message, locations, path }) =>
          showToast('danger', message)
        )

      if (networkError?.result?.errors) {
        if (networkError?.result?.errors[0]?.code === 4000) {
          showToast('danger', 'Category name already exists')
        } else {
          showToast('danger', errors?.networkError?.result?.errors[0]?.message)
        }
      }

      if (
        message &&
        graphQLErrors?.length === 0 &&
        !networkError?.result?.errors
      ) {
        showToast('danger', message)
      }
    }
  }

  const onPageClick = e => {
    setActivePage(e)
    setOffsetPage(limitPage * (e - 1))
  }

  const onLimitChange = e => {
    setLimitPage(Number(e.value))
    setActivePage(1)
    setOffsetPage(0)
  }

  const onCategorySelect = type => {
    setCategoryType(type)
    setActivePage(1)
    setLimitPage(10)
    setOffsetPage(0)
  }

  const onSubmit = async (type, data) => {
    try {
      if (type === 'create') {
        await createPostCategory({ variables: data })
      } else if (type === 'edit') {
        const updateData = {
          id: data.id,
          data: {
            name: data.name
          }
        }
        await updatePostCategory({ variables: updateData })
      }
    } catch (e) {
      console.log(e)
    }
  }

  const onCancel = () => {
    setShowModal(false)
  }

  const handleShowModal = (type, data) => {
    setModalType(type)

    switch (type) {
      case 'create': {
        setModalTitle('Create Category')
        setModalData(null)
        break
      }
      case 'edit': {
        setModalTitle('Edit Category')
        setModalData(data)
        break
      }
    }
    setShowModal(old => !old)
  }

  if (categoryType === 'post') {
    pageHeader = 'Bulletin Board'
  } else if (categoryType === 'issue') {
    pageHeader = isSystemPray ? 'Prayer Requests' : 'Maintenance and Repairs'
  } else if (categoryType === 'flash') {
    pageHeader = 'Flash Notifications'
  }

  return (
    <div className={styles.PageContainer}>
      <h1 className={styles.PageHeader}>Manage Global Categories</h1>
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/4 mr-4">
          <Pills
            data={pillData}
            activeKey={categoryType}
            onClick={onCategorySelect}
          />
        </div>
        <div className="w-full md:w-3/4">
          <Card
            noPadding
            header={
              <div className={styles.ContentFlex}>
                <span className={styles.CardHeader}>
                  Categories for {pageHeader}
                </span>
                <Button
                  default
                  leftIcon={<FaPlusCircle />}
                  label="Create Category"
                  onClick={() => handleShowModal('create')}
                />
              </div>
            }
            content={
              loading ? (
                <PageLoader />
              ) : (
                categories && <Table items={categories} />
              )
            }
          />
          {!loading && categories && (
            <Pagination
              items={categories}
              activePage={activePage}
              onPageClick={onPageClick}
              onLimitChange={onLimitChange}
            />
          )}
        </div>
      </div>

      {showModal && (
        <CreateEditModal
          processType={modalType}
          categoryType={categoryType}
          title={modalTitle}
          data={modalData}
          isShown={showModal}
          onSave={e => onSubmit(modalType, e)}
          onCancel={onCancel}
        />
      )}
    </div>
  )
}

export default CategoriesComponent
