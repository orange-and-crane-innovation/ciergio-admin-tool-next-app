import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import isEmpty from 'lodash/isEmpty'
import SelectBulk from '@app/components/globals/SelectBulk'
import Dropdown from '@app/components/dropdown'
import Checkbox from '@app/components/forms/form-checkbox'
import SelectDropdown from '@app/components/select'
import { Card } from '@app/components/globals'
import PrimaryDataTable from '@app/components/globals/PrimaryDataTable'
import Empty from '../Empty'
import CancelInviteModal from './CancelInviteModal'
import ResendInviteModal from './ResendInviteModal'
import { AiOutlineEllipsis } from 'react-icons/ai'
import { friendlyDateTimeFormat } from '@app/utils/date'
import showToast from '@app/utils/toast'
import useDebounce from '@app/utils/useDebounce'

import {
  GET_PENDING_INVITES,
  GET_COMPANIES,
  BULK_UPDATE_MUTATION,
  CANCEL_INVITE,
  RESEND_INVITE
} from '../queries'

import {
  BUILDING_ADMIN,
  COMPANY_ADMIN,
  COMPLEX_ADMIN,
  RECEPTIONIST,
  UNIT_OWNER
} from '../constants'
import SearchComponent from '@app/components/globals/SearchControl'

const roles = [
  {
    label: 'Company Admin',
    value: COMPANY_ADMIN
  },
  {
    label: 'Complex Admin',
    value: COMPLEX_ADMIN
  },
  {
    label: 'Building Administrator',
    value: BUILDING_ADMIN
  },
  {
    label: 'Unit Owner',
    value: UNIT_OWNER
  },
  {
    label: 'Receptionist',
    value: RECEPTIONIST
  }
]

const ALL_ROLES = [
  BUILDING_ADMIN,
  COMPANY_ADMIN,
  COMPLEX_ADMIN,
  RECEPTIONIST,
  UNIT_OWNER
]

