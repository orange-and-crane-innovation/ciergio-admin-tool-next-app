import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { useQuery, useMutation, useLazyQuery } from '@apollo/client'
import useDebounce from '@app/utils/useDebounce'
import isEmpty from 'lodash/isEmpty'
import { FaEllipsisH } from 'react-icons/fa'

import Dropdown from '@app/components/dropdown'
import Checkbox from '@app/components/forms/form-checkbox'
import FormSelect from '@app/components/forms/form-select'

import { Card } from '@app/components/globals'
import SelectBulk from '@app/components/globals/SelectBulk'
import PrimaryDataTable from '@app/components/globals/PrimaryDataTable'
import ResendInviteModal from '@app/components/globals/ResendBulkInvite'
import SearchComponent from '@app/components/globals/SearchControl'

import { friendlyDateTimeFormat } from '@app/utils/date'
import showToast from '@app/utils/toast'
import getAccountTypeName from '@app/utils/getAccountTypeName'

import { ACCOUNT_TYPES } from '@app/constants'

import Empty from '../Empty'
import CancelInviteModal from './CancelInviteModal'

import Can from '@app/permissions/can'

import {
  GET_PENDING_INVITES,
  GET_COMPANIES,
  GET_COMPLEXES,
  GET_BUILDINGS,
  GET_BUILDING,
  CANCEL_INVITE,
  RESEND_INVITE
} from '../queries'

import {
  BUILDING_ADMIN,
  COMPANY_ADMIN,
  COMPLEX_ADMIN,
  RECEPTIONIST,
  UNIT_OWNER,
  STAFF_ROLES,
  ALL_ROLES,
  COMPANY_ROLES,
  COMPLEX_ROLES,
  BUILDING_ROLES
} from '../constants'

const bulkOptions = [
  {
    label: 'Resend Invite',
    value: 'resend-invites'
  }
]

const getAssignment = invite => {
  switch (invite.accountType) {
    case COMPANY_ADMIN:
      return invite.company.name
    case COMPLEX_ADMIN:
      return invite.complex.name
    case BUILDING_ADMIN:
    case RECEPTIONIST:
    case UNIT_OWNER:
    case 'resident':
      return invite.building.name
    default:
      console.log('Error: accountType not found')
  }
}

