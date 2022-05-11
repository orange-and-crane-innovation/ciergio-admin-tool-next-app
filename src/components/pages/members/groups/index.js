import { debounce } from 'lodash'
import React, { useState, useEffect } from 'react'
import { FaPlusCircle, FaEllipsisH } from 'react-icons/fa'
import { gql, useQuery, useMutation } from '@apollo/client'

import Button from '@app/components/button'
import { Card } from '@app/components/globals'
import Table from '@app/components/table'
import Dropdown from '@app/components/dropdown'
import SearchControl from '@app/components/globals/SearchControl'
import AddResidentModal from '@app/components/pages/residents/components/AddResidentModal'
import PageLoader from '@app/components/page-loader'

import errorHandler from '@app/utils/errorHandler'

import ViewResidentModal from './../ViewResidentModal'

const tableRowNames = [
  {
    name: 'Group Name',
    width: '95%'
  },
  {
    name: 'Actions',
    width: ''
  }
]

const GET_COMPANY_GROUPS_QUERY = gql`
  query($where: getCompanyGroupsParams) {
    getCompanyGroups(where: $where) {
      _id
      name
      status
      companyId
    }
  }
`

const Groups = () => {
  const profile = JSON.parse(localStorage.getItem('profile'))
  const [groups, setGroups] = useState()
  const [searchText, setSearchText] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [viewResident, setViewResident] = useState(false)
  const [selectedResident, setSelectedResident] = useState(null)

  const { loading, data, error, refetch } = useQuery(GET_COMPANY_GROUPS_QUERY, {
    enabled: false,
    variables: {
      where: {
        companyId: profile.accounts.data[0].company._id,
        status: 'active'
      }
    }
  })

  const handleShowModal = () => setShowModal(old => !old)

  const handleResidentView = () => setViewResident(old => !old)

  const onSearch = debounce(e => {
    setSearchText(e.target.value !== '' ? e.target.value : null)
  }, 1000)

  const onClearSearch = () => {
    setSearchText(null)
  }

  const onClick = () => {
    console.log('HEY ')
  }

  useEffect(() => {
    if (!loading)
      if (error) {
        errorHandler(error)
      } else if (data) {
        const tableData = {
          data:
            data?.getCompanyGroups?.map(item => {
              const dropdownData = [
                {
                  label: 'View',
                  function: () => {
                    setSelectedResident(item)
                    setViewResident(old => !old)
                  }
                },
                {
                  label: 'Add Members',
                  function: () => onClick
                },
                {
                  label: 'Edit',
                  function: () => onClick
                },
                {
                  label: 'Delete',
                  function: () => onClick
                }
              ]

              return {
                name: item?.name,
                button: (
                  <Dropdown label={<FaEllipsisH />} items={dropdownData} />
                )
              }
            }) || null
        }

        setGroups(tableData)
      }
  }, [loading, data, error])

  return (
    <section className="content-wrap">
      <h1 className="content-title">Manage Groups</h1>

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
        <h1 className="font-bold text-base px-8 py-4">{`Residents`}</h1>
        <div className="flex items-center">
          <Button
            default
            leftIcon={<FaPlusCircle />}
            label="Create New Group"
            onClick={handleShowModal}
            className="mr-4 mt-4"
          />
        </div>
      </div>
      <Card
        content={
          <Table rowNames={tableRowNames} items={groups} loading={loading} />
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

export default Groups
