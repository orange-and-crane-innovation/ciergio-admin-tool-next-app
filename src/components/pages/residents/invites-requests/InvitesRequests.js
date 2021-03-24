import React, { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import Button from '@app/components/button'
import PrimaryDataTable from '@app/components/globals/PrimaryDataTable'
import Checkbox from '@app/components/forms/form-checkbox'
import Dropdown from '@app/components/dropdown'
import SelectBulk from '@app/components/globals/SelectBulk'
import { Card } from '@app/components/globals'
import { FaPlusCircle } from 'react-icons/fa'
import { HiOutlinePrinter } from 'react-icons/hi'
import { FiDownload } from 'react-icons/fi'
import { friendlyDateTimeFormat } from '@app/utils/date'
import useDebounce from '@app/utils/useDebounce'
import showToast from '@app/utils/toast'
import { GET_INVITES_AND_REQUESTS, RESEND_INVITE } from '../queries'
import AddResidentModal from '../components/AddResidentModal'
import ResendBulkInviteModal from '../components/ResendBulkInviteModal'
import SearchComponent from '@app/components/globals/SearchControl'

const bulkOptions = [
  {
    label: 'Reinvite',
    value: 'reinvite'
  }
]

function InvitesRequests() {
  const router = useRouter()
  const { buildingId } = router?.query
  const [searchText, setSearchText] = useState('')
  const [showAddResidentModal, setShowAddResidentModal] = useState(false)
  const [isBulkDisabled, setIsBulkDisabled] = useState(true)
  const [isBulkButtonDisabled, setIsBulkButtonDisabled] = useState(true)
  const [selectedBulk, setSelectedBulk] = useState()
  const [selectedData, setSelectedData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [pageLimit, setPageLimit] = useState(10)
  const [pageOffset, setPageOffset] = useState(0)
  const [showResendBulkInviteModal, setShowResendBulkInviteModal] = useState(
    false
  )
  const debouncedText = useDebounce(searchText, 700)
  const { data, loading } = useQuery(GET_INVITES_AND_REQUESTS, {
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
        handleResendBulk()
      }
    }
  )
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
                  function: () => {}
                },
                {
                  label: 'Cancel Invite',
                  icon: <span className="ciergio-trash" />,
                  function: () => {}
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
                    <p className="p-0 text-base">{`${req.firstName} ${req.lastName}`}</p>
                    <p className="text-sm mx-1 text-neutral-500">{req.email}</p>
                  </>
                ),
                accountType: (
                  <span className="capitalize">
                    {req.accountType?.replace('_', ' ')}
                  </span>
                ),
                dateSent: friendlyDateTimeFormat(
                  req.createdAt,
                  'MMMM DD, YYYY'
                ),
                dropdown: (
                  <Dropdown
                    label={<span className="ciergio-more" />}
                    items={dropdownData}
                  />
                )
              }
            })
          : []
    }),
    [data?.getExtensionAccountRequests]
  )

  const handleAddResidentModal = () => setShowAddResidentModal(old => !old)

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

  const onClearBulk = () => {
    setSelectedBulk(null)
    setIsBulkButtonDisabled(true)
  }

  const handleResendBulk = () => {
    setShowResendBulkInviteModal(old => !old)
  }

  return (
    <section className="content-wrap">
      <h1 className="content-title">Residents</h1>

      <div className="flex items-center justify-between mt-12 mx-4 w-full">
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
        <div className="relative mr-4">
          <SearchComponent
            placeholder="Search All"
            onSearch={e => setSearchText(e.target.value)}
            searchText={searchText}
            onClearSearch={() => setSearchText(null)}
          />
        </div>
      </div>

      <div className="flex items-center justify-between bg-white border-t border-l border-r rounded-t">
        <h1 className="font-bold text-base px-8 py-4">{`Pending Invites`}</h1>
        <div className="flex items-center">
          <Button
            default
            icon={<HiOutlinePrinter />}
            onClick={() => {}}
            className="mr-4 mt-4"
          />
          <Button
            default
            icon={<FiDownload />}
            onClick={() => {}}
            className="mr-4 mt-4"
          />
          <Button
            default
            leftIcon={<FaPlusCircle />}
            label="Add Resident"
            onClick={handleAddResidentModal}
            className="mr-4 mt-4"
          />
        </div>
      </div>
      <Card
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
          />
        }
      />
      <AddResidentModal
        showModal={showAddResidentModal}
        onShowModal={handleAddResidentModal}
      />
      <ResendBulkInviteModal
        open={showResendBulkInviteModal}
        onOk={onBulkSubmit}
        onCancel={handleResendBulk}
        bulkInvitesLength={selectedData?.length}
        loading={resendingInvite}
      />
    </section>
  )
}

export default InvitesRequests