function PendingInvites() {
  const [searchText, setSearchText] = useState('')
  const [selectedRole, setSelectedRole] = useState(null)
  const [selectedAssignment, setSelectedAssignment] = useState(null)
  const [selectedData, setSelectedData] = useState([])
  const [selectedModule, setSelectedModule] = useState(null)
  const [selectedInvite, setSelectedInvite] = useState(null)
  const [isBulkDisabled, setIsBulkDisabled] = useState(false)
  const [isBulkButtonDisabled, setIsBulkButtonDisabled] = useState(false)
  const [selectedBulk, setSelectedBulk] = useState('')
  const [showCancelInviteModal, setShowCancelInviteModal] = useState(false)
  const [showResendInviteModal, setShowResendInviteModal] = useState(false)
  const [activePage, setActivePage] = useState(1)
  const [limitPage, setLimitPage] = useState(10)
  const [offsetPage, setOffsetPage] = useState(0)
  const debouncedSearchText = useDebounce(searchText, 700)
  const profile = JSON.parse(localStorage.getItem('profile'))
  const accountType = profile?.accounts?.data[0]?.accountType
  const companyID = profile?.accounts?.data[0]?.company?._id
  const complexID = profile?.accounts?.data[0]?.complex?._id
  const buildingID = profile?.accounts?.data[0]?.building?._id
  let where

  switch (accountType) {
    case ACCOUNT_TYPES.SUP.value: {
      where = {
        accountTypes: selectedRole?.value ?? ALL_ROLES,
        buildingId: selectedAssignment?.value,
        search: debouncedSearchText
      }
      break
    }
    case ACCOUNT_TYPES.COMPYAD.value: {
      where = {
        accountTypes: selectedRole?.value ?? COMPANY_ROLES,
        companyId: selectedAssignment?.value ?? companyID,
        search: debouncedSearchText
      }
      break
    }
    case ACCOUNT_TYPES.COMPXAD.value: {
      where = {
        accountTypes: selectedRole?.value ?? COMPLEX_ROLES,
        complexId: selectedAssignment?.value ?? complexID,
        search: debouncedSearchText
      }
      break
    }
    case ACCOUNT_TYPES.BUIGAD.value: {
      where = {
        accountTypes: selectedRole?.value ?? BUILDING_ROLES,
        buildingId: selectedAssignment?.value ?? buildingID,
        search: debouncedSearchText
      }
      break
    }
  }

  const {
    data: invites,
    loading: loadingInvites,
    refetch: refetchInvites
  } = useQuery(GET_PENDING_INVITES, {
    variables: {
      where,
      limit: limitPage,
      offset: offsetPage
    }
  })

  const [getCompanies, { data: companies }] = useLazyQuery(GET_COMPANIES)
  const [getComplexes, { data: complexes }] = useLazyQuery(GET_COMPLEXES)
  const [getBuildings, { data: buildings }] = useLazyQuery(GET_BUILDINGS)
  const [getBuilding, { data: building }] = useLazyQuery(GET_BUILDING)

  const [resendInvite, { loading: resendingInvite }] = useMutation(
    RESEND_INVITE,
    {
      onCompleted: () => {
        showToast('success', 'Invitation has been resent successfully.')
        handleClearModal('resend')
        refetchInvites()
      }
    }
  )
  const [cancelInvite, { loading: cancellingInvite }] = useMutation(
    CANCEL_INVITE,
    {
      onCompleted: () => {
        showToast(
          'success',
          `You have successfully removed ${
            selectedInvite?.email
          } as ${getAccountTypeName(selectedInvite?.accountType)}`
        )
        handleClearModal('cancel')
        refetchInvites()
      }
    }
  )

  useEffect(() => {
    switch (accountType) {
      case ACCOUNT_TYPES.SUP.value: {
        getCompanies()
        break
      }
      case ACCOUNT_TYPES.COMPYAD.value: {
        getComplexes({
          variables: {
            id: companyID
          }
        })
        break
      }
      case ACCOUNT_TYPES.COMPXAD.value: {
        getBuildings({
          variables: {
            id: complexID
          }
        })
        break
      }
      case ACCOUNT_TYPES.BUIGAD.value: {
        getBuilding({
          variables: {
            id: buildingID
          }
        })
        break
      }
    }
  }, [])

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

  const onCheckAll = useCallback(
    e => {
      const checkboxes = document.getElementsByName('checkbox')

      setSelectedBulk('')
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
    },
    [selectedData]
  )

  const onBulkSubmit = () => {
    resendInvite({
      variables: {
        data: {
          inviteIds: selectedData
        }
      }
    })
  }

  const onClearBulk = () => {
    setSelectedBulk(null)
  }

  const onBulkChange = value => {
    setSelectedBulk(value.value)
    if (!isEmpty(value)) {
      setIsBulkButtonDisabled(false)
    } else {
      setIsBulkButtonDisabled(true)
    }
  }

  const handleCancelInvite = () => {
    cancelInvite({
      variables: {
        data: {
          invitationId: selectedData[0]
        }
      }
    })
  }

  const handleClearModal = type => {
    switch (type) {
      case 'resend':
        setShowResendInviteModal(old => !old)
        break
      case 'cancel':
        setShowCancelInviteModal(old => !old)
        break
      default:
        console.log('Error: wrong type!')
    }
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
        name: 'Invites',
        width: ''
      },
      {
        name: 'Account Type',
        width: ''
      },
      {
        name: 'Assignment',
        width: ''
      },
      {
        name: 'Date Sent',
        width: ''
      },
      {
        name: '',
        width: ''
      }
    ],
    [onCheckAll]
  )

  const staffData = useMemo(() => {
    return {
      count: invites?.getPendingRegistration?.count || 0,
      limit: invites?.getPendingRegistration?.limit || 0,
      data:
        invites?.getPendingRegistration?.data?.length > 0
          ? invites.getPendingRegistration.data.map(invite => {
              const roleType = getAccountTypeName(invite?.accountType)
              const dropdownData = [
                {
                  label: 'Resend Invite',
                  icon: <span className="ciergio-mail" />,
                  function: () => {
                    setSelectedInvite(invite)
                    setSelectedData([invite?._id])
                    setShowResendInviteModal(old => !old)
                    setSelectedModule('staff')
                  }
                },
                {
                  label: 'Cancel Invite',
                  icon: <span className="ciergio-trash" />,
                  function: () => {
                    setSelectedInvite(invite)
                    setSelectedData([invite?._id])
                    setShowCancelInviteModal(old => !old)
                  }
                }
              ]

              return {
                checkbox: (
                  <Checkbox
                    primary
                    id={`checkbox-${invite._id}`}
                    name="checkbox"
                    data-id={invite._id}
                    onChange={onCheck}
                  />
                ),
                invites: invite.email,
                accountType: <span className="capitalize">{roleType}</span>,
                assignment: getAssignment(invite),
                createdAt: friendlyDateTimeFormat(invite.createdAt, 'LL'),
                dropdown: (
                  <Can
                    perform="staff:resend::cancel"
                    yes={
                      <Dropdown label={<FaEllipsisH />} items={dropdownData} />
                    }
                  />
                )
              }
            })
          : []
    }
  }, [invites?.getPendingRegistration, onCheck])

  const filterOptions = useMemo(() => {
    switch (accountType) {
      case ACCOUNT_TYPES.SUP.value: {
        if (companies?.getCompanies?.data?.length > 0) {
          const options = companies.getCompanies.data.map(company => ({
            label: company.name,
            value: company._id
          }))

          return options
        }
        break
      }
      case ACCOUNT_TYPES.COMPYAD.value: {
        if (complexes?.getComplexes?.data?.length > 0) {
          const options = complexes.getComplexes.data.map(complex => ({
            label: complex.name,
            value: complex._id
          }))

          return options
        }
        break
      }
      case ACCOUNT_TYPES.COMPXAD.value: {
        if (buildings?.getBuildings?.data?.length > 0) {
          const options = buildings.getBuildings.data.map(building => ({
            label: building.name,
            value: building._id
          }))

          return options
        }
        break
      }
      default: {
        if (building?.getBuildings?.data?.length > 0) {
          const options = building.getBuildings.data.map(building => ({
            label: building.name,
            value: building._id
          }))

          return options
        }
        break
      }
    }

    return []
  }, [
    companies?.getCompanies,
    complexes?.getComplexes,
    buildings?.getBuildings,
    building?.getBuildings
  ])

  return (
    <section className="content-wrap">
      <h1 className="content-title">Pending Staff Invites</h1>
      <div className="flex items-center justify-between mt-6 flex-col md:flex-row">
        <SelectBulk
          placeholder="Bulk Action"
          options={bulkOptions}
          disabled={isBulkDisabled}
          isButtonDisabled={isBulkButtonDisabled}
          onBulkChange={onBulkChange}
          onBulkSubmit={() => {
            setShowResendInviteModal(old => !old)
            setSelectedModule(null)
          }}
          onBulkClear={onClearBulk}
          selected={selectedBulk}
        />
        <div className="flex items-center justify-between w-8/12">
          <div className="w-full mr-2 relative">
            <FormSelect
              placeholder="Filter Role"
              options={STAFF_ROLES}
              onChange={selectedValue => {
                setSelectedRole(selectedValue)
                setActivePage(1)
                setLimitPage(10)
                setOffsetPage(0)
              }}
              isClearable
              onClear={() => setSelectedRole(null)}
            />
          </div>
          <div className="w-full mr-2 relative">
            <FormSelect
              placeholder="Filter Assignment"
              options={filterOptions}
              onChange={selectedValue => {
                setSelectedAssignment(selectedValue)
                setActivePage(1)
                setLimitPage(10)
                setOffsetPage(0)
              }}
              isClearable
              onClear={() => setSelectedAssignment(null)}
            />
          </div>
          <div className="w-full relative">
            <SearchComponent
              placeholder="Search"
              searchText={searchText}
              onClearSearch={() => setSearchText('')}
              onSearch={e => setSearchText(e.target.value)}
            />
          </div>
        </div>
      </div>
      <Card
        noPadding
        title={
          <h1 className="font-bold text-base px-8 py-4">{`Pending Invites (${
            invites?.getPendingRegistration?.count || 0
          })`}</h1>
        }
        content={
          <PrimaryDataTable
            columns={columns}
            data={staffData}
            loading={loadingInvites}
            currentPage={activePage}
            setCurrentPage={setActivePage}
            setPageOffset={setOffsetPage}
            pageLimit={limitPage}
            setPageLimit={setLimitPage}
            emptyText={<Empty />}
          />
        }
      />
      <ResendInviteModal
        onCancel={() => handleClearModal('resend')}
        onOk={onBulkSubmit}
        open={showResendInviteModal}
        data={selectedInvite}
        loading={resendingInvite}
        module={selectedModule}
        bulkInvitesLength={selectedData?.length}
      />
      <CancelInviteModal
        onCancel={() => handleClearModal('cancel')}
        onOk={handleCancelInvite}
        data={selectedInvite}
        open={showCancelInviteModal}
        loading={cancellingInvite}
      />
    </section>
  )
}

export default PendingInvites
