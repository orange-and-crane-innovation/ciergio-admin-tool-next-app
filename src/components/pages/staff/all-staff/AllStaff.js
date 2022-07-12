import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { FaEllipsisH, FaPlusCircle } from 'react-icons/fa'
import { FiDownload } from 'react-icons/fi'
import { HiOutlinePrinter } from 'react-icons/hi'

import { useLazyQuery, useMutation, useQuery } from '@apollo/client'
import Button from '@app/components/button'
import Dropdown from '@app/components/dropdown'
import FormSelect from '@app/components/forms/form-select'
import { Card } from '@app/components/globals'
import PrimaryDataTable from '@app/components/globals/PrimaryDataTable'
import SearchComponent from '@app/components/globals/SearchControl'
import { ACCOUNT_TYPES } from '@app/constants'
import { initializeApollo } from '@app/lib/apollo/client'
import Can from '@app/permissions/can'
import errorHandler from '@app/utils/errorHandler'
import getAccountTypeName from '@app/utils/getAccountTypeName'
import showToast from '@app/utils/toast'
import useDebounce from '@app/utils/useDebounce'
import { yupResolver } from '@hookform/resolvers/yup'

import {
  ALL_ROLES,
  BUILDING_ADMIN,
  BUILDING_ROLES,
  COMPANY_ADMIN,
  COMPANY_ROLES,
  COMPLEX_ADMIN,
  COMPLEX_ROLES,
  RECEPTIONIST,
  STAFF_ROLES,
  columns
} from '../constants'
import {
  ADD_BUILDING_ADMIN,
  ADD_COMPANY_ADMIN,
  ADD_COMPLEX_ADMIN,
  ADD_RECEPTIONIST,
  ADD_UNIT_OWNER,
  DELETE_USER,
  GET_ACCOUNTS,
  GET_BUILDING,
  GET_BUILDINGS,
  GET_COMPANIES,
  GET_COMPANY_ROLES,
  GET_COMPLEXES,
  INVITE_STAFF,
  UPDATE_USER
} from '../queries'
import EditStaffModal from './EditStaffModal'
import InviteStaffModal from './InviteStaffModal'
import RemoveStaffModal from './RemoveStaffModal'
import {
  editStaffValidationSchema,
  inviteStaffValidationSchema
} from './schema'

