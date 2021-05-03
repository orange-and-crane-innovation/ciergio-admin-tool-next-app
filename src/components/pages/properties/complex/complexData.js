/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-key */
import React, { useState, useEffect } from 'react'
import { gql, useQuery, useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import { FaEllipsisH, FaInfoCircle } from 'react-icons/fa'
import { FiEdit2, FiTrash2 } from 'react-icons/fi'

import Tabs from '@app/components/tabs'
import Dropdown from '@app/components/dropdown'

import showToast from '@app/utils/toast'
import { DATE } from '@app/utils'
import { HISTORY_MESSAGES, IMAGES } from '@app/constants'

import OverviewPage from '../overview'
import AboutPage from '../about'
import HistoryPage from '../history'

import CreateModal from '../components/building/createModal'
import EditModal from '../components/building/editModal'
import DeleteModal from '../components/building/deleteModal'
import EditModalComplex from '../components/complex/editModal'

import styles from './index.module.css'

const GET_COMPLEXES_QUERY = gql`
  query getComplexes($where: GetComplexesParams, $limit: Int, $skip: Int) {
    getComplexes(where: $where, limit: $limit, skip: $skip) {
      count
      limit
      skip
      data {
        _id
        name
        avatar
        address {
          formattedAddress
          city
        }
        complexAdministrators(limit: 1) {
          data {
            user {
              _id
              firstName
              lastName
              email
            }
          }
        }
        company {
          name
          avatar
        }
        buildings {
          count
        }
        history(limit: 10) {
          count
          limit
          skip
          data {
            date
            action
            data
            author {
              user {
                firstName
                lastName
              }
            }
            building {
              _id
              name
            }
            company {
              _id
              name
            }
            complex {
              _id
              name
            }
          }
        }
      }
    }
  }
`

const GET_BUILDINGS_QUERY = gql`
  query getBuildings($where: GetBuildingsParams, $limit: Int, $skip: Int) {
    getBuildings(where: $where, limit: $limit, skip: $skip) {
      count
      limit
      skip
      data {
        _id
        name
        avatar
        address {
          formattedAddress
          city
        }
        buildingAdministrators(limit: 1) {
          data {
            user {
              _id
              firstName
              lastName
              email
            }
          }
        }
        residents {
          count
        }
      }
    }
  }
`

const CREATE_BUILDING_MUTATION = gql`
  mutation createBuilding(
    $data: InputBuilding
    $admin: InputAdmin
    $complexId: String
  ) {
    createBuilding(data: $data, admin: $admin, complexId: $complexId) {
      _id
      processId
      message
    }
  }
`

const UPDATE_BUILDING_MUTATION = gql`
  mutation updateBuilding($data: InputUpdateBuilding, $buildingId: String) {
    updateBuilding(data: $data, buildingId: $buildingId) {
      _id
      processId
      message
    }
  }
`

const DELETE_BUILDING_MUTATION = gql`
  mutation deleteBuilding($data: InputDeleteBuilding) {
    deleteBuilding(data: $data) {
      _id
      processId
      message
    }
  }
`

const UPDATE_COMPLEX_MUTATION = gql`
  mutation updateComplex($data: InputUpdateComplex, $complexId: String) {
    updateComplex(data: $data, complexId: $complexId) {
      _id
      processId
      message
    }
  }
`

const ComplexDataComponent = () => {
  const router = useRouter()
  const [buildings, setBuildings] = useState()
  const [complexProfile, setComplexProfile] = useState()
  const [complexHistory, setComplexHistory] = useState()
  const [activePage, setActivePage] = useState(1)
  const [limitPage, setLimitPage] = useState(10)
  const [offsetPage, setOffsetPage] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('create')
  const [modalTitle, setModalTitle] = useState('')
  const [modalData, setModalData] = useState()

  const goToHistoryData = () => {
    document.getElementById('history').click()
  }

  const {
    loading: loadingProfile,
    data: dataProfile,
    error: errorProfile,
    refetch: refetchProfile
  } = useQuery(GET_COMPLEXES_QUERY, {
    enabled: false,
    variables: {
      where: {
        _id: router.query.id
      },
      limit: 1
    }
  })

  const { loading, data, error, refetch } = useQuery(GET_BUILDINGS_QUERY, {
    enabled: false,
    variables: {
      where: {
        status: 'active',
        complexId: router.query.id
      },
      limit: limitPage,
      skip: offsetPage
    }
  })

  const [
    createBuilding,
    {
      loading: loadingCreate,
      called: calledCreate,
      data: dataCreate,
      error: errorCreate
    }
  ] = useMutation(CREATE_BUILDING_MUTATION)

  const [
    updateBuilding,
    {
      loading: loadingUpdate,
      called: calledUpdate,
      data: dataUpdate,
      error: errorUpdate
    }
  ] = useMutation(UPDATE_BUILDING_MUTATION)

  const [
    deleteBuilding,
    {
      loading: loadingDelete,
      called: calledDelete,
      data: dataDelete,
      error: errorDelete
    }
  ] = useMutation(DELETE_BUILDING_MUTATION)

  const [
    updateComplex,
    {
      loading: loadingUpdateComplex,
      called: calledUpdateComplex,
      data: dataUpdateComplex,
      error: errorUpdateComplex
    }
  ] = useMutation(UPDATE_COMPLEX_MUTATION)

  useEffect(() => {
    refetchProfile()
    refetch()
  }, [])

  useEffect(() => {
    if (!loadingProfile) {
      if (errorProfile) {
        errorHandler(errorProfile)
      } else if (dataProfile) {
        const tableData = {
          count: dataProfile?.getComplexes.count || 0,
          limit: dataProfile?.getComplexes.limit || 0,
          offset: dataProfile?.getComplexes.skip || 0,
          data:
            dataProfile?.getComplexes?.data[0]?.history?.data?.map(item => {
              const activity = JSON.parse(item.data)
              const author =
                item?.author && item?.author?.user
                  ? `${item?.author?.user?.firstName} ${item?.author?.user?.lastName}`
                  : 'Unknown User'

              return {
                date: DATE.toFriendlyDateTime(item?.date),
                user: author,
                property: item?.complex?.name ?? item?.company?.name,
                activity:
                  (HISTORY_MESSAGES[item.action] &&
                    HISTORY_MESSAGES[item.action](activity)) ||
                  'No activity'
              }
            }) || null
        }

        setComplexProfile(dataProfile?.getComplexes?.data[0])
        setComplexHistory(tableData)
      }
    }
  }, [loadingProfile, dataProfile, errorProfile])

  useEffect(() => {
    if (!loading) {
      if (error) {
        errorHandler(error)
      } else if (data) {
        const tableData = {
          count: data?.getBuildings.count || 0,
          limit: data?.getBuildings.limit || 0,
          offset: data?.getBuildings.skip || 0,
          data:
            data?.getBuildings?.data.map(item => {
              const dropdownData = [
                {
                  label: 'Edit Building',
                  icon: <FiEdit2 />,
                  function: () => handleShowModal('edit', item)
                },
                {
                  label: 'Delete Building',
                  icon: <FiTrash2 />,
                  function: () => handleShowModal('delete', item)
                },
                {
                  label: 'More Details',
                  icon: <FaInfoCircle />,
                  function: () => goToBuildingData(item?._id)
                }
              ]

              return {
                name: (
                  <span
                    className={styles.ContentLink}
                    onClick={() => goToBuildingData(item?._id)}
                  >
                    {item?.name}
                  </span>
                ),
                buildingNo: item?.residents?.count,
                contact: item?.buildingAdministrators?.data[0] ? (
                  <div className="flex flex-col items-start">
                    <span>{`${item?.buildingAdministrators?.data[0]?.user?.firstName} ${item?.buildingAdministrators?.data[0]?.user?.lastName}`}</span>
                    <span className="text-neutral-500 text-sm">
                      {item?.buildingAdministrators?.data[0]?.user?.email}
                    </span>
                  </div>
                ) : (
                  'Not available'
                ),
                button: (
                  <Dropdown label={<FaEllipsisH />} items={dropdownData} />
                )
              }
            }) || null
        }

        setBuildings(tableData)
      }
    }
  }, [loading, data, error])

  useEffect(() => {
    if (!loadingCreate) {
      if (errorCreate) {
        errorHandler(errorCreate)
      }
      if (calledCreate && dataCreate) {
        showToast('success', 'You have successfully created a building.')
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
        showToast('success', 'You have successfully updated a building.')
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
        showToast('success', 'You have successfully deleted a building.')
        onCancel()
        refetch()
      }
    }
  }, [loadingDelete, calledDelete, dataDelete, errorDelete])

  useEffect(() => {
    if (!loadingUpdateComplex) {
      if (errorUpdateComplex) {
        errorHandler(errorUpdateComplex)
      }
      if (calledUpdateComplex && dataUpdateComplex) {
        showToast('success', 'You have successfully updated a complex.')
        onCancel()
        refetchProfile()
      }
    }
  }, [
    loadingUpdateComplex,
    calledUpdateComplex,
    dataUpdateComplex,
    errorUpdateComplex
  ])

  const goToBuildingData = id => {
    router.push(`/properties/building/${id}/overview`)
  }

  const complexDropdownData = [
    {
      label: 'Edit Complex',
      icon: <FiEdit2 />,
      function: () => handleShowModal('edit_complex', complexProfile)
    }
  ]

  const tableRowData = [
    {
      name: 'Building Name',
      width: '40%'
    },
    {
      name: 'Residents',
      width: '15%'
    },
    {
      name: 'Point of Contact',
      width: ''
    },
    {
      name: '',
      width: ''
    }
  ]

  const tableRowHistoryData = [
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

  const onSubmit = async (type, data) => {
    try {
      if (type === 'create') {
        const createData = {
          complexId: router.query.id,
          data: {
            name: data?.name,
            address: {
              formattedAddress: data?.address?.formattedAddress,
              city: data?.address?.city
            }
          },
          admin: {
            email: data?.email,
            jobTitle: data?.jobtitle
          }
        }
        await createBuilding({ variables: createData })
      } else if (type === 'edit') {
        const updateData = {
          buildingId: data?.id,
          data: {
            name: data.name,
            avatar: data?.logo[0],
            address: {
              formattedAddress: data?.address?.formattedAddress,
              city: data?.address?.city
            }
          }
        }
        await updateBuilding({ variables: updateData })
      } else if (type === 'delete') {
        const deleteData = {
          data: {
            buildingId: data?._id
          }
        }
        await deleteBuilding({ variables: deleteData })
      } else if (type === 'edit_complex') {
        const updateData = {
          complexId: router.query.id,
          data: {
            name: data.name,
            avatar: data?.logo[0],
            address: {
              formattedAddress: data?.address?.formattedAddress,
              city: data?.address?.city
            }
          }
        }
        await updateComplex({ variables: updateData })
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
        setModalTitle('Add Building')
        setModalData(null)
        break
      }
      case 'edit': {
        setModalTitle('Edit Building')
        setModalData(data)
        break
      }
      case 'delete': {
        setModalTitle('Delete Building')
        setModalData(data)
        break
      }
      case 'edit_complex': {
        setModalTitle('Edit Complex')
        setModalData(data)
        break
      }
    }
    setShowModal(old => !old)
  }

  return (
    <div className={styles.PageContainer}>
      <div className={styles.PageHeaderContainer}>
        <div className="flex items-center">
          <div className={styles.PageHeaderLogo}>
            <img
              alt="logo"
              src={
                complexProfile?.avatar ??
                complexProfile?.company?.avatar ??
                IMAGES.PROPERTY_AVATAR
              }
            />
          </div>

          <div className={styles.PageHeaderTitle}>
            <h1 className={styles.PageHeader}>{complexProfile?.name ?? ''}</h1>
            <h2 className={styles.PageHeaderSmall}>Complex</h2>
          </div>
        </div>

        <div className={styles.PageButton}>
          <Dropdown label={<FaEllipsisH />} items={complexDropdownData} />
        </div>
      </div>

      <Tabs defaultTab={router.query.tab || 'overview'}>
        <Tabs.TabLabels>
          <Tabs.TabLabel id="overview">Overview</Tabs.TabLabel>
          <Tabs.TabLabel id="about">About</Tabs.TabLabel>
          <Tabs.TabLabel id="history">History</Tabs.TabLabel>
        </Tabs.TabLabels>
        <Tabs.TabPanels>
          <Tabs.TabPanel id="overview">
            <OverviewPage
              type="complex"
              title="Buildings"
              propertyHeader={tableRowData}
              propertyData={buildings}
              propertyLoading={loading}
              historyHeader={tableRowHistoryData}
              historyData={complexHistory}
              historyLoading={loading}
              activePage={activePage}
              onPageClick={onPageClick}
              onLimitChange={onLimitChange}
              onCreateButtonClick={() => handleShowModal('create')}
              onHistoryButtonClick={() => goToHistoryData()}
            />
          </Tabs.TabPanel>
          <Tabs.TabPanel id="about">
            <AboutPage
              type="complex"
              address={complexProfile?.address?.formattedAddress ?? ''}
              tinNo={complexProfile?.tinNumber ?? ''}
              email={complexProfile?.email ?? ''}
              contactNo={complexProfile?.contactNumber ?? ''}
              approvedBy={`${
                complexProfile?.complexAdministrators?.data[0]?.user
                  ?.firstName ?? ''
              } ${
                complexProfile?.complexAdministrators?.data[0]?.user
                  ?.lastName ?? ''
              }`}
              onButtonClick={() =>
                handleShowModal('edit_complex', complexProfile)
              }
            />
          </Tabs.TabPanel>
          <Tabs.TabPanel id="history">
            <HistoryPage type="complex" header={tableRowHistoryData} />
          </Tabs.TabPanel>
        </Tabs.TabPanels>
      </Tabs>

      {showModal &&
        (modalType === 'create' ? (
          <CreateModal
            processType={modalType}
            title={modalTitle}
            data={modalData}
            isShown={showModal}
            onSave={e => onSubmit(modalType, e)}
            onCancel={onCancel}
          />
        ) : modalType === 'edit' ? (
          <EditModal
            processType={modalType}
            title={modalTitle}
            data={modalData}
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
            onSave={() => onSubmit(modalType, modalData)}
            onCancel={onCancel}
          />
        ) : modalType === 'edit_complex' ? (
          <EditModalComplex
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

export default ComplexDataComponent
