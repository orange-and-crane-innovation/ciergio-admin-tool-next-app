import { debounce } from 'lodash'
import { useRouter } from 'next/router'
import React, { useState, useMemo } from 'react'
import { FaPlusCircle, FaEllipsisH } from 'react-icons/fa'
import { FiDownload } from 'react-icons/fi'
import { HiOutlinePrinter } from 'react-icons/hi'

import Can from '@app/permissions/can'
import { useLazyQuery, useMutation, useQuery } from '@apollo/client'
import Button from '@app/components/button'
import SearchControl from '@app/components/globals/SearchControl'
import { Action, Card, Table } from '@app/components/globals'
import AddResidentModal from '@app/components/pages/residents/components/AddResidentModal'

import ViewResidentModal from './../ViewResidentModal'
import PrimaryDataTable from '@app/components/globals/PrimaryDataTable'
import gql from 'graphql-tag'
import Link from 'next/link'
import Dropdown from '@app/components/dropdown'

const columns = [
  {
    name: '',
    width: ''
  },
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
    width: ''
  }
]

export const GET_ACCOUNTS = gql`
  query getAccounts($where: GetAccountsParams, $skip: Int, $limit: Int) {
    getAccounts(where: $where, skip: $skip, limit: $limit) {
      count
      skip
      limit
      data {
        _id
        accountType
        companyRoleId
        companyGroups {
          _id
          name
        }
        companyRole {
          _id
          name
          status
          permissions {
            group
            accessLevel
          }
        }
        user {
          _id
          email
          firstName
          lastName
          avatar
          jobTitle
        }
        company {
          name
          _id
        }
        complex {
          name
          _id
        }
        building {
          name
          _id
        }
      }
    }
  }
`

function MyMembers() {
  const router = useRouter()
  const [searchText, setSearchText] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [viewResident, setViewResident] = useState(false)
  const [selectedResident, setSelectedResident] = useState(null)
  const [selectedStaff, setSelectedStaff] = useState(null)
  const [activePage, setActivePage] = useState(1)
  const [limitPage, setLimitPage] = useState(10)
  const [skipCount, setSkipCount] = useState(0)

  const handleShowModal = () => setShowModal(old => !old)

  const handleResidentView = () => setViewResident(old => !old)

  const onSearch = debounce(e => {
    setSearchText(e.target.value !== '' ? e.target.value : null)
  }, 1000)

  const onClearSearch = () => {
    setSearchText(null)
  }

  const user = JSON.parse(localStorage.getItem('profile'))
  const profile = JSON.parse(localStorage.getItem('profile'))
  const companyId = user?.accounts?.data[0]?.company?._id
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

  const staffData = useMemo(
    () => ({
      count: accounts?.getAccounts?.count || 0,
      limit: accounts?.getAccounts?.limit || 0,
      offset: accounts?.getAccounts?.offset || 0,
      data:
        accounts?.getAccounts?.data?.length > 0
          ? accounts.getAccounts.data.map(staff => {
              const {
                user,
                company,
                complex,
                building,
                accountType,
                companyGroups
              } = staff
              const roleType = staff?.companyRole?.name || ''
              let dropdownData = [
                {
                  label: `${
                    profile._id === user?._id ? 'View Profile' : 'View Member'
                  }`,
                  icon: <span className="ciergio-user" />,
                  function: () => {
                    setSelectedResident(staff)
                    setViewResident(staff)
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
                      setSelectedResident(staff)
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
    // [accounts?.getAccounts, router, resetEditStaffForm]
  )

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
        <h1 className="font-bold text-base px-8 py-4">{`Members`}</h1>
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
            label="Add Member"
            onClick={handleShowModal}
            className="mr-4 mt-4"
          />
        </div>
      </div>
      <Card
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
          // <Table
          //   columns={tableRows}
          //   payload={tableData}
          //   onRowClick={resident => {
          //     setSelectedResident(resident)
          //     setViewResident(old => !old)
          //   }}
          //   pagination
          // />
        }
      />

      <AddResidentModal showModal={showModal} onShowModal={handleShowModal} />
      <ViewResidentModal
        showModal={viewResident}
        onShowModal={handleResidentView}
        resident={selectedResident}
      />
    </section>
  )
}

export default MyMembers