const bulkOptions = [
  {
    label: 'Unpublished',
    value: 'unpublish'
  },
  {
    label: 'Move to Trash',
    value: 'trash'
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
  const [isBulkDisabled, setIsBulkDisabled] = useState(false)
  const [isBulkButtonDisabled, setIsBulkButtonDisabled] = useState(false)
  const [selectedBulk, setSelectedBulk] = useState('')
  const [showCancelInviteModal, setShowCancelInviteModal] = useState(false)
  const [showResendInviteModal, setShowResendInviteModal] = useState(false)
  const [activePage, setActivePage] = useState(1)
  const [limitPage, setLimitPage] = useState(10)
  const [offsetPage, setOffsetPage] = useState(0)

  const debouncedSearchText = useDebounce(searchText, 700)

  const {
    data: invites,
    loading: loadingInvites,
    refetch: refetchInvites
  } = useQuery(GET_PENDING_INVITES, {
    variables: {
      accountTypes:
        selectedRole?.value === 'all' ? ALL_ROLES : selectedRole?.value,
      companyId: selectedAssignment?.value,
      search: debouncedSearchText,
      limit: limitPage,
      offset: offsetPage
    }
  })
  const { data: companies } = useQuery(GET_COMPANIES)

  const [bulkUpdate, { called: calledBulk, data: dataBulk }] = useMutation(
    BULK_UPDATE_MUTATION
  )

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
        showToast('success', 'Invitation has been cancelled.')
        handleClearModal('cancel')
        refetchInvites()
      }
    }
  )

  useEffect(() => {
    if (calledBulk && dataBulk) {
      if (dataBulk?.bulkUpdatePost?.message === 'success') {
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
        setSelectedBulk('')

        showToast('success', `You have successfully updated a contact`)
        refetchInvites()
      } else {
        showToast('danger', `Bulk update failed`)
      }
    }
  }, [calledBulk, dataBulk, refetchInvites])

  const onCheck = useCallback(
    e => {
      const data = e.target.getAttribute('data-id')
      const checkboxes = document.querySelectorAll(
        'input[name="checkbox"]:checked'
      )

      if (e.target.checked) {
        if (!selectedData.includes(data)) {
          setSelectedData(prevState => [...prevState, data])
        }
        setIsBulkDisabled(false)
      } else {
        setSelectedData(prevState => [
          ...prevState.filter(item => item !== data)
        ])
        if (checkboxes.length === 0) {
          setSelectedBulk('')
          setIsBulkDisabled(true)
          setIsBulkButtonDisabled(true)
        }
      }
    },
    [selectedData]
  )

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
    const data = { id: selectedData, status: selectedBulk }
    bulkUpdate({ variables: data })
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
          invitationId: selectedData?._id
        }
      }
    })
  }
  const handleResendInvite = () => {
    resendInvite({
      variables: {
        data: {
          inviteIds: [selectedData?._id]
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
              const dropdownData = [
                {
                  label: 'Resend Invite',
                  icon: <span className="ciergio-edit" />,
                  function: () => {
                    setSelectedData(invite)
                    setShowResendInviteModal(old => !old)
                  }
                },
                {
                  label: 'Delete Invite',
                  icon: <span className="ciergio-trash" />,
                  function: () => {
                    setSelectedData(invite)
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
                accountType: (
                  <span className="capitalize">
                    {invite.accountType.replace('_', ' ')}
                  </span>
                ),
                assignment: getAssignment(invite),
                createdAt: friendlyDateTimeFormat(invite.createdAt, 'LL'),
                dropdown: (
                  <Dropdown
                    label={<AiOutlineEllipsis />}
                    items={dropdownData}
                  />
                )
              }
            })
          : []
    }
  }, [invites?.getPendingRegistration, onCheck])

  const filterOptions = useMemo(() => {
    if (companies?.getCompanies?.data?.length > 0) {
      const options = companies.getCompanies.data.map(company => ({
        label: company.name,
        value: company._id
      }))

      return options
    }

    return []
  }, [companies?.getCompanies])

  return (
    <section className="content-wrap">
      <h1 className="content-title">Pending Staff Invites</h1>
      <div className="flex items-center justify-between mt-6 flex-col md:flex-row">
        <SelectBulk
          placeholder="Select"
          options={bulkOptions}
          disabled={isBulkDisabled}
          isButtonDisabled={isBulkButtonDisabled}
          onBulkChange={onBulkChange}
          onBulkSubmit={onBulkSubmit}
          onBulkClear={onClearBulk}
          selected={selectedBulk}
        />
        <div className="flex items-center justify-between w-8/12">
          <div className="w-full mr-2 relative -top-2">
            <SelectDropdown
              placeholder="Filter Role"
              options={roles}
              onChange={selectedValue => {
                setSelectedRole(selectedValue)
                setActivePage(1)
                setLimitPage(10)
                setOffsetPage(0)
              }}
            />
          </div>
          <div className="w-full mr-2 relative -top-2">
            <SelectDropdown
              placeholder="Filter Assignment"
              options={filterOptions}
              onChange={selectedValue => {
                setSelectedAssignment(selectedValue)
                setActivePage(1)
                setLimitPage(10)
                setOffsetPage(0)
              }}
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
      <div className="flex items-center justify-between bg-white border-t border-l border-r rounded-t">
        <h1 className="font-bold text-base px-8 py-4">{`Pending Invites (${
          invites?.getPendingRegistration?.count || 0
        })`}</h1>
      </div>
      <Card
        noPadding
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
        onOk={handleResendInvite}
        data={selectedData}
        open={showResendInviteModal}
        loading={resendingInvite}
      />
      <CancelInviteModal
        onCancel={() => handleClearModal('cancel')}
        onOk={handleCancelInvite}
        data={selectedData}
        open={showCancelInviteModal}
        loading={cancellingInvite}
      />
    </section>
  )
}

export default PendingInvites
