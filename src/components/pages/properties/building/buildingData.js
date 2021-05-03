/* eslint-disable react/jsx-key */
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { gql, useQuery, useMutation } from '@apollo/client'
import { FaEllipsisH } from 'react-icons/fa'
import { FiEdit2 } from 'react-icons/fi'

import Tabs from '@app/components/tabs'
import Dropdown from '@app/components/dropdown'

import showToast from '@app/utils/toast'
import { IMAGES } from '@app/constants'

import OverviewPage from '../overview'
import HistoryPage from '../history'
import UnitDirectoryPage from '../unit-directory'

import EditModalBuilding from '../components/building/editModal'

import styles from './index.module.css'

const GET_UNITS_QUERY = gql`
  query getUnits($where: GetUnitsParams, $limit: Int, $skip: Int) {
    getUnits(where: $where, limit: $limit, skip: $skip) {
      count
      limit
      skip
      data {
        residents {
          count
        }
      }
    }
  }
`

const GET_UNIT_BREAKDOWN_QUERY = gql`
  query getUnitBreakdown(
    $where: GetUnitBreakdownParams
    $limit: Int
    $skip: Int
  ) {
    getUnitBreakdown(where: $where, limit: $limit, skip: $skip) {
      count
      limit
      skip
      data {
        _id
        name
        sizes {
          size
          quantity
        }
      }
    }
  }
`

