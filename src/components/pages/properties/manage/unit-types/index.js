import React, { useState, useEffect } from 'react'
import { gql, useQuery, useMutation } from '@apollo/client'
import { FaPlusCircle, FaEllipsisH } from 'react-icons/fa'
import { FiEdit2, FiTrash2 } from 'react-icons/fi'

import Card from '@app/components/card'
import Button from '@app/components/button'
import Table from '@app/components/table'
import Pagination from '@app/components/pagination'
import Dropdown from '@app/components/dropdown'
import PageLoader from '@app/components/page-loader'

import showToast from '@app/utils/toast'

import CreateEditModal from './components/createEditModal'

import styles from './index.module.css'

const GET_UNIT_TYPES_QUERY = gql`
  query getUnitTypes($where: GetUnitTypesParams, $limit: Int, $skip: Int) {
    getUnitTypes(where: $where, limit: $limit, skip: $skip) {
      count
      limit
      skip
      data {
        _id
        name
        status
      }
    }
  }
`

const CREATE_UNIT_TYPE_MUTATION = gql`
  mutation createUnitType($data: InputUnitType, $buildingId: String) {
    createUnitType(data: $data, buildingId: $buildingId) {
      _id
      processId
      message
    }
  }
`

const UPDATE_UNIT_TYPE_MUTATION = gql`
  mutation updateUnitType($unitTypeId: String, $data: InputUpdateUnitType) {
    updateUnitType(unitTypeId: $unitTypeId, data: $data) {
      _id
      processId
      message
    }
  }
`

const DELETE_UNIT_TYPE_MUTATION = gql`
  mutation deleteUnitType($data: InputDeleteUnitType) {
    deleteUnitType(data: $data) {
      _id
      processId
      message
    }
  }
`

const UnitTypeComponent = () => {
  const [units, setUnits] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [activePage, setActivePage] = useState(1)
  const [limitPage, setLimitPage] = useState(10)
  const [offsetPage, setOffsetPage] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('create')
  const [modalTitle, setModalTitle] = useState('')
  const [modalData, setModalData] = useState()

  const { loading, data, error, refetch } = useQuery(GET_UNIT_TYPES_QUERY, {
    enabled: false,
    variables: {
      where: {
        status: 'active'
      },
      limit: limitPage,
      offset: offsetPage
    }
  })

  const [
    createUnitType,
    {
      loading: loadingCreate,
      called: calledCreate,
      data: dataCreate,
      error: errorCreate
    }
  ] = useMutation(CREATE_UNIT_TYPE_MUTATION)

  const [
    updateUnitType,
    {
      loading: loadingUpdate,
      called: calledUpdate,
      data: dataUpdate,
      error: errorUpdate
    }
  ] = useMutation(UPDATE_UNIT_TYPE_MUTATION)

  const [
    deleteUnitType,
    {
      loading: loadingDelete,
      called: calledDelete,
      data: dataDelete,
      error: errorDelete
    }
  ] = useMutation(DELETE_UNIT_TYPE_MUTATION)

  useEffect(() => {
    refetch()
  }, [])

  useEffect(() => {
    if (!loading && data) {
      const tableData = {
        count: data?.getUnitTypes.count || 0,
        limit: data?.getUnitTypes.limit || 0,
        offset: data?.getUnitTypes.skip || 0,
        data:
          data?.getUnitTypes?.data.map(item => {
            const dropdownData = [
              {
                label: 'Edit Unit Type',
                icon: <FiEdit2 />,
                function: () => handleShowModal('edit', item)
              },
              {
                label: 'Delete Unit Type',
                icon: <FiTrash2 />,
                function: () => handleShowModal('delete', item)
              }
            ]

            return {
              name: item?.name,
              button: <Dropdown label={<FaEllipsisH />} items={dropdownData} />
            }
          }) || null
      }

      setUnits(tableData)
    }
  }, [loading, data, error])

  useEffect(() => {
    if (!loadingCreate) {
      if (errorCreate) {
        errorHandler(dataUpdate)
      } else if (calledCreate && dataCreate) {
        showToast('success', 'You have successfully created a category.')
        onCancel()
        refetch()
      }
      setIsLoading(false)
    }
  }, [loadingCreate, calledCreate, dataCreate, errorCreate])

  useEffect(() => {
    if (!loadingUpdate) {
      if (errorUpdate) {
        errorHandler(dataUpdate)
      } else if (calledUpdate && dataUpdate) {
        showToast('success', 'You have successfully updated a unit type.')
        onCancel()
        refetch()
      }
      setIsLoading(false)
    }
  }, [loadingUpdate, calledUpdate, dataUpdate, errorUpdate])

  useEffect(() => {
    if (!loadingDelete) {
      if (errorDelete) {
        errorHandler(dataDelete)
      } else if (calledDelete && dataDelete) {
        showToast('success', 'You have successfully deleted a unit type.')
        onCancel()
        refetch()
      }
      setIsLoading(false)
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
        showToast('danger', errors?.networkError?.result?.errors[0]?.message)
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
  }

  const onSubmit = async (type, data) => {
    setIsLoading(true)
    try {
      if (type === 'create') {
        await createUnitType({ variables: data })
      } else if (type === 'edit') {
        const updateData = {
          unitTypeId: data.id,
          data: {
            name: data.name
          }
        }
        await updateUnitType({ variables: updateData })
      } else if (type === 'delete') {
        const updateData = {
          data: {
            unitTypeId: data.id
          }
        }
        await deleteUnitType({ variables: updateData })
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
        setModalTitle('Create Unit Type')
        setModalData(null)
        break
      }
      case 'edit': {
        setModalTitle('Edit Unit Type')
        setModalData(data)
        break
      }
      case 'delete': {
        setModalTitle('Delete Unit Type')
        setModalData(data)
        break
      }
    }
    setShowModal(old => !old)
  }

  return (
    <div className={styles.PageContainer}>
      <h1 className={styles.PageHeader}>Manage Unit Types</h1>
      <Card
        noPadding
        header={
          <div className={styles.ContentFlex}>
            <span className={styles.CardHeader}>Global Unit Type</span>
            <Button
              default
              leftIcon={<FaPlusCircle />}
              label="Create Unit Type"
              onClick={() => handleShowModal('create')}
            />
          </div>
        }
        content={loading ? <PageLoader /> : units && <Table items={units} />}
      />
      {!loading && units && (
        <Pagination
          items={units}
          activePage={activePage}
          onPageClick={onPageClick}
          onLimitChange={onLimitChange}
        />
      )}

      {showModal && (
        <CreateEditModal
          processType={modalType}
          title={modalTitle}
          data={modalData}
          loading={isLoading}
          isShown={showModal}
          onSave={e => onSubmit(modalType, e)}
          onCancel={onCancel}
        />
      )}
    </div>
  )
}

export default UnitTypeComponent
