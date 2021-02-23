/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-key */
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { gql, useQuery, useMutation } from '@apollo/client'
import { debounce } from 'lodash'
import P from 'prop-types'
import { FaPlusCircle, FaEllipsisH } from 'react-icons/fa'
import { FiEdit2, FiTrash2, FiFile } from 'react-icons/fi'

import Card from '@app/components/card'
import FormSelect from '@app/components/forms/form-select'
import Button from '@app/components/button'
import Table from '@app/components/table'
import Pagination from '@app/components/pagination'
import Checkbox from '@app/components/forms/form-checkbox'
import Dropdown from '@app/components/dropdown'
import PageLoader from '@app/components/page-loader'

import showToast from '@app/utils/toast'
import { DATE } from '@app/utils'

import SearchControl from '@app/components/globals/SearchControl'
import SelectBulk from '@app/components/globals/SelectBulk'

import InviteModal from './components/inviteModal'
import ReinviteModal from './components/reinviteModal'
import CancelInviteModal from './components/cancelInviteModal'
import BulkUpdateModal from './components/bulkUpdateModal'
import CreateModal from './components/createModal'
import EditModal from './components/editModal'
import DeleteModal from './components/deleteModal'

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
          user {
            _id
            firstName
            lastName
            email
          }
        }
        unitType {
          _id
          name
        }
        unitSize
        residents {
          count
        }
        reservee {
          _id
          email
        }
        company {
          name
        }
        complex {
          name
        }
        building {
          name
        }
      }
    }
  }
`

const GET_FLOORS_QUERY = gql`
  query getFloorNumbers($buildingId: String, $limit: Int, $skip: Int) {
    getFloorNumbers(buildingId: $buildingId, limit: $limit, skip: $skip)
  }
`

const GET_UNIT_TYPES_QUERY = gql`
  query getUnitTypes($where: GetUnitTypesParams, $limit: Int, $skip: Int) {
    getUnitTypes(where: $where, limit: $limit, skip: $skip) {
      count
      limit
      skip
      data {
        _id
        name
      }
    }
  }
`

const INVITE_UNIT_OWNER_QUERY = gql`
  mutation addUnitOwner($data: InputAddUnitOwner) {
    addUnitOwner(data: $data) {
      _id
      processId
      message
    }
  }
`

const REINVITE_UNIT_OWNER_QUERY = gql`
  mutation resendInvite($data: InputResendInvite) {
    resendInvite(data: $data) {
      _id
      processId
      message
    }
  }
`

const CANCEL_UNIT_OWNER_QUERY = gql`
  mutation cancelRegistrationInvite($data: InputCancelRegistrationInvite) {
    cancelRegistrationInvite(data: $data) {
      _id
      processId
      message
    }
  }
`

const CREATE_UNIT_QUERY = gql`
  mutation createUnit(
    $data: InputUnit
    $unitOwnerEmail: String
    $buildingId: String
  ) {
    createUnit(
      data: $data
      unitOwnerEmail: $unitOwnerEmail
      buildingId: $buildingId
    ) {
      _id
      processId
      message
    }
  }
`

const UPDATE_UNIT_QUERY = gql`
  mutation updateUnit($unitId: String, $data: InputUpdateUnit) {
    updateUnit(unitId: $unitId, data: $data) {
      _id
      processId
      message
    }
  }
`

const DELETE_UNIT_QUERY = gql`
  mutation deleteUnit($data: InputDeleteUnit) {
    deleteUnit(data: $data) {
      _id
      processId
      message
    }
  }
