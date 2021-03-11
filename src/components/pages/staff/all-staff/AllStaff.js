import React, { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useMutation, useQuery, useLazyQuery } from '@apollo/client'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'

import { Card } from '@app/components/globals'
import Button from '@app/components/button'
import Modal from '@app/components/modal'
import Dropdown from '@app/components/dropdown'
import SelectDropdown from '@app/components/select'
import PrimaryDataTable from '@app/components/globals/PrimaryDataTable'
import SearchComponent from '@app/components/globals/SearchControl'
import InviteStaffContent from './InviteStaffContent'
import EditStaffContent from './EditStaffContent'
import RemoveStaffContent from './RemoveStaffContent'
import { FaPlusCircle } from 'react-icons/fa'
import { HiOutlinePrinter } from 'react-icons/hi'
import { FiDownload } from 'react-icons/fi'
import { AiOutlineEllipsis } from 'react-icons/ai'
import useDebounce from '@app/utils/useDebounce'
import showToast from '@app/utils/toast'
import Can from '@app/permissions/can'
import { initializeApollo } from '@app/lib/apollo/client'
import {
  ADD_BUILDING_ADMIN,
  ADD_COMPANY_ADMIN,
  ADD_COMPLEX_ADMIN,
  ADD_RECEPTIONIST,
  ADD_UNIT_OWNER,
  GET_ACCOUNTS,
  GET_BUILDINGS,
  GET_COMPANIES,
  GET_COMPLEXES,
  UPDATE_USER,
  DELETE_USER
} from '../queries'
import {
  BUILDING_ADMIN,
  COMPANY_ADMIN,
  COMPLEX_ADMIN,
  RECEPTIONIST,
  UNIT_OWNER,
  columns,
  roles,
  ALL_ROLES
} from '../constants'
import {
  editStaffValidationSchema,
  inviteStaffValidationSchema
} from './schema'

