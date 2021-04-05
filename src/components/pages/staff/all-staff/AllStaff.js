import React, { useState, useMemo } from 'react'
import { useRouter } from 'next/router'
import { useMutation, useQuery } from '@apollo/client'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'

import { Card } from '@app/components/globals'
import Button from '@app/components/button'
import Dropdown from '@app/components/dropdown'
import FormSelect from '@app/components/forms/form-select'
import PrimaryDataTable from '@app/components/globals/PrimaryDataTable'
import SearchComponent from '@app/components/globals/SearchControl'
import InviteStaffModal from './InviteStaffModal'
import EditStaffModal from './EditStaffModal'
import RemoveStaffModal from './RemoveStaffModal'
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
  GET_COMPANIES,
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
  ALL_ROLES,
  STAFF_ROLES,
  parseAccountType
} from '../constants'
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
      company: null,
      complex: null,
      building: null
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
  const { data: companies } = useQuery(GET_COMPANIES)

  const handleOnCompleted = () => {
    handleClearModal('create')
    showToast(
      'success',
      `You have successfully sent a new invite. Registration code was sent to the email.`
    )
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
      showToast(
        'success',
        `You have successfully deleted ${staff.firstname} ${staff.lastName}.`
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
      return
    }

    resetInvite({
      staffType: null,
      email: '',
      jobTitle: '',
      company: null,
      complex: null,
      building: null
    })

    handleShowModal(type)
  }

  const handleOk = async () => {
    const validate = await triggerInviteStaff()

    if (validate) {
      const values = getInviteStaffValues()
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
          console.err(new Error('wrong staff type'))
      }
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
          accountId: selectedStaff?._id
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

  const staffData = useMemo(
    () => ({
      count: accounts?.getAccounts?.count || 0,
      limit: accounts?.getAccounts?.limit || 0,
      offset: accounts?.getAccounts?.offset || 0,
      data:
        accounts?.getAccounts?.data?.length > 0
          ? accounts.getAccounts.data.map(staff => {
              const { user, company, accountType } = staff
              const roleType = parseAccountType(accountType)

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
                    setSelectedStaff(staff)
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
                    setSelectedStaff(staff)
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
                role: <span className="capitalize">{roleType}</span>,
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
      <h1 className="content-title">Staff List</h1>
      <div className="flex items-center justify-end mt-12 mx-4 mb-4 w-full">
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
        title={
          <h1 className="font-bold text-base px-8 py-4">{`All Staff (${
            accounts?.getAccounts?.count || 0
          })`}</h1>
        }
        actions={[
          <Button
            key="print"
            default
            icon={<HiOutlinePrinter />}
            onClick={() => {}}
            className="mr-4 mt-4"
            disabled
          />,
          <Button
            key="download"
            default
            icon={<FiDownload />}
            onClick={() => {}}
            className="mr-4 mt-4"
            disabled
          />,
          <Button
            key="create"
            default
            leftIcon={<FaPlusCircle />}
            label="Invite Staff"
            onClick={() => handleShowModal('create')}
            className="mr-4 mt-4"
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
      <EditStaffModal
        form={{
          control: editStaffControl,
          errors: editStaffErrors
        }}
        open={showEditModal}
        onCancel={() => handleClearModal('edit')}
        onOk={handleEditSubmit(handleEditOk)}
        loading={updatingUser}
      />
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