const GET_ACCOUNTS_QUERY = gql`
  query getAccounts($where: GetAccountsParams, $limit: Int, $skip: Int) {
    getAccounts(where: $where, limit: $limit, skip: $skip) {
      count
      limit
      skip
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
        complex {
          name
          avatar
          company {
            name
            avatar
          }
        }
      }
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

const BuildingDataComponent = () => {
  const router = useRouter()
  const [buildingProfile, setBuildingProfile] = useState()
  const [units, setUnits] = useState()
  const [residents, setResidents] = useState()
  const [vacants, setVacants] = useState()
  const [unitBreakdown, setUnitBreakdown] = useState()
  const [activePage, setActivePage] = useState(1)
  const [limitPage, setLimitPage] = useState(10)
  const [offsetPage, setOffsetPage] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('create')
  const [modalTitle, setModalTitle] = useState('')
  const [modalData, setModalData] = useState()

  const { loading, data, error } = useQuery(GET_UNIT_BREAKDOWN_QUERY, {
    enabled: false,
    variables: {
      where: {
        buildingId: router.query.id
      },
      limit: limitPage,
      skip: offsetPage
    }
  })

  const {
    loading: loadingUnits,
    data: dataUnits,
    error: errorUnits
  } = useQuery(GET_UNITS_QUERY, {
    enabled: false,
    variables: {
      where: {
        status: 'active',
        buildingId: router.query.id
      },
      limit: limitPage,
      skip: offsetPage
    }
  })

  const {
    loading: loadingResidents,
    data: dataResidents,
    error: errorResidents
  } = useQuery(GET_ACCOUNTS_QUERY, {
    enabled: false,
    variables: {
      where: {
        status: 'active',
        buildingId: router.query.id,
        accountTypes: ['unit_owner', 'resident']
      },
      limit: limitPage,
      skip: offsetPage
    }
  })

  const {
    loading: loadingVacants,
    data: dataVacants,
    error: errorVacants
  } = useQuery(GET_UNITS_QUERY, {
    enabled: false,
    variables: {
      where: {
        vacant: true,
        buildingId: router.query.id
      },
      limit: limitPage,
      skip: offsetPage
    }
  })

  const {
    loading: loadingProfile,
    data: dataProfile,
    error: errorProfile,
    refetch: refetchProfile
  } = useQuery(GET_BUILDINGS_QUERY, {
    enabled: false,
    variables: {
      where: {
        _id: router.query.id
      },
      limit: 1
    }
  })

  const [
    updateBuilding,
    {
      loading: loadingUpdateBuilding,
      called: calledUpdateBuilding,
      data: dataUpdateBuilding,
      error: errorUpdateBuilding
    }
  ] = useMutation(UPDATE_BUILDING_MUTATION)

  useEffect(() => {
    if (!loading) {
      if (error) {
        errorHandler(error)
      } else if (data) {
        const tableData = {
          count: data?.getUnitBreakdown.count || 0,
          limit: data?.getUnitBreakdown.limit || 0,
          offset: data?.getUnitBreakdown.skip || 0,
          data:
            data?.getUnitBreakdown?.data.map(item => {
              return {
                name: item?.name,
                size: item?.sizes?.map(item => (
                  <div>{item.size.toFixed(2)}</div>
                )),
                quantity: item?.sizes?.map(item => <div>{item.quantity}</div>)
              }
            }) || null
        }

        setUnitBreakdown(tableData)
      }
    }
  }, [loading, data, error])

  useEffect(() => {
    if (!loadingUnits) {
      if (errorUnits) {
        errorHandler(errorUnits)
      } else if (dataUnits) {
        const tableData = {
          count: dataUnits?.getUnits.count || 0,
          limit: dataUnits?.getUnits.limit || 0,
          offset: dataUnits?.getUnits.skip || 0
        }

        setUnits(tableData)
      }
    }
  }, [loadingUnits, dataUnits, errorUnits])

  useEffect(() => {
    if (!loadingResidents) {
      if (errorResidents) {
        errorHandler(errorResidents)
      } else if (dataResidents) {
        const tableData = {
          count: dataResidents?.getAccounts.count || 0,
          limit: dataResidents?.getAccounts.limit || 0,
          offset: dataResidents?.getAccounts.skip || 0
        }

        setResidents(tableData)
      }
    }
  }, [loadingResidents, dataResidents, errorResidents])

  useEffect(() => {
    if (!loadingVacants) {
      if (errorVacants) {
        errorHandler(errorVacants)
      } else if (dataVacants) {
        const tableData = {
          count: dataVacants?.getUnits.count || 0,
          limit: dataVacants?.getUnits.limit || 0,
          offset: dataVacants?.getUnits.skip || 0
        }

        setVacants(tableData)
      }
    }
  }, [loadingVacants, dataVacants, errorVacants])

  useEffect(() => {
    if (!loadingUpdateBuilding) {
      if (errorUpdateBuilding) {
        errorHandler(errorUpdateBuilding)
      }
      if (calledUpdateBuilding && dataUpdateBuilding) {
        showToast('success', 'You have successfully updated a building.')
        onCancel()
        refetchProfile()
      }
    }
  }, [
    loadingUpdateBuilding,
    calledUpdateBuilding,
    dataUpdateBuilding,
    errorUpdateBuilding
  ])

  useEffect(() => {
    if (!loadingProfile) {
      if (errorProfile) {
        errorHandler(errorProfile)
      } else if (dataProfile) {
        setBuildingProfile(dataProfile?.getBuildings?.data[0])
      }
    }
  }, [loadingProfile, dataProfile, errorProfile])

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
      case 'edit_building': {
        setModalTitle('Edit Building')
        setModalData(data)
        break
      }
    }
    setShowModal(old => !old)
  }

  const onSubmit = async (type, data) => {
    try {
      if (type === 'edit_building') {
        const updateData = {
          buildingId: router.query.id,
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
      }
    } catch (e) {
      console.log(e)
    }
  }

  const onCancel = () => {
    setShowModal(false)
  }

  const buildingDropdownData = [
    {
      label: 'Edit Building',
      icon: <FiEdit2 />,
      function: () => handleShowModal('edit_building', buildingProfile)
    }
  ]

  const tableRowData = [
    {
      name: 'Unit Type',
      width: '40%'
    },
    {
      name: 'Floor Area (sqm)',
      width: '30%'
    },
    {
      name: 'Quantity',
      width: '30%'
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

  return (
    <div className={styles.PageContainer}>
      <div className={styles.PageHeaderContainer}>
        <div className="flex items-center">
          <div className={styles.PageHeaderLogo}>
            <img
              alt="logo"
              src={
                buildingProfile?.avatar ??
                buildingProfile?.complex?.avatar ??
                buildingProfile?.complex?.company?.avatar ??
                IMAGES.PROPERTY_AVATAR
              }
            />
          </div>

          <div className={styles.PageHeaderTitle}>
            <h1 className={styles.PageHeader}>{buildingProfile?.name ?? ''}</h1>
            <h2 className={styles.PageHeaderSmall}>Building</h2>
          </div>
        </div>

        <div className={styles.PageButton}>
          <Dropdown label={<FaEllipsisH />} items={buildingDropdownData} />
        </div>
      </div>

      <Tabs defaultTab={router.query.tab || 'overview'}>
        <Tabs.TabLabels>
          <Tabs.TabLabel id="overview">Overview</Tabs.TabLabel>
          <Tabs.TabLabel id="unit-directory">Unit Directory</Tabs.TabLabel>
          <Tabs.TabLabel id="history">History</Tabs.TabLabel>
        </Tabs.TabLabels>
        <Tabs.TabPanels>
          <Tabs.TabPanel id="overview">
            <OverviewPage
              type="building"
              title="Unit Breakdown"
              propertyHeader={tableRowData}
              propertyData={unitBreakdown}
              propertyLoading={loading}
              units={units}
              unitsLoading={loadingUnits}
              residents={residents}
              residentsLoading={loadingResidents}
              vacants={vacants}
              vacantsLoading={loadingVacants}
              activePage={activePage}
              onPageClick={onPageClick}
              onLimitChange={onLimitChange}
              onUnitButtonClick={() => alert('History button clicked!')}
            />
          </Tabs.TabPanel>
          <Tabs.TabPanel id="unit-directory">
            <UnitDirectoryPage title="Units" profile={buildingProfile} />
          </Tabs.TabPanel>
          <Tabs.TabPanel id="history">
            <HistoryPage type="building" header={tableRowHistoryData} />
          </Tabs.TabPanel>
        </Tabs.TabPanels>
      </Tabs>

      {showModal &&
        (modalType === 'edit_building' ? (
          <EditModalBuilding
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

export default BuildingDataComponent
