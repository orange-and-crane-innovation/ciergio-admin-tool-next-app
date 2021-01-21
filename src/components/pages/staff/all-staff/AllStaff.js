import React, { useState, useMemo } from 'react'
import { useQuery } from '@apollo/client'

import Button from '@app/components/button'
import FormInput from '@app/components/forms/form-input'
import FormSelect from '@app/components/forms/form-select'
import Modal from '@app/components/modal'
import Table from '@app/components/table'
import Dropdown from '@app/components/dropdown'
import { Card } from '@app/components/globals'

import { FaTimes, FaSearch, FaPlusCircle } from 'react-icons/fa'
import { HiOutlinePrinter } from 'react-icons/hi'
import { FiDownload } from 'react-icons/fi'
import { AiOutlineEllipsis } from 'react-icons/ai'

import useDebounce from '@app/utils/useDebounce'

import { GET_ACCOUNTS, GET_COMPANIES } from '../queries'

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
    name: 'Role',
    width: ''
  },
  {
    name: 'Assignment',
    width: ''
  },
  {
    name: '',
    width: ''
  }
]

const roles = [
  {
    label: 'All',
    value: 'all'
  },
  {
    label: 'Administrator',
    value: 'administrator'
  },
  {
    label: 'Company Admin',
    value: 'company_admin'
  },
  {
    label: 'Complex Admin',
    value: 'complex_admin'
  }
]

const ALL_ROLES = ['administrator', 'complex_admin', 'company_admin']

function AllStaff() {
  const [searchText, setSearchText] = useState('')
  const [showModal, setShowModal] = useState('')
  const [staffEmail, setStaffEmail] = useState('')
  const [selectedRoles, setSelectedRoles] = useState('all')
  const [selectedAssignment, setSelectedAssignment] = useState('')

  const debouncedSearchText = useDebounce(searchText, 700)

  const { data: accounts } = useQuery(GET_ACCOUNTS, {
    variables: {
      accountTypes: selectedRoles === 'all' ? ALL_ROLES : selectedRoles,
      companyId: selectedAssignment,
      search: debouncedSearchText
    }
  })
  const { data: companies } = useQuery(GET_COMPANIES)

  const handleShowModal = () => setShowModal(old => !old)

  const handleClearModal = () => {
    handleShowModal()
  }

  const handleOk = () => {
    handleClearModal()
  }

  const assignments = useMemo(() => {
    if (companies?.getCompanies?.data?.length > 0) {
      const options = companies.getCompanies.data.map(company => ({
        label: company.name,
        value: company._id
      }))

      return [
        {
          label: 'All',
          value: ''
        },
        ...options
      ]
    }

    return []
  }, [companies?.getCompanies])

  const staffData = useMemo(
    () => ({
      count: accounts?.getAccounts?.count || 0,
      limit: accounts?.getAccounts?.limit || 0,
      data:
        accounts?.getAccounts?.data?.length > 0
          ? accounts.getAccounts.data.map(
              ({ _id, user, company, accountType }) => {
                const dropdownData = [
                  {
                    label: 'View Staff',
                    icon: <span className="ciergio-employees" />,
                    function: () => console.log(_id)
                  },
                  {
                    label: 'Edit Staff',
                    icon: <span className="ciergio-edit" />,
                    function: () => console.log(_id)
                  },
                  {
                    label: 'Remove Staff',
                    icon: <span className="ciergio-trash" />,
                    function: () => console.log(_id)
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
                    <Dropdown
                      label={<AiOutlineEllipsis />}
                      items={dropdownData}
                    />
                  )
                }
              }
            )
          : []
    }),
    [accounts?.getAccounts]
  )

  return (
    <section className="content-wrap">
      <h1 className="content-title">Staff List</h1>
      <div className="flex items-center justify-end mt-12 mx-4 w-full">
        <div className="flex items-center justify-between w-7/12 flex-row">
          <div className="max-w-sm mr-2">
            <FormSelect
              options={roles}
              onChange={e => setSelectedRoles(e.target.value)}
            />
          </div>
          <div className="max-w-sm mr-2">
            <FormSelect
              options={assignments}
              onChange={e => setSelectedAssignment(e.target.value)}
            />
          </div>
          <div className="w-full relative max-w-xs mr-4">
            <FormInput
              name="search"
              placeholder="Search"
              inputClassName="pr-8"
              onChange={e => setSearchText(e.target.value)}
              value={searchText}
            />
            <span className="absolute top-4 right-4">
              {searchText ? (
                <FaTimes className="cursor-pointer" onClick={() => {}} />
              ) : (
                <FaSearch />
              )}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between bg-white border-t border-l border-r rounded-t">
        <h1 className="font-bold text-base px-8 py-4">{`All Staff (${accounts?.getAccounts?.data?.length})`}</h1>
        <div className="flex items-center">
          <Button
            default
            icon={<HiOutlinePrinter />}
            onClick={() => {}}
            className="mr-4 mt-4"
            disabled
          />
          <Button
            default
            icon={<FiDownload />}
            onClick={() => {}}
            className="mr-4 mt-4"
            disabled
          />
          <Button
            default
            leftIcon={<FaPlusCircle />}
            label="Invite Staff"
            onClick={handleShowModal}
            className="mr-4 mt-4"
          />
        </div>
      </div>
      <Card
        noPadding
        content={<Table rowNames={columns} items={staffData} />}
      />
      <Modal
        title="Invite Staff"
        okText="Invite Staff"
        visible={showModal}
        onClose={handleClearModal}
        onCancel={handleClearModal}
        onOk={handleOk}
      >
        <div className="w-full">
          <h1 className="font-bold text-sm mb-4">Staff Type</h1>
          <FormSelect options={roles} />
          <FormInput
            label="Email Address"
            placeholder="Enter staff email address"
            type="email"
            onChange={e => setStaffEmail(e.target.value)}
            name="staff-email"
            value={staffEmail}
            inputClassName="w-full rounded border-gray-300"
          />
        </div>
      </Modal>
    </section>
  )
}

export default AllStaff
