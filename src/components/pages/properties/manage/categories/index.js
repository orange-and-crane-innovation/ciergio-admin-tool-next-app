/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-key */
import React, { useEffect, useState } from 'react'
import { BsPencil, BsTrash } from 'react-icons/bs'
import { FaEllipsisH, FaPlusCircle } from 'react-icons/fa'

import { gql, useMutation, useQuery } from '@apollo/client'
import Button from '@app/components/button'
import Card from '@app/components/card'
import Dropdown from '@app/components/dropdown'
import PageLoader from '@app/components/page-loader'
import Pagination from '@app/components/pagination'
import Pills from '@app/components/pills'
import Table from '@app/components/table'
import showToast from '@app/utils/toast'

import CreateEditDeleteModal from './components/createEditDeleteModal'
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
  mutation createPostCategory(
    $name: String
    $type: CategoryType
    $companyId: String
  ) {
    createPostCategory(name: $name, type: $type, companyId: $companyId) {
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

const DELETE_POST_CATEGORY_MUTATION = gql`
  mutation deletePostCategory(
    $_id: String
    $accountType: CategoryAccountType
    $accountId: String
    $categoryIds: [String]
  ) {
    deletePostCategory(
      accountType: $accountType
      accountId: $accountId
      _id: $_id
      categoryIds: $categoryIds
    ) {
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
      name: 'Pastoral Works',
      value: 'pastoral_works'
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

  const [
    deletePostCategory,
    {
      loading: loadingDelete,
      called: calledDelete,
      data: dataDelete,
      error: errorDelete
    }
  ] = useMutation(DELETE_POST_CATEGORY_MUTATION)

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
                icon: <BsPencil />,
                function: () => handleShowModal('edit', item)
              },
              {
                label: 'Delete Category',
                icon: <BsTrash />,
                function: () => handleShowModal('delete', item)
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

  useEffect(() => {
    if (!loadingDelete) {
      if (errorDelete) {
        errorHandler(errorDelete)
      }
      if (calledDelete && dataDelete) {
        showToast('success', 'You have successfully deleted a category.')
        onCancel()
        refetch()
      }
    }
  }, [loadingDelete, calledDelete, dataDelete, errorDelete])

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
    const currentUser = JSON.parse(localStorage.getItem('profile'))
    try {
      if (type === 'create') {
        const {
          accounts: { data: accntData }
        } = currentUser

        const createData = {
          ...data,
          companyId: accntData[0]?.company?._id
        }
        await createPostCategory({ variables: createData })
      } else if (type === 'edit') {
        const updateData = {
          id: data.id,
          data: {
            name: data.name
          }
        }
        await updatePostCategory({ variables: updateData })
      } else if (type === 'delete') {
        const deleteData = {
          // _id: data.id,
          // accountType: data.type,
          // accountId: data.id,
          categoryIds: [data.id]
        }
        await deletePostCategory({ variables: deleteData })
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
      case 'delete': {
        setModalTitle('Delete Category')
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
  } else if (categoryType === 'pastoral_works') {
    pageHeader = 'Pastoral Works'
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
        <CreateEditDeleteModal
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
