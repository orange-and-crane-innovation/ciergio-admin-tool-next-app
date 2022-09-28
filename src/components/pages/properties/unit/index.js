/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-key */
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { gql, useQuery, useMutation } from '@apollo/client'
import { FaEllipsisH, FaInfoCircle } from 'react-icons/fa'
import { FiTrash2 } from 'react-icons/fi'

import Tabs from '@app/components/tabs'
import Dropdown from '@app/components/dropdown'

import showToast from '@app/utils/toast'
import { IMAGES } from '@app/constants'
import getAccountTypeName from '@app/utils/getAccountTypeName'

import CreateModal from './components/createModal'
import DeleteModal from './components/deleteModal'

import OverviewPage from '../overview'
import DuesPage from '../dues'
import HistoryPage from '../history'

import styles from './index.module.css'

const GET_UNITS_QUERY = gql`
  query getUnits($where: GetUnitsParams, $limit: Int, $skip: Int) {
    getUnits(where: $where, limit: $limit, skip: $skip) {
      count
      limit
      skip
      data {
        _id
        name
        floorNumber
        createdAt
        unitOwner {
          _id
          accountType
          user {
            _id
            firstName
            lastName
            email
            avatar
          }
        }
        unitType {
          _id
          name
        }
        unitSize
        building {
          name
        }
      }
    }
  }
`

const GET_EXTENSION_ACCOUNTS_QUERY = gql`
  query getExtensionAccountRequests(
    $where: GetExtensionAccountRequestsParams
    $limit: Int
    $skip: Int
  ) {
    getExtensionAccountRequests(where: $where, limit: $limit, skip: $skip) {
      count
      limit
      skip
      data {
        _id
        registrationId
        email
        firstName
        lastName
        status
        accountType
        relationship
        createdAt
        unit {
          name
        }
        account {
          _id
        }
      }
    }
  }
`

const CREATE_EXTENSION_ACCOUNT_QUERY = gql`
  mutation requestExtensionAccount(
    $data: InputRequestExtensionAccount
    $unitId: String
  ) {
    requestExtensionAccount(data: $data, unitId: $unitId) {
      _id
      processId
      message
    }
  }
`

const DELETE_ACCOUNT_QUERY = gql`
  mutation deleteAccount($data: InputDeleteAccount) {
    deleteAccount(data: $data) {
      _id
      processId
      message
    }
  }
`

