import { debounce } from 'lodash'
import isEmpty from 'lodash/isEmpty'
import { useRouter } from 'next/router'
import Props from 'prop-types'
import React, { useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FaEllipsisH, FaPlusCircle } from 'react-icons/fa'
import { FiDownload } from 'react-icons/fi'
import { HiOutlinePrinter } from 'react-icons/hi'
import ReactSelect from 'react-select'
import FormSelect from '@app/components/forms/form-select'
import * as yup from 'yup'

import { gql, useMutation, useQuery } from '@apollo/client'
import Button from '@app/components/button'
import Dropdown from '@app/components/dropdown'
import Input from '@app/components/forms/form-input'
import { Card } from '@app/components/globals'
import PrimaryDataTable from '@app/components/globals/PrimaryDataTable'
import SearchControl from '@app/components/globals/SearchControl'
import Modal from '@app/components/modal'
import AddResidentModal from '@app/components/pages/residents/components/AddResidentModal'
import { GET_ACCOUNTS } from '@app/components/pages/staff/queries'
import Can from '@app/permissions/can'
import errorHandler from '@app/utils/errorHandler'
import showToast from '@app/utils/toast'
import { yupResolver } from '@hookform/resolvers/yup'

import ViewResidentModal from './../ViewResidentModal'

const SCHEMA = yup.object().shape({
  email: yup
    .string()
    .email('Invalid email format')
    .required('Member Email is required'),
  complexId: yup.object().nullable(true).required('Complex is required')
})

const columns = [
  {
    name: 'Name',
    width: ''
  },
  {
    name: 'Email',
    width: ''
  },
  {
    name: 'Group(s)',
    width: ''
  },
  {
    name: '',
    width: '4%'
  }
]

const GET_COMPANY_GROUPS = gql`
  query($where: getCompanyGroupsParams) {
    getCompanyGroups(where: $where) {
      _id
      name
      status
      companyId
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
          // <FormSelect
          //   styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
          //   menuPortalTarget={document.body}
          //   options={groupOptions}
          //   onChange={onChange}
          //   value={value}
          //   placeholder="Choose group"
          //   valueholder="Group"
          //   isMulti
          //   onClear={() => control?.setValue('groupids', null)}
          // />
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
  okText: 'Invite Member',
  title: 'Invite Member'
}

function MyMembers() {
  const router = useRouter()
  const [searchText, setSearchText] = useState('')
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
        }
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
        groups.getCompanyGroups?.map(g => {
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
    companyId
    // search: debouncedSearchText
  }

  const {
    data: accounts,
    // refetch: refetchAccounts,
    loading: loadingAccounts
  } = useQuery(GET_ACCOUNTS, {
    skip: where === undefined,
    variables: {
      where,
      limit: limitPage,
      skip: skipCount === 0 ? null : skipCount
    }
  })

  const tableListData = useMemo(
    () => ({
      count: accounts?.getAccounts?.count || 0,
      limit: accounts?.getAccounts?.limit || 0,
      offset: accounts?.getAccounts?.offset || 0,
      data:
        accounts?.getAccounts?.data?.length > 0
          ? accounts.getAccounts.data.map(staff => {
              const { user, accountType, companyGroups } = staff
              let dropdownData = [
                {
                  label: `${
                    profile._id === user?._id ? 'View Profile' : 'View Member'
                  }`,
                  icon: <span className="ciergio-user" />,
                  function: () => {
                    const viewItem = {
                      _id: user?._id,
                      full_name: `${user?.firstName} ${user?.lastName}`,
                      first_name: user?.firstName,
                      last_name: user?.lastName,
                      birthday: user?.birthDate,
                      gender: user?.gender,
                      email: user?.email,
                      avatar: user?.avatar,
                      groups: companyGroups
                    }
                    setSelectedMember(viewItem)
                    setViewMember(true)
                  }
                }
              ]

              if (profile._id !== user?._id) {
                dropdownData = [
                  ...dropdownData,
                  {
                    label: 'Edit Member',
                    icon: <span className="ciergio-edit" />,
                    function: () => {
                      setSelectedMember(staff)
                      // resetEditStaffForm({
                      //   staffFirstName: user?.firstName,
                      //   staffLastName: user.lastName
                      // })
                      handleShowModal('edit')
                    }
                  }
                ]
              }

              if (accountType !== 'member' && profile._id !== user?._id) {
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

              return {
                name: (
                  <div className="flex items-center space-x-6">
                    <div className="w-11 h-11 rounded-full overflow-auto">
                      <img
                        className="h-full w-full object-contain object-center"
                        src={
                          user?.avatar ||
                          `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&rounded=true&size=44`
                        }
                        alt="user-avatar"
                      />
                    </div>
                    <span>{`${user?.firstName} ${user?.lastName}`}</span>
                  </div>
                ),
                email: <>{user.email}</>,
                group: (
                  <span className="capitalize">
                    {companyGroups[0] ? companyGroups[0].name : '-'}
                  </span>
                ),
                dropdown: (
                  <Can
                    perform="staff:view::update::delete"
                    yes={
                      <Dropdown label={<FaEllipsisH />} items={dropdownData} />
                    }
                  />
                )
              }
            })
          : []
    }),
    [accounts?.getAccounts, router]
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
              companyGroupIds: groupids
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
        // refetch()
      }

      if (!inviteData && inviteError) {
        const err = inviteError
        errorHandler(err)
      }
    }
  }, [inviteLoading, inviteData, inviteError])

  return (
    <section className="content-wrap">
      <h1 className="content-title">All Members</h1>

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
        <h1 className="font-bold text-base px-8 py-4">{`Registered Members`}</h1>
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
            label="Invite a member"
            onClick={() =>
              setModalState({
                ...defaultModalState,
                visible: true
              })
            }
            className="mr-4 mt-4"
          />
        </div>
      </div>
      <Card
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
          disabled: loadingGroups || loadingComplexes || inviteLoading
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
    </section>
  )
}

InviteModalContent.propTypes = {
  complexOptions: Props.array,
  groupOptions: Props.array,
  control: Props.any,
  errors: Props.object
}

export default MyMembers