function AllStaff() {
  const router = useRouter()
  const {
    control: inviteControl,
    errors: inviteErrors,
    watch: watchInvite,
    reset: resetInvite,
    getValues: getInviteStaffValues,
    trigger: triggerInviteStaff,
    register: registerInviteStaff
  } = useForm({
    resolver: yupResolver(inviteStaffValidationSchema),
    defaultValues: {
      staffType: null,
      email: '',
      jobTitle: '',
      company: '',
      complex: '',
      building: ''
    }
  })
  const {
    handleSubmit: handleEditSubmit,
    control: editStaffControl,
    errors: editStaffErrors,
    reset: resetEditStaffForm
  } = useForm({
    resolver: yupResolver(editStaffValidationSchema)
  })

  const [searchText, setSearchText] = useState('')
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [selectedRoles, setSelectedRoles] = useState({
    label: ''
  })
  const [selectedAssignment, setSelectedAssignment] = useState(undefined)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState(null)
  const [activePage, setActivePage] = useState(1)
  const [limitPage, setLimitPage] = useState(10)
  const [skipCount, setSkipCount] = useState(0)
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
        accountTypes: selectedRoles?.value ?? ALL_ROLES,
        buildingId: selectedAssignment?.value,
        search: debouncedSearchText
      }
      break
    }
    case ACCOUNT_TYPES.COMPYAD.value: {
      where = {
        accountTypes: selectedRoles?.value ?? COMPANY_ROLES,
        companyId: selectedAssignment?.value ?? companyID,
        search: debouncedSearchText
      }
      break
    }
    case ACCOUNT_TYPES.COMPXAD.value: {
      where = {
        accountTypes: selectedRoles?.value ?? COMPLEX_ROLES,
        complexId: selectedAssignment?.value ?? complexID,
        search: debouncedSearchText
      }
      break
    }
    case ACCOUNT_TYPES.BUIGAD.value: {
      where = {
        accountTypes: selectedRoles?.value ?? BUILDING_ROLES,
        buildingId: selectedAssignment?.value ?? buildingID,
        search: debouncedSearchText
      }
      break
    }
  }

  const {
    data: accounts,
    refetch: refetchAccounts,
    loading: loadingAccounts
  } = useQuery(GET_ACCOUNTS, {
    skip: where === undefined,
    variables: {
      where,
      limit: limitPage,
      skip: skipCount === 0 ? null : skipCount
    }
  })

  const [getCompanies, { data: companies }] = useLazyQuery(GET_COMPANIES)
  const [getComplexes, { data: complexes }] = useLazyQuery(GET_COMPLEXES)
  const [getBuildings, { data: buildings }] = useLazyQuery(GET_BUILDINGS)
  const [getBuilding, { data: building }] = useLazyQuery(GET_BUILDING)
  const [getCompanyRoles, { data: companyRoles }] = useLazyQuery(
    GET_COMPANY_ROLES
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

        getCompanyRoles({
          variables: {
            id: companyID,
            status: 'active'
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

  const handleOnCompleted = () => {
    handleClearModal('create')
    showToast(
      'success',
      `You have successfully sent a new invite. Registration code was sent to the email.`
    )
    refetchAccounts()
  }
  const handleOnError = err => {
    const statusCode = err.networkError.statusCode
    if (statusCode === 409) {
      const email = watchInvite('email')
      showToast(
        'danger',
        `${email} has already been registered in the same role`
      )
    } else {
      showToast('danger', `Unexpected Error. Please try again.`)
    }
  }

  const [addStaff, { loading: addingStaff }] = useMutation(INVITE_STAFF, {
    onCompleted: handleOnCompleted,
    onError: handleOnError
  })

  const [addBuildingAdmin, { loading: addingBuildingAdmin }] = useMutation(
    ADD_BUILDING_ADMIN,
    {
      onCompleted: handleOnCompleted,
      onError: handleOnError
    }
  )
  const [addCompanyAdmin, { loading: addingCompanyAdmin }] = useMutation(
    ADD_COMPANY_ADMIN,
    {
      onCompleted: handleOnCompleted,
      onError: handleOnError
    }
  )
  const [addComplexAdmin, { loading: addingComplexAdmin }] = useMutation(
    ADD_COMPLEX_ADMIN,
    {
      onCompleted: handleOnCompleted,
      onError: handleOnError
    }
  )
  const [addReceptionist, { loading: addingReceptionist }] = useMutation(
    ADD_RECEPTIONIST,
    {
      onCompleted: handleOnCompleted,
      onError: handleOnError
    }
  )
  const [addUnitOwner, { loading: addingUnitOwner }] = useMutation(
    ADD_UNIT_OWNER,
    {
      onCompleted: handleOnCompleted,
      onError: handleOnError
    }
  )

  const [updateUser, { loading: updatingUser }] = useMutation(UPDATE_USER, {
    onCompleted: () => {
      showToast('success', `Update success!`)
      handleClearModal('edit')
      refetchAccounts({
        variables: {
          where: {
            accountTypes:
              selectedRoles?.value === 'all' ? ALL_ROLES : selectedRoles?.value,
            companyId: selectedAssignment?.value,
            search: debouncedSearchText
          },
          limit: limitPage,
          skip: skipCount === 0 ? null : skipCount
        }
      })
    }
  })

  const [deleteUser, { loading: deletingUser }] = useMutation(DELETE_USER, {
    onCompleted: () => {
      const staff = selectedStaff?.user
      const accountType = getAccountTypeName(selectedStaff?.accountType)
      showToast(
        'success',
        `You have successfully remove ${staff.firstName} ${staff.lastName} as ${accountType}`
      )
      handleClearModal('delete')
      refetchAccounts({
        variables: {
          where: {
            accountTypes:
              selectedRoles?.value === 'all' ? ALL_ROLES : selectedRoles?.value,
            companyId: selectedAssignment?.value,
            search: debouncedSearchText
          },
          limit: limitPage,
          skip: skipCount === 0 ? null : skipCount
        }
      })
    },
    onError: e => {
      errorHandler(e)
    }
  })

  const handleShowModal = type => {
    switch (type) {
      case 'create':
        setShowInviteModal(old => !old)
        break
      case 'edit':
        setShowEditModal(old => !old)
        break
      case 'delete':
        setShowDeleteModal(old => !old)
        break
      default:
        console.log(new Error('wrong type!'))
    }
  }

  const handleClearModal = type => {
    if (type === 'edit') {
      resetEditStaffForm({
        staffFirstName: '',
        staffLastName: ''
      })
      handleShowModal(type)
      return
    }

    resetInvite({
      staffType: null,
      email: '',
      jobTitle: '',
      company: null,
      company2: null,
      complex: null,
      building: null
    })

    handleShowModal(type)
  }

  const handleOk = async () => {
    const validate = await triggerInviteStaff()

    // eslint-disable-next-line no-constant-condition
    if (validate || true) {
      const values = getInviteStaffValues()
      console.log(values)
      const {
        staffType: staff,
        email,
        jobTitle,
        company,
        company2,
        complex,
        building
      } = values

      const data = {
        email,
        jobTitle
      }
      switch (staff?.value) {
        case COMPANY_ADMIN:
          addCompanyAdmin({
            variables: {
              data,
              id: company
            }
          })
          break
        case COMPLEX_ADMIN:
          addComplexAdmin({
            variables: {
              data,
              id: complex
            }
          })
          break
        case BUILDING_ADMIN:
          if (building) {
            addBuildingAdmin({
              variables: {
                data,
                id: building
              }
            })
          } else {
            showToast('danger', 'Building is required')
          }

          break
        case RECEPTIONIST:
          addReceptionist({
            variables: {
              data,
              id:
                accountType === ACCOUNT_TYPES.BUIGAD.value
                  ? buildingID
                  : building
            }
          })
          break
        default:
          // console.err(new Error('wrong staff type'))
          addStaff({
            variables: {
              data: staff
                ? { ...data, companyRoleId: staff ? staff.value : '' }
                : { ...data },
              id: company2 || company.value
            }
          })
      }
    } else {
      console.log('validate failed')
    }
  }

  const handleEditOk = values => {
    const { staffFirstName, staffLastName, staffType } = values
    const data = {
      firstName: staffFirstName,
      lastName: staffLastName,

      userAccountId: selectedStaff?._id
    }

    updateUser({
      variables: {
        data,
        companyRole: {
          companyRoleId: staffType.value,
          accountId: selectedStaff?._id
        },
        id: selectedStaff?.user?._id
      }
    })
  }

  const handleDeleteStaff = () => {
    deleteUser({
      variables: {
        data: {
          accountId: selectedStaff?._id
        }
      }
    })
  }

  const assignments = useMemo(() => {
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

  const staffData = useMemo(
    () => ({
      count: accounts?.getAccounts?.count || 0,
      limit: accounts?.getAccounts?.limit || 0,
      offset: accounts?.getAccounts?.offset || 0,
      data:
        accounts?.getAccounts?.data?.length > 0
          ? accounts.getAccounts.data.map(staff => {
              const { user, company, complex, building, accountType } = staff
              const roleType = staff?.companyRole?.name || ''
              let dropdownData = [
                {
                  label: `${
                    profile._id === user?._id ? 'View Profile' : 'View Staff'
                  }`,
                  icon: <span className="ciergio-user" />,
                  function: () => router.push(`/staff/view/${user?._id}`)
                }
              ]

              if (profile._id !== user?._id) {
                dropdownData = [
                  ...dropdownData,
                  {
                    label: 'Edit Staff',
                    icon: <span className="ciergio-edit" />,
                    function: () => {
                      setSelectedStaff(staff)
                      resetEditStaffForm({
                        staffFirstName: user?.firstName,
                        staffLastName: user.lastName
                      })
                      handleShowModal('edit')
                    }
                  }
                ]
              }

              if (accountType !== 'member' && profile._id !== user?._id) {
                dropdownData = [
                  ...dropdownData,
                  {
                    label: 'Remove Staff',
                    icon: <span className="ciergio-trash" />,
                    function: () => {
                      setSelectedStaff(staff)
                      handleShowModal('delete')
                    }
                  }
                ]
              }

              return {
                avatar: (
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
                ),
                name: (
                  <Link href={`/staff/view/${user?._id}`}>
                    <a className="mx-2 hover:underline capitalize font-bold">
                      {`${user?.firstName} ${user?.lastName}`}
                    </a>
                  </Link>
                ),
                role: <span className="capitalize">{roleType}</span>,
                assignment: (
                  <span className="capitalize">
                    {building?.name || complex?.name || company?.name || ''}
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
    [accounts?.getAccounts, router, resetEditStaffForm]
  )

  const sendingInvite =
    addingStaff ||
    addingBuildingAdmin ||
    addingCompanyAdmin ||
    addingComplexAdmin ||
    addingReceptionist ||
    addingUnitOwner

  const removeUser = useMemo(() => {
    return {
      firstName: selectedStaff?.user.firstName,
      lastName: selectedStaff?.user.lastName,
      jobTitle: selectedStaff?.user.jobTitle,
      companyName: selectedStaff?.company.name
    }
  }, [selectedStaff?.user])

  return (
    <section className="content-wrap">
      <h1 className="content-title">Manage Staff</h1>
      <div className="flex items-center justify-end mt-12 mx-4 mb-4 w-full">
        <div className="flex items-left justify-between w-7/12 flex-row">
          <div className="w-full max-w-xs mr-2">
            <h1 className="font-bold text-base">{`Total Members: ${
              accounts?.getAccounts?.count || 0
            }`}</h1>
          </div>
        </div>
        <div className="flex items-center justify-between w-7/12 flex-row">
          <div className="w-full max-w-xs mr-2">
            <FormSelect
              placeholder="Filter Role"
              options={STAFF_ROLES}
              onChange={selectedValue => {
                setSelectedRoles(selectedValue)
                setActivePage(1)
                setLimitPage(10)
                setSkipCount(0)
              }}
              isClearable
              onClear={() => setSelectedRoles(null)}
            />
          </div>
          <div className="w-full max-w-xs mr-2">
            <FormSelect
              placeholder="Filter Assignment"
              options={assignments}
              onChange={selectedValue => {
                setSelectedAssignment(selectedValue)
                setActivePage(1)
                setLimitPage(10)
                setSkipCount(0)
              }}
              isClearable
              onClear={() => setSelectedAssignment(null)}
            />
          </div>
          <div className="w-full relative max-w-xs mr-4">
            <SearchComponent
              placeholder="Search"
              inputClassName="pr-8"
              onSearch={e => setSearchText(e.target.value)}
              searchText={searchText}
              onClearSearch={() => setSearchText('')}
            />
          </div>
        </div>
      </div>
      <Card
        noPadding
        title={<h1 className="font-bold text-base">Members</h1>}
        actions={[
          <Button
            key="print"
            default
            icon={<HiOutlinePrinter />}
            onClick={() => {}}
            disabled
          />,
          <Button
            key="download"
            default
            icon={<FiDownload />}
            onClick={() => {}}
            disabled
          />,
          <Button
            key="create"
            default
            leftIcon={<FaPlusCircle />}
            label="Invite Staff"
            onClick={() => handleShowModal('create')}
          />
        ]}
        content={
          <PrimaryDataTable
            data={staffData}
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
      <InviteStaffModal
        open={showInviteModal}
        loading={sendingInvite}
        onCancel={() => handleClearModal('create')}
        onOk={handleOk}
        companyOptions={assignments}
        form={{
          watch: watchInvite,
          errors: inviteErrors,
          control: inviteControl,
          register: registerInviteStaff
        }}
      />
      {showEditModal && (
        <EditStaffModal
          form={{
            control: editStaffControl,
            errors: editStaffErrors
          }}
          open={showEditModal}
          onCancel={() => handleClearModal('edit')}
          onOk={handleEditSubmit(handleEditOk)}
          loading={updatingUser}
          selectedStaff={selectedStaff}
        />
      )}
      <RemoveStaffModal
        open={showDeleteModal}
        onCancel={() => handleClearModal('delete')}
        onOk={handleDeleteStaff}
        loading={deletingUser}
        user={removeUser}
      />
    </section>
  )
}

export async function getStaticProps() {
  const apolloClient = initializeApollo()

  await apolloClient.query({
    query: GET_ACCOUNTS
  })

  return {
    props: {
      initialApolloState: apolloClient.cache.extract()
    }
  }
}

export default AllStaff
