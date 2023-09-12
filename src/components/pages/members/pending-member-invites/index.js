import * as yup from 'yup'

import { Controller, useForm } from 'react-hook-form'
import { FaPlusCircle } from 'react-icons/fa'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { gql, useMutation, useQuery } from '@apollo/client'

import AddResidentModal from '@app/components/pages/residents/components/AddResidentModal'
import { PendingMemberInvitesPrintView } from '@app/components/print'
import { BiLoaderAlt } from 'react-icons/bi'
import Button from '@app/components/button'
import Can from '@app/permissions/can'
import { Card } from '@app/components/globals'
import Dropdown from '@app/components/dropdown'
import FormSelect from '@app/components/forms/form-select'
import { GET_PENDING_INVITES } from '@app/components/pages/staff/queries'
import { HiOutlinePrinter } from 'react-icons/hi'
import Input from '@app/components/forms/form-input'
import Modal from '@app/components/modal'
import PrimaryDataTable from '@app/components/globals/PrimaryDataTable'
import Props from 'prop-types'
import ReactSelect from 'react-select'
import SearchControl from '@app/components/globals/SearchControl'
import ViewResidentModal from './../ViewResidentModal'
import { debounce } from 'lodash'
import errorHandler from '@app/utils/errorHandler'
import { friendlyDateTimeFormat } from '@app/utils/date'
import isEmpty from 'lodash/isEmpty'
import { DATE } from '@app/utils'
import showToast from '@app/utils/toast'
import useDebounce from '@app/utils/useDebounce'
import { useReactToPrint } from 'react-to-print'
import { useRouter } from 'next/router'
import { yupResolver } from '@hookform/resolvers/yup'
import DownloadCSV from '@app/components/globals/DownloadCSV'

const SCHEMA = yup.object().shape({
  email: yup
    .string()
    .email('Invalid email format')
    .required('Member Email is required'),
  complexId: yup.object().nullable(true).required('Complex is required')
})

const columns = [
  {
    name: 'Email',
    width: ''
  },
  {
    name: 'Group(s)',
    width: ''
  },
  {
    name: 'Date Sent',
    width: ''
  },
  {
    name: '',
    width: '4%'
  }
]

const GET_COMPANY_GROUPS = gql`
  query($where: getCompanyGroupsParams, $skip: Int, $limit: Int) {
    getCompanyGroups(where: $where, skip: $skip, limit: $limit) {
      data {
        _id
        name
        status
        companyId
      }
      limit
      skip
      count
    }
  }
`

const GET_COMPLEXES_QUERY = gql`
  query getComplexes($where: GetComplexesParams, $limit: Int, $skip: Int) {
    getComplexes(where: $where, limit: $limit, skip: $skip) {
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

const INVITE_MEMBER = gql`
  mutation inviteMember($data: InputInviteMember, $companyId: String) {
    inviteMember(data: $data, companyId: $companyId) {
      _id
      message
    }
  }
