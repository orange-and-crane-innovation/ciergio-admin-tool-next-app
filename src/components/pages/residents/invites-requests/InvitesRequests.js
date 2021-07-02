import React, { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import { FaEllipsisH } from 'react-icons/fa'

import Checkbox from '@app/components/forms/form-checkbox'
import Dropdown from '@app/components/dropdown'
import Card from '@app/components/card'
import SelectBulk from '@app/components/globals/SelectBulk'
import PrimaryDataTable from '@app/components/globals/PrimaryDataTable'
import NotifCard from '@app/components/globals/NotifCard'

import { toFriendlyShortDate } from '@app/utils/date'
import useDebounce from '@app/utils/useDebounce'
import showToast from '@app/utils/toast'
import errorHandler from '@app/utils/errorHandler'
import getAccountTypeName from '@app/utils/getAccountTypeName'

import {
  GET_BUILDINGS_QUERY,
  GET_INVITES_AND_REQUESTS,
  RESEND_INVITE,
  CANCEL_INVITE
} from '../queries'
import ResendBulkInviteModal from '@app/components/globals/ResendBulkInvite'
import SearchComponent from '@app/components/globals/SearchControl'
import CancelInviteModal from '../components/CancelInviteModal'

const bulkOptions = [
  {
    label: 'Resend Invite',
    value: 'reinvite'
  }
]

function InvitesRequests() {
  const router = useRouter()
  const { buildingId } = router?.query
  const [buildingName, setBuildingName] = useState()
  const [searchText, setSearchText] = useState('')
  const [isBulkDisabled, setIsBulkDisabled] = useState(true)
  const [isBulkButtonDisabled, setIsBulkButtonDisabled] = useState(true)
  const [selectedBulk, setSelectedBulk] = useState()
  const [selectedData, setSelectedData] = useState([])
  const [selectedInvite, setSelectedInvite] = useState()
  const [selectedInviteId, setSelectedInviteId] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageLimit, setPageLimit] = useState(10)
  const [pageOffset, setPageOffset] = useState(0)
  const [showResendBulkInviteModal, setShowResendBulkInviteModal] =
    useState(false)
  const [showCancelInviteModal, setShowCancelInviteModal] = useState(false)
  const debouncedText = useDebounce(searchText, 700)

  const {
    loading: loadingBuildings,
    data: dataBuildings,
    error: errorBuildings
  } = useQuery(GET_BUILDINGS_QUERY, {
    enabled: false,
    variables: {
      where: {
        _id: buildingId
      }
    }
  })

  const { data, loading, refetch } = useQuery(GET_INVITES_AND_REQUESTS, {
    variables: {
      limit: pageLimit,
      skip: pageOffset,
      where: {
        buildingId,
        pendingInvites: true,
        search: debouncedText ?? null
      }
    }
  })

  const [resendInvite, { loading: resendingInvite }] = useMutation(
    RESEND_INVITE,
    {
      onCompleted: () => {
        showToast('success', 'Invite has been resent.')
        if (showResendBulkInviteModal) {
          handleResendBulk()
        }
      },
      onError: e => {
        errorHandler(e)
      }
    }
  )

  const [cancelInvite, { loading: cancellingInvite }] = useMutation(
    CANCEL_INVITE,
    {
      onCompleted: () => {
        showToast('success', 'Invite has been cancelled.')
        handleCancelInviteModal()
        refetch({
          variables: {
            limit: pageLimit,
            skip: pageOffset,
            where: {
              buildingId,
              pendingInvites: true,
              search: debouncedText ?? null
            }
          }
        })
      },
      onError: e => {
        errorHandler(e)
      }
    }
  )

  useEffect(() => {
    if (!loadingBuildings && dataBuildings) {
      setBuildingName(dataBuildings?.getBuildings?.data[0]?.name)
    }
  }, [loadingBuildings, dataBuildings, errorBuildings])

  const columns = React.useMemo(
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
        name: 'Unit #',
        width: ''
      },
      {
        name: 'Invite',
        width: ''
      },
      {
        name: 'Account Type',
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
    []
  )

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

    if (checkboxes.length === pageLimit) {
      allCheck.checked = true
    } else {
      allCheck.checked = false
    }
  }

  const residentsData = React.useMemo(
    () => ({
      count: data?.getExtensionAccountRequests?.count || 0,
      limit: data?.getExtensionAccountRequests?.limit || pageLimit,
      offset: data?.getExtensionAccountRequests?.skip || 0,
      data:
        data?.getExtensionAccountRequests?.count > 0
          ? data.getExtensionAccountRequests.data.map(req => {
              const dropdownData = [
                {
                  label: 'Resend Invite',
                  icon: <span className="ciergio-mail" />,
                  function: () => {
                    resendInvite({
                      variables: {
                        data: {
                          inviteIds: [req?._id]
                        }
                      }
                    })
                  }
                },
                {
                  label: 'Cancel Invite',
                  icon: <span className="ciergio-trash" />,
                  function: () => {
                    setSelectedInviteId(req._id)
                    setSelectedInvite(req)
                    handleCancelInviteModal()
                  }
                }
              ]
              return {
                checkbox: (
                  <Checkbox
                    primary
                    id={`checkbox-${req._id}`}
                    name="checkbox"
                    data-id={req._id}
                    onChange={onCheck}
                  />
                ),
                unitNumber: req.unit.name,
                invite: (
                  <>
                    <div className="text-base">{`${req.firstName} ${req.lastName}`}</div>
                    <div className="text-sm text-neutral-500">{req.email}</div>
                  </>
                ),
                accountType: getAccountTypeName(req.accountType),
                dateSent: toFriendlyShortDate(req.createdAt),
                dropdown: (
                  <Dropdown label={<FaEllipsisH />} items={dropdownData} />
                )
              }
            })
          : []
    }),
    [data?.getExtensionAccountRequests]
  )

  const handleCancelInviteModal = () => setShowCancelInviteModal(old => !old)

  const onBulkChange = e => {
    setSelectedBulk(e.value)
    if (e.value !== '') {
      setIsBulkButtonDisabled(false)
    } else {
      setIsBulkButtonDisabled(true)
    }
  }

  const onBulkSubmit = () => {
    resendInvite({
      variables: {
        data: {
          inviteIds: selectedData
        }
      }
    })
  }

  const onCancelInviteSubmit = () => {
    cancelInvite({
      variables: {
        data: {
          requestId: selectedInviteId
        }
      }
    })
  }

  const onClearBulk = () => {
    setSelectedBulk(null)
    setIsBulkButtonDisabled(true)
  }

  const handleResendBulk = () => {
    setShowResendBulkInviteModal(old => !old)
  }

  return (
    <section className="content-wrap">
      <h1 className="content-title">
        {buildingName ? `${buildingName} Resident List` : null}
      </h1>

      <div className="flex items-center justify-between mt-12 w-full">
        <SelectBulk
          placeholder="Bulk Action"
          options={bulkOptions}
          disabled={isBulkDisabled}
          isButtonDisabled={isBulkButtonDisabled}
          onBulkChange={onBulkChange}
          onBulkSubmit={handleResendBulk}
          onBulkClear={onClearBulk}
          selected={selectedBulk}
        />
        <div className="relative">
          <SearchComponent
            placeholder="Search All"
            onSearch={e => setSearchText(e.target.value)}
            searchText={searchText}
            onClearSearch={() => setSearchText(null)}
          />
        </div>
      </div>

      <Card
        noPadding
        header={
          <div className="flex items-center justify-between py-2">
            <h1 className="font-bold text-lg">Pending Invites</h1>
          </div>
        }
        content={
          <PrimaryDataTable
            columns={columns}
            data={residentsData}
            loading={loading}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            setPageOffset={setPageOffset}
            pageLimit={pageLimit}
            setPageLimit={setPageLimit}
            emptyText={
              <NotifCard
                icon={<i className="ciergio-user" />}
                header="No pending invites"
                content="Sorry, this building don't have any pending invites yet."
              />
            }
          />
        }
      />
      <ResendBulkInviteModal
        open={showResendBulkInviteModal}
        onOk={onBulkSubmit}
        onCancel={handleResendBulk}
        bulkInvitesLength={selectedData?.length}
        loading={resendingInvite}
      />
      <CancelInviteModal
        open={showCancelInviteModal}
        onOk={onCancelInviteSubmit}
        onCancel={handleCancelInviteModal}
        data={selectedInvite}
        loading={cancellingInvite}
      />
    </section>
  )
}

export default InvitesRequests