function AllStaff() {
  const router = useRouter()
  const {
    handleSubmit: handleInviteStaffSubmit,
    control: inviteStaffControl,
    errors: inviteStaffErrors,
    watch: watchInviteStaffForm,
    reset: resetInviteStaffForm
  } = useForm({
    resolver: yupResolver(inviteStaffValidationSchema),
    defaultValues: {
      staffType: '',
      email: '',
      jobTitle: '',
      company: ''
    }
  })

  const {
    handleSubmit: handleEditStaffSubmit,
    control: editStaffControl,
    errors: editStaffErrors,
    reset: resetEditStaffForm
  } = useForm({
    resolver: yupResolver(editStaffValidationSchema)
  })

  const staffType = watchInviteStaffForm('staffType')?.value
  const companyId = watchInviteStaffForm('company')?.value
  const complexId = watchInviteStaffForm('complex')?.value

  const isComplexAccount = staffType === COMPLEX_ADMIN
  const isBuildingAccount =
    staffType === UNIT_OWNER ||
    staffType === BUILDING_ADMIN ||
    staffType === RECEPTIONIST

  const [searchText, setSearchText] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedRoles, setSelectedRoles] = useState(undefined)
  const [selectedAssignment, setSelectedAssignment] = useState(undefined)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState(null)
  const [activePage, setActivePage] = useState(1)
  const [limitPage, setLimitPage] = useState(10)
  const [skipCount, setSkipCount] = useState(0)

  const debouncedSearchText = useDebounce(searchText, 700)

  const {
    data: accounts,
    refetch: refetchAccounts,
    loading: loadingAccounts
  } = useQuery(GET_ACCOUNTS, {
    variables: {
      accountTypes:
        selectedRoles?.value === 'all' ? ALL_ROLES : selectedRoles?.value,
      companyId: selectedAssignment?.value,
      search: debouncedSearchText,
      limit: limitPage,
      skip: skipCount === 0 ? null : skipCount
    }
  })
  const { data: companies } = useQuery(GET_COMPANIES)
  const [getComplexes, { data: complexes }] = useLazyQuery(GET_COMPLEXES, {
    variables: {
      id: companyId
    }
  })

  const [getBuildings, { data: buildings }] = useLazyQuery(GET_BUILDINGS, {
    variables: {
      id: complexId
    }
  })

  const handleOnCompleted = () => {
    handleClearModal()
    showToast('success', `You have successfully sent a new invite`)
    refetchAccounts()
  }

  const [addBuildingAdmin, { loading: addingBuildingAdmin }] = useMutation(
    ADD_BUILDING_ADMIN,
    {
      onCompleted: handleOnCompleted
    }
  )
  const [addCompanyAdmin, { loading: addingCompanyAdmin }] = useMutation(
    ADD_COMPANY_ADMIN,
    {
      onCompleted: handleOnCompleted
    }
  )
  const [addComplexAdmin, { loading: addingComplexAdmin }] = useMutation(
    ADD_COMPLEX_ADMIN,
    {
      onCompleted: handleOnCompleted
    }
  )
  const [addReceptionist, { loading: addingReceptionist }] = useMutation(
    ADD_RECEPTIONIST,
    {
      onCompleted: handleOnCompleted
    }
  )
  const [addUnitOwner, { loading: addingUnitOwner }] = useMutation(
    ADD_UNIT_OWNER,
    {
      onCompleted: handleOnCompleted
    }
  )

  const [updateUser, { loading: updatingUser }] = useMutation(UPDATE_USER, {
    onCompleted: () => {
      showToast('success', `Update success!`)
      handleClearModal('edit')
    }
  })

  const [deleteUser, { loading: deletingUser }] = useMutation(DELETE_USER, {
    onCompleted: () => {
      const staff = selectedStaff?.user
      showToast(
        'success',
        `You have successfully deleted ${staff.firstname} ${staff.lastName}.`
      )
      handleClearModal('delete')
    }
  })

  useEffect(() => {
    if (companyId !== undefined && (isComplexAccount || isBuildingAccount)) {
      getComplexes()
    }
    if (complexId !== undefined && isBuildingAccount) {
      getBuildings()
    }
  }, [
    companyId,
    complexId,
    getBuildings,
    getComplexes,
    isBuildingAccount,
    isComplexAccount
  ])

  const handleShowModal = type => {
    switch (type) {
      case 'create':
        setShowModal(old => !old)
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
    }
    if (type === 'create') {
      resetInviteStaffForm({
        staffType: '',
        email: '',
        company: '',
        jobTitle: '',
        complex: '',
        building: ''
      })
    }

    handleShowModal(type)
  }

  const handleOk = values => {
    const {
      staffType: staff,
      email,
      jobTitle,
      company,
      complex,
      building
    } = values

    const data = {
      email,
      jobTitle
    }
    switch (staff.value) {
      case BUILDING_ADMIN:
        addBuildingAdmin({
          variables: {
            data,
            id: building.value
          }
        })
        break
      case COMPANY_ADMIN:
        addCompanyAdmin({
          variables: {
            data,
            id: company.value
          }
        })
        break
      case COMPLEX_ADMIN:
        addComplexAdmin({
          variables: {
            data,
            id: complex.value
          }
        })
        break
      case RECEPTIONIST:
        addReceptionist({
          variables: {
            data,
            id: building.value
          }
        })
        break
      case UNIT_OWNER:
        addUnitOwner({
          variables: {
            data,
            id: building.value
          }
        })
        break
      default:
        console.log(new Error('wrong staff type'))
    }
  }

  const handleEditOk = values => {
    const { staffFirstName, staffLastName } = values
    const data = {
      firstName: staffFirstName,
      lastName: staffLastName
    }

    updateUser({
      variables: {
        data,
        id: selectedStaff?.user?._id
      }
    })
  }

  const handleDeleteStaff = () => {
    deleteUser({
      variables: {
        data: {
          accountId: selectedStaff?.user._id
        }
      }
    })
  }

  const assignments = useMemo(() => {
    if (companies?.getCompanies?.data?.length > 0) {
      const options = companies.getCompanies.data.map(company => ({
        label: company.name,
        value: company._id
      }))

      return options
    }

    return []
  }, [companies?.getCompanies])

  const complexAssignments = useMemo(() => {
    if (complexes?.getComplexes?.data?.length > 0) {
      return complexes.getComplexes.data.map(complex => ({
        label: complex.name,
        value: complex._id
      }))
    }

    return []
  }, [complexes?.getComplexes])

  const buildingAssignments = useMemo(() => {
    if (buildings?.getBuildings?.data?.length > 0) {
      return buildings.getBuildings.data.map(building => ({
        label: building.name,
        value: building._id
      }))
    }

    return []
  }, [buildings?.getBuildings])

  const staffData = useMemo(
    () => ({
      count: accounts?.getAccounts?.count || 0,
      limit: accounts?.getAccounts?.limit || 0,
      offset: accounts?.getAccounts?.offset || 0,
      data:
        accounts?.getAccounts?.data?.length > 0
          ? accounts.getAccounts.data.map(({ user, company, accountType }) => {
              const dropdownData = [
                {
                  label: 'View Staff',
                  icon: <span className="ciergio-employees" />,
                  function: () => router.push(`/staff/view/${user?._id}`)
                },
                {
                  label: 'Edit Staff',
                  icon: <span className="ciergio-edit" />,
                  function: () => {
                    setSelectedStaff({
                      user,
                      company
                    })
                    resetEditStaffForm({
                      staffFirstName: user?.firstName,
                      staffLastName: user.lastName
                    })
                    handleShowModal('edit')
                  }
                },
                {
                  label: 'Remove Staff',
                  icon: <span className="ciergio-trash" />,
                  function: () => {
                    setSelectedStaff({
                      user,
                      company
                    })
                    handleShowModal('delete')
                  }
                }
              ]

              return {
                avatar: (
                  <div>
                    <img
                      className="w-11 h-11 rounded"
                      src={
                        user?.avatar ||
                        `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&rounded=true&size=44`
                      }
                      alt="user-avatar"
                    />
                  </div>
                ),
                name: (
                  <span className="capitalize">{`${user?.firstName} ${user?.lastName}`}</span>
                ),
                role: (
                  <span className="capitalize">
                    {accountType?.replace('_', ' ') || ''}
                  </span>
                ),
                assignment: (
                  <span className="capitalize">{company?.name || ''}</span>
                ),
                dropdown: (
                  <Can
                    perform="staff:view::update::delete"
                    yes={
                      <Dropdown
                        label={<AiOutlineEllipsis />}
                        items={dropdownData}
                      />
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
    addingBuildingAdmin ||
    addingCompanyAdmin ||
    addingComplexAdmin ||
    addingReceptionist ||
    addingUnitOwner

  return (
    <section className="content-wrap">
      <h1 className="content-title">Staff List</h1>
      <div className="flex items-center justify-end mt-12 mx-4 mb-4 w-full">
        <div className="flex items-center justify-between w-7/12 flex-row">
          <div className="w-full max-w-xs mr-2">
            <SelectDropdown
              placeholder="Filter Role"
              options={roles}
              onChange={selectedValue => {
                setSelectedRoles(selectedValue)
                setActivePage(1)
                setLimitPage(10)
                setSkipCount(0)
              }}
            />
          </div>
          <div className="w-full max-w-xs mr-2">
            <SelectDropdown
              placeholder="Filter Assignment"
              options={assignments}
              onChange={selectedValue => {
                setSelectedAssignment(selectedValue)
                setActivePage(1)
                setLimitPage(10)
                setSkipCount(0)
              }}
            />
          </div>
          <div className="w-full relative max-w-xs mr-4 top-2">
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
      <div className="flex items-center justify-between bg-white border-t border-l border-r rounded-t">
        <h1 className="font-bold text-base px-8 py-4">{`All Staff (${
          accounts?.getAccounts?.count || 0
        })`}</h1>
        <div className="flex items-center">
          <Can
            perform="staff:print"
            yes={
              <Button
                default
                icon={<HiOutlinePrinter />}
                onClick={() => {}}
                className="mr-4 mt-4"
                disabled
              />
            }
          />
          <Can
            perform="staff:export"
            yes={
              <Button
                default
                icon={<FiDownload />}
                onClick={() => {}}
                className="mr-4 mt-4"
                disabled
              />
            }
          />
          <Can
            perform="staff:invite"
            yes={
              <Button
                default
                leftIcon={<FaPlusCircle />}
                label="Invite Staff"
                onClick={() => handleShowModal('create')}
                className="mr-4 mt-4"
              />
            }
          />
        </div>
      </div>
      <Card
        noPadding
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
      <Modal
        title="Invite Staff"
        okText="Invite Staff"
        visible={showModal}
        onClose={() => handleClearModal('create')}
        onCancel={() => handleClearModal('create')}
        okButtonProps={{
          loading: sendingInvite
        }}
        onOk={handleInviteStaffSubmit(handleOk)}
        width={450}
      >
        <InviteStaffContent
          form={{
            control: inviteStaffControl,
            errors: inviteStaffErrors
          }}
          isComplex={isComplexAccount}
          isBuilding={isBuildingAccount}
          complexOptions={complexAssignments}
          buildingOptions={buildingAssignments}
          companyOptions={assignments}
          staffRoles={roles}
          staffType={staffType}
        />
      </Modal>
      <Modal
        title="Edit Staff"
        okText="Edit Staff"
        visible={showEditModal}
        onClose={() => handleClearModal('edit')}
        onCancel={() => handleClearModal('edit')}
        okButtonProps={{
          loading: updatingUser
        }}
        onOk={handleEditStaffSubmit(handleEditOk)}
        width={450}
      >
        <EditStaffContent
          form={{
            control: editStaffControl,
            errors: editStaffErrors
          }}
        />
      </Modal>
      <Modal
        title="Remove Staff"
        okText="Remove Staff"
        visible={showDeleteModal}
        onClose={() => handleClearModal('delete')}
        onCancel={() => handleClearModal('delete')}
        okButtonProps={{
          loading: deletingUser
        }}
        onOk={handleDeleteStaff}
        width={450}
      >
        <RemoveStaffContent
          user={{
            firstName: selectedStaff?.user.firstName,
            lastName: selectedStaff?.user.lastName,
            jobTitle: selectedStaff?.user.jobTitle,
            companyName: selectedStaff?.company.name
          }}
        />
      </Modal>
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