const UnitDirectoryComponent = () => {
  const router = useRouter()
  const [unit, setUnit] = useState()
  const [unitOwner, setUnitOwner] = useState()
  const [residents, setResidents] = useState()
  const [activePage, setActivePage] = useState(1)
  const [limitPage, setLimitPage] = useState(10)
  const [offsetPage, setOffsetPage] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('create')
  const [modalTitle, setModalTitle] = useState('')
  const [modalData, setModalData] = useState()

  const { loading, data, error } = useQuery(GET_UNITS_QUERY, {
    enabled: false,
    variables: {
      where: {
        _id: router.query.id
      }
    }
  })

  const {
    loading: loadingResidents,
    data: dataResidents,
    error: errorResidents,
    refetch: refetchResidents
  } = useQuery(GET_EXTENSION_ACCOUNTS_QUERY, {
    enabled: false,
    variables: {
      where: {
        unitId: router.query.id
      },
      limit: limitPage,
      skip: offsetPage
    }
  })

  const [
    requestExtensionAccount,
    {
      loading: loadingCreate,
      data: dataCreate,
      called: calledCreate,
      error: errorCreate
    }
  ] = useMutation(CREATE_EXTENSION_ACCOUNT_QUERY)

  const [
    deleteAccount,
    {
      loading: loadingDelete,
      called: calledDelete,
      data: dataDelete,
      error: errorDelete
    }
  ] = useMutation(DELETE_ACCOUNT_QUERY)

  useEffect(() => {
    if (!loading) {
      if (error) {
        errorHandler(error)
      } else if (data) {
        setUnit(data?.getUnits?.data[0])
        setUnitOwner(data?.getUnits?.data[0]?.unitOwner)
      }
    }
  }, [loading, data, error])

  useEffect(() => {
    if (!loadingResidents) {
      if (errorResidents) {
        errorHandler(errorResidents)
      } else if (dataResidents && unitOwner) {
        const unitOwnerData =
          [unitOwner]?.map(item => {
            const dropdownData = [
              {
                label: 'More Details',
                icon: <FaInfoCircle />,
                function: () => goToResidentData(item?._id)
              },
              {
                label: 'Delete Resident',
                icon: <FiTrash2 />,
                function: () => handleShowModal('delete', item?.user)
              }
            ]

            return {
              name: (
                <div className="flex items-center">
                  <div className={styles.PageContentLogo}>
                    <img
                      alt="logo"
                      src={item?.avatar ?? IMAGES.DEFAULT_AVATAR}
                    />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-neutral-500">
                      {getAccountTypeName(item)}
                    </span>
                    <span>{`${item?.user?.firstName} ${item?.user?.lastName}`}</span>
                  </div>
                </div>
              ),
              button: <Dropdown label={<FaEllipsisH />} items={dropdownData} />
            }
          }) || null
        const residentsData =
          dataResidents?.getExtensionAccountRequests?.data.map(item => {
            const dropdownData = [
              {
                label: 'More Details',
                icon: <FaInfoCircle />,
                function: () => goToResidentData(item?.account?._id)
              },
              {
                label: 'Delete Resident',
                icon: <FiTrash2 />,
                function: () => handleShowModal('delete', item)
              }
            ]

            return {
              name: (
                <div className="flex items-center">
                  <div className={styles.PageContentLogo}>
                    <img
                      alt="logo"
                      src={item?.avatar ?? IMAGES.DEFAULT_AVATAR}
                    />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-neutral-500">
                      {item?.status === 'pending'
                        ? 'Pending registration'
                        : getAccountTypeName(item)}
                    </span>
                    <span>{`${item?.firstName} ${item?.lastName}`}</span>
                  </div>
                </div>
              ),
              button:
                item?.status !== 'pending' && item?.account?._id ? (
                  <Dropdown label={<FaEllipsisH />} items={dropdownData} />
                ) : (
                  ''
                )
            }
          }) || null
        const allResidents = [...unitOwnerData, ...residentsData]

        const tableData = {
          count: dataResidents?.getExtensionAccountRequests.count || 0,
          limit: dataResidents?.getExtensionAccountRequests.limit || 0,
          offset: dataResidents?.getExtensionAccountRequests.skip || 0,
          data: allResidents
        }

        setResidents(tableData)
      }
    }
  }, [loadingResidents, dataResidents, errorResidents, unitOwner])

  useEffect(() => {
    if (!loadingCreate) {
      if (errorCreate) {
        errorHandler(errorCreate)
      }
      if (calledCreate && dataCreate) {
        if (dataCreate?.requestExtensionAccount?.message === 'success') {
          handleClearModal()
          showToast(
            'success',
            'You have successfully requested an extension account.'
          )
          refetchResidents()
        } else {
          showToast('danger', 'Failed to register')
        }
      }
    }
  }, [loadingCreate, calledCreate, dataCreate, errorCreate])

  useEffect(() => {
    if (!loadingDelete) {
      if (errorDelete) {
        errorHandler(errorDelete)
      }
      if (calledDelete && dataDelete) {
        showToast(
          'success',
          'You have successfully removed a resident from this unit.'
        )
        onCancel()
        refetchResidents()
      }
    }
  }, [loadingDelete, calledDelete, dataDelete, errorDelete])

  const goToResidentData = id => {
    router.push(`/residents/view/${id}`)
  }

  const onPageClick = e => {
    setActivePage(e)
    setOffsetPage(limitPage * (e - 1))
  }

  const onLimitChange = e => {
    setLimitPage(Number(e.value))
  }

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

  const handleShowModal = (type, data) => {
    setModalType(type)

    switch (type) {
      case 'create': {
        setModalTitle('Create extension account')
        setModalData(unit)
        break
      }
      case 'delete': {
        setModalTitle('Remove from Unit')
        setModalData(data)
        break
      }
    }
    setShowModal(old => !old)
  }

  const handleClearModal = () => {
    setShowModal(old => !old)
  }

  const onSubmit = async (type, data) => {
    try {
      if (type === 'create') {
        const createData = {
          unitId: router.query.id,
          data: {
            email: data?.email,
            firstName: data?.firstName,
            lastName: data?.lastName,
            relationship: data?.relation,
            type: 'resident'
          }
        }
        await requestExtensionAccount({ variables: createData })
      } else if (type === 'delete') {
        const updateData = {
          data: {
            accountId: data?.id
          }
        }
        await deleteAccount({ variables: updateData })
      }
    } catch (e) {
      console.log(e)
    }
  }

  const onCancel = () => {
    setShowModal(false)
  }

  const tableRowDuesHeader = [
    {
      name: 'Month',
      width: '20%'
    },
    {
      name: 'Seen',
      width: '5%'
    },
    {
      name: 'Category',
      width: '30%'
    },
    {
      name: 'Due Date',
      width: '20%'
    },
    {
      name: '',
      width: '15%'
    }
  ]

  const tableRowHistoryHeader = [
    {
      name: 'Date & Time',
      width: '25%'
    },
    {
      name: 'User',
      width: '15%'
    },
    {
      name: 'Property',
      width: '20%'
    },
    {
      name: 'Activity',
      width: '30%'
    }
  ]

  const relationshipTypes = [
    {
      label: 'Immediate Family',
      value: 'Immediate Family'
    },
    {
      label: 'Housemate',
      value: 'Housemate'
    },
    {
      label: 'Other Relatives',
      value: 'Other Relatives'
    },
    {
      label: 'Tenant',
      value: 'Tenant'
    }
  ]

  return (
    <div className={styles.PageContainer}>
      <div className={styles.PageHeaderContainer}>
        <div className={styles.PageHeaderTitle}>
          <h1 className={styles.PageHeader}>Unit {unit?.name ?? ''}</h1>
        </div>
      </div>

      <Tabs defaultTab={router.query.tab || 'overview'}>
        <Tabs.TabLabels>
          <Tabs.TabLabel id="overview">Overview</Tabs.TabLabel>
          <Tabs.TabLabel id="dues">My Dues</Tabs.TabLabel>
          <Tabs.TabLabel id="history">History</Tabs.TabLabel>
        </Tabs.TabLabels>
        <Tabs.TabPanels>
          <Tabs.TabPanel id="overview">
            <OverviewPage
              type="unit"
              title="Residents"
              propertyData={residents}
              propertyLoading={loadingResidents}
              units={unit}
              unitsLoading={loading}
              activePage={activePage}
              onPageClick={onPageClick}
              onLimitChange={onLimitChange}
              onCreateButtonClick={() => handleShowModal('create')}
            />
          </Tabs.TabPanel>
          <Tabs.TabPanel id="dues">
            <DuesPage unit={unit} header={tableRowDuesHeader} />
          </Tabs.TabPanel>
          <Tabs.TabPanel id="history">
            <HistoryPage type="unit" header={tableRowHistoryHeader} />
          </Tabs.TabPanel>
        </Tabs.TabPanels>
      </Tabs>

      {showModal &&
        (modalType === 'create' ? (
          <CreateModal
            title={modalTitle}
            data={modalData}
            relationshipTypes={relationshipTypes}
            isShown={showModal}
            onSave={e => onSubmit(modalType, e)}
            onCancel={onCancel}
          />
        ) : modalType === 'delete' ? (
          <DeleteModal
            processType={modalType}
            title={modalTitle}
            data={modalData}
            isShown={showModal}
            onSave={e => onSubmit(modalType, e)}
            onCancel={onCancel}
          />
        ) : null)}
    </div>
  )
}

export default UnitDirectoryComponent
