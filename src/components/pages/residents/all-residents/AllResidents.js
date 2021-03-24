import { useState, useMemo } from 'react'
import P from 'prop-types'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import FormSelect from '@app/components/forms/form-select'
import FormInput from '@app/components/forms/form-input'
import Button from '@app/components/button'
import { Card } from '@app/components/globals'
import PrimaryDataTable from '@app/components/globals/PrimaryDataTable'
import { FaTimes, FaSearch, FaPlusCircle } from 'react-icons/fa'
import { HiOutlinePrinter } from 'react-icons/hi'
import { FiDownload } from 'react-icons/fi'
import AddResidentModal from '../components/AddResidentModal'
import Can from '@app/permissions/can'
import Dropdown from '@app/components/dropdown'
import { AiOutlineEllipsis } from 'react-icons/ai'
import { GET_RESIDENTS, GET_FLOOR_NUMBERS } from '../queries'

const accountTypes = [
  {
    label: 'All Accounts',
    value: null
  },
  {
    label: 'Unit Owner',
    value: 'unit-owner'
  },
  {
    label: 'Relative',
    value: 'relative'
  }
]

const columns = [
  {
    Name: 'Unit #',
    width: ''
  },
  {
    Name: 'Resident Name',
    width: ''
  },
  {
    Name: 'Account Type',
    width: ''
  },
  {
    Name: '',
    width: ''
  }
]

function AllResidents() {
  const router = useRouter()
  const { buildingId } = router?.query
  const [searchText, setSearchText] = useState('')
  const [showModal, setShowModal] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageLimit, setPageLimit] = useState(10)
  const [, setPageOffset] = useState(0)

  const { data: residents } = useQuery(GET_RESIDENTS, {
    variables: {
      where: {
        accountTypes: ['unit_owner', 'resident'],
        sortBy: { unitName: 1 },
        buildingId
      }
    }
  })

  const { data: floorNumbers } = useQuery(GET_FLOOR_NUMBERS, {
    variables: {
      buildingId
    }
  })

  const floorOptions = useMemo(() => {
    if (floorNumbers?.getFloorNumbers?.length > 0) {
      const floors = floorNumbers.getFloorNumbers.map(floor => ({
        label: floor,
        value: floor
      }))
      return [
        {
          label: 'All Floors',
          value: null
        },
        ...floors
      ]
    }
    return []
  })

  const residentsData = useMemo(
    () => ({
      count: residents?.getAccounts?.count || 0,
      limit: 10,
      offset: 0,
      data:
        residents?.getAccounts?.count > 0
          ? residents.getAccounts.data.map(dt => {
              const user = dt?.user
              const dropdownData = [
                {
                  label: 'Resend Invite',
                  icon: <span className="ciergio-employees" />,
                  function: () => {}
                },
                {
                  label: 'Cancel Invite',
                  icon: <span className="ciergio-edit" />,
                  function: () => {}
                }
              ]

              return {
                unitNumber: dt?.unit?.name,
                name: `${user?.firstName} ${user?.lastName}`,
                type: dt?.accountType,
                dropdown: (
                  <Can
                    perform="residents:resend::cancel"
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
    [residents?.getAccounts]
  )
  console.log('res', residents)
  const handleShowModal = () => setShowModal(old => !old)

  return (
    <section className="content-wrap">
      <h1 className="content-title">Tower 1 Residents List</h1>

      <div className="flex items-center justify-end mt-12 mx-4 w-full">
        <div className="flex items-center justify-between w-8/12 flex-row">
          <FormSelect options={floorOptions} className="mr-4" />
          <FormSelect options={accountTypes} className="mr-4" />
          <div className="w-full relative mr-4">
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
        <h1 className="font-bold text-base px-8 py-4">{`Residents`}</h1>
        <div className="flex items-center">
          <Can
            perform="residents:print"
            yes={
              <Button
                default
                icon={<HiOutlinePrinter />}
                onClick={() => {}}
                className="mr-4 mt-4"
              />
            }
          />
          <Can
            perform="residents:export"
            yes={
              <Button
                default
                icon={<FiDownload />}
                onClick={() => {}}
                className="mr-4 mt-4"
              />
            }
          />
          <Can
            perform="residents:create"
            yes={
              <Button
                default
                leftIcon={<FaPlusCircle />}
                label="Add Resident"
                onClick={handleShowModal}
                className="mr-4 mt-4"
              />
            }
          />
        </div>
      </div>
      <Card
        content={
          <PrimaryDataTable
            columns={columns}
            data={residentsData}
            loading={false}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            pageLimit={pageLimit}
            setPageLimit={setPageLimit}
            setPageOffset={setPageOffset}
            customBody={
              <>
                {residentsData?.data?.map((r, i) => {
                  return (
                    <tr key={i}>
                      <td
                        className="border px-8 py-4 text-left"
                        colSpan={columns?.length}
                      >
                        {r.unitNumber}
                      </td>
                    </tr>
                  )
                })}
              </>
            }
            customize
          />
        }
      />
      <AddResidentModal showModal={showModal} onShowModal={handleShowModal} />
    </section>
  )
}

function ResidentCell({ value }) {
  return (
    <div>
      <div>{value.resident_name}</div>
      <div>{value.contact_number}</div>
    </div>
  )
}

function ResidentInviteButton({ value }) {
  if (value.active) return null

  return (
    <div>
      <Button label="Invite" onClick={() => console.log('invited')} />
    </div>
  )
}

function ResidentType({ value }) {
  return (
    <div>
      <span>{`${value.account_type} ${
        !value.active ? '(Unregistered)' : ''
      }`}</span>
    </div>
  )
}

ResidentCell.propTypes = {
  value: P.object
}

ResidentInviteButton.propTypes = {
  value: P.object
}

ResidentType.propTypes = {
  value: P.object
}

export default AllResidents