`

const _ = require('lodash')

const UnitDirectoryComponent = ({ title, profile }) => {
  const router = useRouter()
  const [units, setUnits] = useState()
  const [unitLists, setUnitLists] = useState()
  const [activePage, setActivePage] = useState(1)
  const [limitPage, setLimitPage] = useState(10)
  const [offsetPage, setOffsetPage] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('create')
  const [modalTitle, setModalTitle] = useState('')
  const [modalData, setModalData] = useState()
  const [searchText, setSearchText] = useState()
  const [floorNumber, setFloorNumber] = useState()
  const [floors, setFloors] = useState([])
  const [unitTypes, setUnitTypes] = useState([])
  const [unitType, setUnitType] = useState()
  const [selectedBulk, setSelectedBulk] = useState()
  const [isBulkDisabled, setIsBulkDisabled] = useState(true)
  const [isBulkButtonDisabled, setIsBulkButtonDisabled] = useState(true)
  const [selectedData, setSelectedData] = useState([])

  const { loading, data, error, refetch } = useQuery(GET_UNITS_QUERY, {
    enabled: false,
    variables: {
      where: {
        status: 'active',
        buildingId: router.query.id,
        floorNumber: floorNumber,
        unitTypeId: unitType,
        search: searchText,
        sortBy: {
          floorNumber: 1,
          name: 1
        }
      },
      limit: limitPage,
      skip: offsetPage
    }
  })

  const {
    loading: loadingFloors,
    data: dataFloors,
    error: errorFloors,
    refetch: refetchFloors
  } = useQuery(GET_FLOORS_QUERY, {
    enabled: false,
    variables: {
      buildingId: router.query.id
    }
  })

  const {
    loading: loadingUnitTypes,
    data: dataUnitTypes,
    error: errorUnitTypes
  } = useQuery(GET_UNIT_TYPES_QUERY, {
    enabled: false,
    variables: {
      where: {
        buildingId: router.query.id,
        isUsed: true
      }
    }
  })

  const [
    inviteUnitOwner,
    {
      loading: loadingInvite,
      called: calledInvite,
      data: dataInvite,
      error: errorInvite
    }
  ] = useMutation(INVITE_UNIT_OWNER_QUERY)

  const [
    reinviteUnitOwner,
    {
      loading: loadingReinvite,
      called: calledReinvite,
      data: dataReinvite,
      error: errorReinvite
    }
  ] = useMutation(REINVITE_UNIT_OWNER_QUERY)

  const [
    cancelUnitOwner,
    {
      loading: loadingCancel,
      called: calledCancel,
      data: dataCancel,
      error: errorCancel
    }
  ] = useMutation(CANCEL_UNIT_OWNER_QUERY)

  const [
    createUnit,
    {
      loading: loadingCreate,
      called: calledCreate,
      data: dataCreate,
      error: errorCreate
    }
  ] = useMutation(CREATE_UNIT_QUERY)

  const [
    updateUnit,
    {
      loading: loadingUpdate,
      called: calledUpdate,
      data: dataUpdate,
      error: errorUpdate
    }
  ] = useMutation(UPDATE_UNIT_QUERY)

  const [
    deleteUnit,
    {
      loading: loadingDelete,
      called: calledDelete,
      data: dataDelete,
      error: errorDelete
    }
  ] = useMutation(DELETE_UNIT_QUERY)

  useEffect(() => {
    router.replace(`/properties/building/${router.query.id}/unit-directory`)
    refetch()
  }, [])

  useEffect(() => {
    if (!loading) {
      if (error) {
        errorHandler(error)
      } else if (data) {
        const units = {
          count: data?.getUnits.count || 0,
          limit: data?.getUnits.limit || 0,
          offset: data?.getUnits.skip || 0,
          data:
            data?.getUnits?.data.map(item => {
              let checkbox
              const dropdownData = [
                {
                  label: 'View Unit',
                  icon: <FiFile />,
                  function: () => alert('clicked')
                },
                {
                  label: 'Edit Unit',
                  icon: <FiEdit2 />,
                  function: () => handleShowModal('edit', item)
                },
                {
                  label: 'Delete Unit',
                  icon: <FiTrash2 />,
                  function: () => handleShowModal('delete', item)
                }
              ]

              if (item?.reservee) {
                checkbox = (
                  <Checkbox
                    primary
                    id={`checkbox-${item._id}`}
                    name="checkbox"
                    data-id={item._id}
                    onChange={onCheck}
                  />
                )
              }

              return {
                checkbox: checkbox,
                floorNo: item?.floorNumber,
                unit: item?.name,
                owner: item?.unitOwner ? (
                  `${item?.unitOwner?.user?.firstName} ${item?.unitOwner?.user?.lastName}`
                ) : item?.reservee ? (
                  <div className="flex flex-col text-neutral-900">
                    <span>{item?.reservee?.email}</span>
                    <span>
                      <span
                        className="text-sm cursor-pointer hover:underline"
                        onClick={() => handleShowModal('reinvite', item)}
                      >
                        Resend invite
                      </span>
                      {` | `}
                      <span
                        className="text-sm cursor-pointer hover:underline"
                        onClick={() => handleShowModal('cancel', item)}
                      >
                        Cancel invite
                      </span>
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col text-neutral-900">
                    <span>No registered resident</span>
                    <span
                      className="text-sm cursor-pointer hover:underline"
                      onClick={() => handleShowModal('invite', item)}
                    >
                      Invite unit owner
                    </span>
                  </div>
                ),

                date: item?.createdAt,
                residents: item?.residents?.count,
                unitType: item?.unitType?.name,
                button: (
                  <Dropdown label={<FaEllipsisH />} items={dropdownData} />
                )
              }
            }) || null
        }

        setUnits(units)
      }
    }
  }, [loading, data, error])

  useEffect(() => {
    if (units) {
      if (units?.data?.length > 0) {
        const groupedData = _.groupBy(units.data, item => item.floorNo || null)
        setUnitLists(
          Object.keys(groupedData).map(key => [
            <tr>
              <td colSpan={7}>
                <strong>{getOrdinalSuffix(key)}</strong>
              </td>
            </tr>,
            ...groupedData[key].map((item, index) => {
              return (
                <tr key={index}>
                  <td>{item.checkbox}</td>
                  <td>{item.unit}</td>
                  <td>{item.owner}</td>
                  <td>{DATE.toFriendlyDate(item.date)}</td>
                  <td>{item.residents}</td>
                  <td>{item.unitType}</td>
                  <td>{item.button}</td>
                </tr>
              )
            })
          ])
        )
      } else {
        setUnitLists([])
      }
    }
  }, [units])

  useEffect(() => {
    if (!loadingFloors) {
      if (errorFloors) {
        errorHandler(errorFloors)
      } else if (dataFloors) {
        const dataLists = dataFloors?.getFloorNumbers?.map((item, index) => {
          return {
            value: item,
            label: item
          }
        })
        setFloors(dataLists)
      }
    }
  }, [loadingFloors, dataFloors, errorFloors])

  useEffect(() => {
    if (!loadingUnitTypes) {
      if (errorUnitTypes) {
        errorHandler(errorUnitTypes)
      } else if (dataUnitTypes) {
        const dataLists = dataUnitTypes?.getUnitTypes?.data?.map(
          (item, index) => {
            return {
              value: item._id,
              label: item.name
            }
          }
        )
        setUnitTypes(dataLists)
      }
    }
  }, [loadingUnitTypes, dataUnitTypes, errorUnitTypes])

  useEffect(() => {
    if (!loadingInvite) {
      if (errorInvite) {
        errorHandler(errorInvite)
      }
      if (calledInvite && dataInvite) {
        showToast('success', 'You have successfully invited a unit owner.')
        onCancel()
        refetch()
        refetchFloors()
      }
    }
  }, [loadingInvite, calledInvite, dataInvite, errorInvite])

  useEffect(() => {
    if (!loadingReinvite) {
      if (errorReinvite) {
        errorHandler(errorReinvite)
      }
      if (calledReinvite && dataReinvite) {
        showToast('success', 'You have successfully reinvited a unit owner.')
        onCancel()
        refetch()

        if (modalType === 'bulk') {
          const allCheck = document.getElementsByName('checkbox_select_all')[0]
          const itemsCheck = document.getElementsByName('checkbox')

          if (allCheck.checked) {
            allCheck.click()
          }

          for (let i = 0; i < itemsCheck.length; i++) {
            if (itemsCheck[i].checked) {
              itemsCheck[i].click()
            }
          }

          setIsBulkDisabled(true)
          setIsBulkButtonDisabled(true)
          setSelectedBulk(null)
        }
      }
    }
  }, [loadingReinvite, calledReinvite, dataReinvite, errorReinvite])

  useEffect(() => {
    if (!loadingCancel) {
      if (errorCancel) {
        errorHandler(errorCancel)
      }
      if (calledCancel && dataCancel) {
        showToast(
          'success',
          'You have successfully cancel invite a unit owner.'
        )
        onCancel()
        refetch()
        refetchFloors()
      }
    }
  }, [loadingCancel, calledCancel, dataCancel, errorCancel])

  useEffect(() => {
    if (!loadingCreate) {
      if (errorCreate) {
        errorHandler(errorCreate)
      }
      if (calledCreate && dataCreate) {
        showToast('success', 'You have successfully created a unit.')
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
        showToast('success', 'You have successfully updated a unit.')
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
        showToast('success', 'You have successfully deleted a unit.')
        onCancel()
        refetch()
      }
    }
  }, [loadingDelete, calledDelete, dataDelete, errorDelete])

  const onPageClick = e => {
    setActivePage(e)
    setOffsetPage(e * limitPage - 10)
  }

  const onLimitChange = e => {
    setLimitPage(Number(e.value))
  }

  const errorHandler = data => {
    const errors = JSON.parse(JSON.stringify(data))

    if (errors) {
      const { graphQLErrors, networkError } = errors
      if (graphQLErrors)
        graphQLErrors.map(({ message, locations, path }) =>
          showToast('danger', message)
        )

      if (networkError) {
        if (networkError?.result?.errors[0]?.code === 4000) {
          showToast('danger', 'Category name already exists')
        } else {
          showToast('danger', errors?.networkError?.result?.errors[0]?.message)
        }
      }
    }
  }

  const handleShowModal = (type, data) => {
    setModalType(type)

    switch (type) {
      case 'invite': {
        setModalTitle('Invite a User')
        setModalData(data)
        break
      }
      case 'reinvite': {
        setModalTitle('Resend Invite to a User')
        setModalData(data)
        break
      }
      case 'cancel': {
        setModalTitle('Cancel Invite to a User')
        setModalData(data)
        break
      }
      case 'bulk': {
        setModalTitle('Bulk Update Units')
        setModalData(selectedData)
        break
      }
      case 'create': {
        setModalTitle('Create a Unit')
        setModalData(profile)
        break
      }
      case 'edit': {
        setModalTitle('Edit a Unit')
        setModalData(data)
        break
      }
      case 'delete': {
        setModalTitle('Delete a Unit')
        setModalData(data)
        break
      }
    }
    setShowModal(old => !old)
  }

  const onSubmit = async (type, data) => {
    try {
      if (type === 'invite') {
        const updateData = {
          data: {
            unitId: data?.id,
            email: data?.email
          }
        }
        await inviteUnitOwner({ variables: updateData })
      } else if (type === 'reinvite') {
        const updateData = {
          data: {
            inviteIds: data?.id
          }
        }
        await reinviteUnitOwner({ variables: updateData })
      } else if (type === 'cancel') {
        const updateData = {
          data: {
            invitationId: data?.id
          }
        }
        await cancelUnitOwner({ variables: updateData })
      } else if (type === 'bulk') {
        const updateData = {
          data: {
            inviteIds: selectedData
          }
        }
        await reinviteUnitOwner({ variables: updateData })
      } else if (type === 'create') {
        const createData = {
          data: {
            name: data?.unitName,
            floorNumber: data?.floorNo,
            unitTypeId: data?.unitType,
            unitSize: data?.unitSize
          },
          unitOwnerEmail: data?.email,
          buildingId: router.query.id
        }
        await createUnit({ variables: createData })
      } else if (type === 'edit') {
        const updateData = {
          unitId: data?.id,
          data: {
            name: data?.unitName,
            floorNumber: data?.floorNo,
            unitTypeId: data?.unitType,
            unitSize: data?.unitSize
          }
        }
        await updateUnit({ variables: updateData })
      } else if (type === 'delete') {
        const updateData = {
          data: {
            unitId: data?.id
          }
        }
        await deleteUnit({ variables: updateData })
      }
    } catch (e) {
      console.log(e)
    }
  }

  const onCancel = () => {
    setShowModal(false)
  }

  const onFloorSelect = e => {
    setFloorNumber(e.value !== '' ? Number(e.value) : null)
    resetPages()
  }

  const onClearFloor = () => {
    setFloorNumber(null)
  }

  const onUnitTypeSelect = e => {
    setUnitType(e.value !== '' ? e.value : null)
    resetPages()
  }

  const onClearUnitType = () => {
    setUnitType(null)
  }

  const resetPages = () => {
    setActivePage(1)
    setOffsetPage(0)
  }

  const onCheckAll = e => {
    const checkboxes = document.getElementsByName('checkbox')

    setSelectedBulk(null)
    setIsBulkDisabled(true)
    setIsBulkButtonDisabled(true)

    for (let i = 0; i < checkboxes.length; i++) {
      const data = checkboxes[i].getAttribute('data-id')
      if (e.target.checked) {
        if (!selectedData.includes(data)) {
          setSelectedData(prevState => [...prevState, data])
        }
        checkboxes[i].checked = true
        setIsBulkDisabled(false)
      } else {
        setSelectedData(prevState => [
          ...prevState.filter(item => item !== data)
        ])
        checkboxes[i].checked = false
      }
    }
  }

  const onCheck = e => {
    const data = e.target.getAttribute('data-id')
    const allCheck = document.getElementsByName('checkbox_select_all')[0]
    const checkboxes = document.querySelectorAll(
      'input[name="checkbox"]:checked'
    )

    if (e.target.checked) {
      if (!selectedData.includes(data)) {
        setSelectedData(prevState => [...prevState, data])
      }
      setIsBulkDisabled(false)
    } else {
      setSelectedData(prevState => [...prevState.filter(item => item !== data)])
      if (checkboxes.length === 0) {
        setSelectedBulk(null)
        setIsBulkDisabled(true)
        setIsBulkButtonDisabled(true)
      }
    }

    if (checkboxes.length === limitPage) {
      allCheck.checked = true
    } else {
      allCheck.checked = false
    }
  }

  const onBulkChange = e => {
    setSelectedBulk(e.value)
    if (e.value !== '') {
      setIsBulkButtonDisabled(false)
    } else {
      setIsBulkButtonDisabled(true)
    }
  }

  const onClearBulk = () => {
    setSelectedBulk(null)
    setIsBulkButtonDisabled(true)
  }

  const bulkOptions = [
    {
      label: 'Resend Invite',
      value: 'reinvite'
    }
  ]

  const tableHeader = [
    {
      name: (
        <Checkbox
          primary
          id="checkbox_select_all"
          name="checkbox_select_all"
          onChange={e => onCheckAll(e)}
        />
      ),
      width: ''
    },
    {
      name: 'Unit #',
      width: '15%'
    },
    {
      name: 'Unit Owner',
      width: '20%'
    },
    {
      name: 'Date Created',
      width: '20%'
    },
    {
      name: '# of Residents',
      width: '15%'
    },
    {
      name: 'Unit Type',
      width: '20%'
    },
    {
      name: '',
      width: ''
    }
  ]

  const onSearch = debounce(e => {
    setSearchText(e.target.value !== '' ? e.target.value : null)
    resetPages()
  }, 1000)

  const onClearSearch = () => {
    setSearchText(null)
  }

  const getOrdinalSuffix = data => {
    const dataNum = parseInt(data)
    const ordinalNum =
      ['st', 'nd', 'rd'][
        (((((dataNum < 0 ? -dataNum : dataNum) + 90) % 100) - 10) % 10) - 1
      ] || 'th'
    return dataNum + ordinalNum + ' Floor'
  }

  return (
    <div className={styles.PageContainer}>
      <div className={styles.PageHeaderSmall}>
        <p>
          <strong>Unit Details</strong>
        </p>
        <p>
          Here you can see all unit details. To manage unit types and sizes,
          visit{' '}
          <a
            className={styles.LinkText}
            href={`/properties/buiilding/${router.query.id}/overview"`}
          >
            Building Profile
          </a>
          .
        </p>
      </div>

      <div className={styles.MainControl}>
        <SelectBulk
          placeholder="Bulk Action"
          options={bulkOptions}
          disabled={isBulkDisabled}
          isButtonDisabled={isBulkButtonDisabled}
          onBulkChange={onBulkChange}
          onBulkSubmit={() => handleShowModal('bulk')}
          onBulkClear={onClearBulk}
          selected={selectedBulk}
        />
        <div className={styles.CategoryControl}>
          <FormSelect
            placeholder="Filter Floor"
            options={floors}
            onChange={onFloorSelect}
            onClear={onClearFloor}
            value={floorNumber}
            isClearable
          />
          <FormSelect
            placeholder="Filter Unit Type"
            options={unitTypes}
            onChange={onUnitTypeSelect}
            onClear={onClearUnitType}
            value={unitType}
            isClearable
          />
          <div className={styles.SearchControl}>
            <SearchControl
              placeholder="Search by title"
              searchText={searchText}
              onSearch={onSearch}
              onClearSearch={onClearSearch}
            />
          </div>
        </div>
      </div>

      <div className={styles.PageSubContainer}>
        <Card
          noPadding
          header={
            <div className={styles.FlexCenterBetween}>
              <span className={styles.CardHeader}>
                {searchText
                  ? `Search result for "${searchText}" (${units?.count || 0})`
                  : `Units (${units?.count || 0})`}
              </span>

              <Button
                default
                leftIcon={<FaPlusCircle />}
                label="Create Unit"
                onClick={() => handleShowModal('create')}
              />
            </div>
          }
          content={
            loading ? (
              <PageLoader />
            ) : (
              unitLists && (
                <Table custom rowNames={tableHeader} customBody={unitLists} />
              )
            )
          }
        />
        {unitLists && (
          <Pagination
            items={units}
            activePage={activePage}
            onPageClick={onPageClick}
            onLimitChange={onLimitChange}
          />
        )}

        {showModal &&
          (modalType === 'invite' ? (
            <InviteModal
              processType={modalType}
              title={modalTitle}
              data={modalData}
              isShown={showModal}
              onSave={e => onSubmit(modalType, e)}
              onCancel={onCancel}
            />
          ) : modalType === 'reinvite' ? (
            <ReinviteModal
              processType={modalType}
              title={modalTitle}
              data={modalData}
              isShown={showModal}
              onSave={e => onSubmit(modalType, e)}
              onCancel={onCancel}
            />
          ) : modalType === 'cancel' ? (
            <CancelInviteModal
              processType={modalType}
              title={modalTitle}
              data={modalData}
              isShown={showModal}
              onSave={e => onSubmit(modalType, e)}
              onCancel={onCancel}
            />
          ) : modalType === 'bulk' ? (
            <BulkUpdateModal
              processType={modalType}
              title={modalTitle}
              data={modalData}
              isShown={showModal}
              onSave={e => onSubmit(modalType, e)}
              onCancel={onCancel}
            />
          ) : modalType === 'create' ? (
            <CreateModal
              processType={modalType}
              title={modalTitle}
              data={modalData}
              unitTypes={unitTypes}
              isShown={showModal}
              onSave={e => onSubmit(modalType, e)}
              onCancel={onCancel}
            />
          ) : modalType === 'edit' ? (
            <EditModal
              processType={modalType}
              title={modalTitle}
              data={modalData}
              unitTypes={unitTypes}
              isShown={showModal}
              onSave={e => onSubmit(modalType, e)}
              onCancel={onCancel}
            />
          ) : modalType === 'delete' ? (
            <DeleteModal
              processType={modalType}
              title={modalTitle}
              data={modalData}
              unitTypes={unitTypes}
              isShown={showModal}
              onSave={e => onSubmit(modalType, e)}
              onCancel={onCancel}
            />
          ) : null)}
      </div>
    </div>
  )
}

UnitDirectoryComponent.propTypes = {
  title: P.string.isRequired,
  profile: P.object
}

export default UnitDirectoryComponent
