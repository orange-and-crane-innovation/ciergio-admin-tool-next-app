import { debounce } from 'lodash'
import { useRouter } from 'next/router'
import React, { useMemo, useState } from 'react'
import { FaEllipsisH } from 'react-icons/fa'
import { FiDownload } from 'react-icons/fi'
import { HiOutlinePrinter } from 'react-icons/hi'

import { gql, useQuery } from '@apollo/client'
import Button from '@app/components/button'
import Dropdown from '@app/components/dropdown'
import { Card } from '@app/components/globals'
import PrimaryDataTable from '@app/components/globals/PrimaryDataTable'
import SearchControl from '@app/components/globals/SearchControl'
import { GET_ACCOUNTS } from '@app/components/pages/staff/queries'
import Can from '@app/permissions/can'
import ViewResidentModal from './../ViewResidentModal'

const tableRowNames = [
  {
    name: 'Name',
    width: ''
  },
  {
    name: 'Email Address',
    width: ''
  },
  {
    name: 'Last Activity',
    width: ''
  },
  {
    name: 'Actions',
    width: '4%'
  }
]

const GET_COMPANY_GROUP = gql`
  query($where: getCompanyGroupParams) {
    getCompanyGroup(where: $where) {
      _id
      name
      status
      companyId
    }
  }
`

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

const Group = () => {
  const profile = JSON.parse(localStorage.getItem('profile'))
  const companyID = profile.accounts.data[0].company._id
  const router = useRouter()
  const { query } = router
  const { groupID } = query
  const [searchText, setSearchText] = useState('')

  const [viewMember, setViewMember] = useState(false)
  const [selectedMember, setSelectedMember] = useState(null)

  const [activePage, setActivePage] = useState(1)
  const [limitPage, setLimitPage] = useState(10)
  const [skipCount, setSkipCount] = useState(0)
  const where = {
    accountTypes: 'member',
    companyId: companyID,
    companyGroupId: groupID
    // search: debouncedSearchText
  }

  const { loading: loadingGroup, data: group, error: errorGroup } = useQuery(
    GET_COMPANY_GROUP,
    {
      enabled: false,
      variables: {
        where: {
          companyGroupId: groupID
        }
      }
    }
  )

  const { loading: loadingGroups, data: groups, error: errorGroups } = useQuery(
    GET_COMPANY_GROUPS,
    {
      enabled: false,
      variables: {
        where: {
          companyId: companyID,
          status: 'active'
        }
      }
    }
  )

  const { loading, data: accounts, error, refetch } = useQuery(GET_ACCOUNTS, {
    skip: where === undefined,
    variables: {
      where,
      limit: limitPage,
      skip: skipCount === 0 ? null : skipCount
    }
  })

  const listData = useMemo(
    () => ({
      count: accounts?.getAccounts?.count || 0,
      limit: accounts?.getAccounts?.limit || 0,
      offset: accounts?.getAccounts?.offset || 0,
      data:
        accounts?.getAccounts?.data?.length > 0
          ? accounts.getAccounts.data.map(staff => {
              console.log("staff", staff)
              const { user, accountType } = staff

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
                      console.log('HEY')
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
                      console.log('HEY')
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
                email: <>{user?.email}</>,
                group: <span className="capitalize"></span>,
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

  const onSearch = debounce(e => {
    setSearchText(e.target.value !== '' ? e.target.value : null)
  }, 1000)

  const onClearSearch = () => {
    setSearchText(null)
  }

  const handleViewMember = () => setViewMember(old => !old)

  return (
    <section className="content-wrap">
      <h1 className="content-title">{group?.getCompanyGroup?.name}</h1>

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
        <h1 className="font-bold text-base px-4 py-4">{`Members in ${group?.getCompanyGroup?.name}`}</h1>
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
          {/* <Button
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
          /> */}
        </div>
      </div>
      <Card
        content={
          <PrimaryDataTable
            data={listData}
            columns={tableRowNames}
            loading={loading}
            currentPage={activePage}
            pageLimit={limitPage}
            setCurrentPage={setActivePage}
            setPageOffset={setSkipCount}
            setPageLimit={setLimitPage}
          />
          // <Table rowNames={tableRowNames} items={groups} loading={loading} />
        }
      />

      <ViewResidentModal
        showModal={viewMember}
        onShowModal={handleViewMember}
        resident={selectedMember}
      />
    </section>
  )
}

export default Group