`

const InviteModalContent = ({
  control,
  errors,
  selected,
  groupOptions,
  complexOptions
}) => {
  return (
    <>
      <Controller
        control={control}
        name="email"
        render={field => {
          return (
            <Input
              {...field}
              label="Member Email"
              error={errors?.email?.message ?? null}
              placeholder="Enter email address"
              description={
                <p className="mb-2">An invite will be sent to this email.</p>
              }
            />
          )
        }}
      />

      <br />

      <p className="font-bold text-base mb-2">Group (Optional)</p>
      <p className="mb-2">
        Assigning members to groups allows them to be chosen as an audience in
        Bulletin Board and they will be included in dedicated group chats.
      </p>
      <Controller
        control={control}
        name="groupids"
        render={({ name, onChange, value }) => (
          <ReactSelect
            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
            menuPortalTarget={document.body}
            options={groupOptions}
            onChange={onChange}
            value={value}
            placeholder="Choose group"
            isMulti
          />
        )}
      />

      <br />

      <p className="font-bold text-base mb-2">Complex</p>
      <p className="mb-2">The user will be tag to this complex</p>
      <Controller
        control={control}
        name="complexId"
        render={({ name, onChange, value }) => (
          <FormSelect
            error={errors?.complexId?.message ?? null}
            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
            menuPortalTarget={document.body}
            options={complexOptions}
            onChange={onChange}
            value={value}
            placeholder="Choose a complex"
            isClearable
            onClear={() => {
              console.log('control', control)
              control?.setValue('complexId', null)
            }}
          />
        )}
      />
    </>
  )
}

const defaultModalState = {
  type: 'invite',
  visible: false,
  okText: 'Invite a Member',
  title: 'Invite a Member'
}

function PendingMemberInvites() {
  const router = useRouter()
  const [searchText, setSearchText] = useState('')
  const debouncedSearchText = useDebounce(searchText, 700)
  const [modalState, setModalState] = useState(defaultModalState)

  const [showModal, setShowModal] = useState(false)
  const [viewMember, setViewMember] = useState(false)
  const [selectedMember, setSelectedMember] = useState(null)
  const [selectedStaff, setSelectedStaff] = useState(null)
  const [groupOptions, setGroupOptions] = useState()
  const [complexOptions, setComplexOptions] = useState()

  const [activePage, setActivePage] = useState(1)
  const [limitPage, setLimitPage] = useState(10)
  const [skipCount, setSkipCount] = useState(0)

  const user = JSON.parse(localStorage.getItem('profile'))
  const profile = JSON.parse(localStorage.getItem('profile'))
  const companyId = user?.accounts?.data[0]?.company?._id

  const { loading: loadingGroups, data: groups, error: errorGroups } = useQuery(
    GET_COMPANY_GROUPS,
    {
      enabled: false,
      variables: {
        where: {
          companyId: companyId,
          status: 'active'
        },
        limit: 1000,
        skip: 0
      }
    }
  )

  const {
    loading: loadingComplexes,
    data: complexes,
    error: errorComplexes
  } = useQuery(GET_COMPLEXES_QUERY, {
    enabled: false,
    variables: {
      where: {
        companyId: companyId,
        status: 'active'
      },
      limit: 500,
      skip: 0
    }
  })

  useEffect(() => {
    if (groups && groups.getCompanyGroups)
      setGroupOptions(
        groups.getCompanyGroups?.data?.map(g => {
          return { label: g.name, value: g._id }
        })
      )
  }, [groups])

  useEffect(() => {
    if (complexes && complexes.getComplexes)
      setComplexOptions(
        complexes.getComplexes?.data?.map(c => {
          return { label: c.name, value: c._id }
        })
      )
  }, [complexes])

  const closeModal = () => {
    setModalState({
      ...modalState,
      visible: false
    })
  }

  const { control, errors } = useForm({
    resolver: yupResolver(SCHEMA)
  })

  const handleShowModal = () => setShowModal(old => !old)

  const handleViewMember = () => setViewMember(old => !old)

  const onSearch = debounce(e => {
    setSearchText(e.target.value !== '' ? e.target.value : null)
  }, 1000)

  const onClearSearch = () => {
    setSearchText(null)
  }

  const where = {
    accountTypes: 'member',
    companyId,
    search: debouncedSearchText
  }

  const {
    data: accounts,
    refetch: refetchAccounts,
    loading: loadingAccounts
  } = useQuery(GET_PENDING_INVITES, {
    skip: where === undefined,
    variables: {
      where,
      limit: limitPage,
      skip: skipCount === 0 ? null : skipCount
    }
  })

  const PRINT_DOWNLOAD_TITLE = 'Pending Invites - Member'

  const printRef = useRef()
  const [loadingPrint, setLoadingPrint] = useState(false)
  const [csvData] = useState([
    [PRINT_DOWNLOAD_TITLE],
    ['As of', DATE.toFriendlyDate(new Date())],
    [''],
    ['#', 'Email', 'Group(s)', 'Date sent']
  ])

  const tableListData = useMemo(
    () => ({
      count: accounts?.getPendingRegistration?.count || 0,
      limit: accounts?.getPendingRegistration?.limit || 0,
      offset: accounts?.getPendingRegistration?.offset || 0,
      data:
        accounts?.getPendingRegistration?.data?.length > 0
          ? accounts.getPendingRegistration.data.map((staff, i) => {
              const { _id, accountType, companyGroups, email } = staff
              let dropdownData = []

              if (profile._id !== _id) {
                dropdownData = [
                  ...dropdownData,
                  {
                    label: 'Edit Member',
                    icon: <span className="ciergio-edit" />,
                    function: () => {
                      setSelectedMember(staff)
                      handleShowModal('edit')
                    }
                  }
                ]
              }

              if (accountType !== 'member' && profile._id !== _id) {
                dropdownData = [
                  ...dropdownData,
                  {
                    label: 'Remove Member',
                    icon: <span className="ciergio-trash" />,
                    function: () => {
                      setSelectedStaff(staff)
                      handleShowModal('delete')
                    }
                  }
                ]
              }
              const group = companyGroups[0] ? companyGroups[0].name : '-'

              csvData.push([
                i + 1,
                email,
                group,
                friendlyDateTimeFormat(staff.createdAt, 'LL')
              ])

              return {
                email: <>{email}</>,
                group: <span className="capitalize">{group}</span>,
                datesent: <>{friendlyDateTimeFormat(staff.createdAt, 'LL')}</>,
                dropdown: (
                  // <Can
                  //   perform="staff:view::update::delete"
                  //   yes={
                  //     <Dropdown label={<FaEllipsisH />} items={dropdownData} />
                  //   }
                  // />
                  <></>
                )
              }
            })
          : []
    }),
    [accounts?.getPendingRegistration, router]
  )

  const [
    inviteMember,
    { loading: inviteLoading, data: inviteData, error: inviteError }
  ] = useMutation(INVITE_MEMBER)

  const onSubmit = val => {
    if (!isEmpty(val)) {
      if (modalState.type === 'invite') {
        let groupids = null
        if (val?.groupids) groupids = val?.groupids.map(g => g.value)

        inviteMember({
          variables: {
            companyId: companyId,
            data: {
              email: val?.email,
              complexId: val?.complexId?.value,
              companyGroupIds: groupids,
              accountType: 'member'
            }
          }
        })
      }
    }
  }

  useEffect(() => {
    if (!inviteLoading) {
      if (inviteData && !inviteError) {
        showToast('success', `Successfully invite a member`)
        closeModal()
        refetchAccounts()
      }

      if (!inviteData && inviteError) {
        const err = inviteError
        errorHandler(err)
      }
    }
  }, [inviteLoading, inviteData, inviteError])

  const onPrintPreview = useReactToPrint({
    documentTitle: PRINT_DOWNLOAD_TITLE,
    content: () => printRef.current,
    onBeforeGetContent: () => {
      setLoadingPrint(true)
    },
    onAfterPrint: () => {
      setLoadingPrint(false)
    },
    removeAfterPrint: true
  })

  return (
    <section className="content-wrap">
      <h1 className="content-title">{PRINT_DOWNLOAD_TITLE}</h1>

      <div className="flex items-center justify-end mt-12 w-full">
        <div className="flex items-center justify-between w-8/12 flex-row flex-row-reverse">
          <SearchControl
            placeholder="Search"
            searchText={searchText}
            onSearch={onSearch}
            onClearSearch={onClearSearch}
          />
        </div>
      </div>

      <div className="flex items-center justify-between bg-white border-t border-l border-r rounded-t">
        <h1 className="font-bold text-base px-8 py-4">
          {PRINT_DOWNLOAD_TITLE} ({tableListData.count})
        </h1>
        <div className="flex items-center">
          <Button
            default
            icon={
              loadingPrint ? (
                <BiLoaderAlt className="animate-spin text-4xl text-gray-500" />
              ) : (
                <HiOutlinePrinter />
              )
            }
            onClick={onPrintPreview}
            className="mr-4 mt-4"
            disabled={
              loadingAccounts || tableListData.count === 0 || loadingPrint
            }
          />
          <DownloadCSV
            data={csvData}
            title={PRINT_DOWNLOAD_TITLE}
            fileName={`${DATE.getCurrentDate()} - ${PRINT_DOWNLOAD_TITLE}`}
            disabled={loadingAccounts || tableListData.count === 0}
            className="mr-4 mt-4"
            noBottomMargin={false}
          />
          <Button
            default
            leftIcon={<FaPlusCircle />}
            label="Invite a member"
            onClick={() =>
              setModalState({
                ...defaultModalState,
                visible: true
              })
            }
            className="mr-4 mt-4"
            disabled={loadingAccounts || tableListData.count === 0}
          />
        </div>
      </div>

      <Card
        className="border-t-none"
        content={
          <PrimaryDataTable
            data={tableListData}
            columns={columns}
            loading={loadingAccounts}
            currentPage={activePage}
            pageLimit={limitPage}
            setCurrentPage={setActivePage}
            setPageOffset={setSkipCount}
            setPageLimit={setLimitPage}
          />
        }
      />

      <Modal
        title={modalState.title}
        onClose={closeModal}
        okText={modalState.okText}
        okButtonProps={{
          danger: modalState.type === 'delete',
          disabled: loadingGroups || inviteLoading
        }}
        visible={modalState.visible}
        onOk={async () => {
          await control.trigger()
          if (isEmpty(errors)) {
            onSubmit(control.getValues())
          }
        }}
        onCancel={closeModal}
      >
        {modalState.visible && (
          <>
            {/* {(modalState.type === 'add' || modalState.type === 'edit') && ( */}
            {modalState.type === 'invite' && (
              <InviteModalContent
                control={control}
                errors={errors}
                // selected={selectedGroup}
                groupOptions={groupOptions}
                complexOptions={complexOptions}
              />
            )}

            {/* {modalState.type === 'delete' && (
              <DeleteModalContent selected={selectedGroup} control={control} />
            )} */}
          </>
        )}
      </Modal>

      <AddResidentModal showModal={showModal} onShowModal={handleShowModal} />

      <ViewResidentModal
        showModal={viewMember}
        onShowModal={handleViewMember}
        resident={selectedMember}
      />

      <div className="hidden">
        <PendingMemberInvitesPrintView
          ref={printRef}
          title={PRINT_DOWNLOAD_TITLE}
          data={tableListData?.data}
        />
      </div>
    </section>
  )
}

InviteModalContent.propTypes = {
  complexOptions: Props.array,
  groupOptions: Props.array,
  control: Props.any,
  errors: Props.object
}

export default PendingMemberInvites
