import { useState, useMemo, Fragment } from 'react'
import uniqWith from 'lodash/uniqWith'
import isEqual from 'lodash/isEqual'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import FormSelect from '@app/components/forms/form-select'
import Button from '@app/components/button'
import { Card } from '@app/components/globals'
import PrimaryDataTable from '@app/components/globals/PrimaryDataTable'
import { FaPlusCircle } from 'react-icons/fa'
import { HiOutlinePrinter } from 'react-icons/hi'
import { FiDownload } from 'react-icons/fi'
import AddResidentModal from '../components/AddResidentModal'
import Can from '@app/permissions/can'
import useDebounce from '@app/utils/useDebounce'
import Dropdown from '@app/components/dropdown'
import { GET_RESIDENTS, GET_FLOOR_NUMBERS } from '../queries'
import SearchComponent from '@app/components/globals/SearchControl'

const accountTypes = [
  {
    label: 'All Accounts',
    value: ['unit_owner', 'resident']
  },
  {
    label: 'Unit Owner',
    value: ['unit_owner']
  },
  {
    label: 'Resident',
    value: ['resident']
  }
]

const columns = [
  {
    name: 'Unit #',
    width: ''
  },
  {
    name: 'Resident Name',
    width: ''
  },
  {
    name: 'Account Type',
    width: ''
  },
  {
    name: '',
    width: ''
  }
]

function AllResidents() {
  const router = useRouter()
  const { buildingId } = router?.query
  const [searchText, setSearchText] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageLimit, setPageLimit] = useState(10)
  const [pageOffset, setPageOffset] = useState(0)
  const [selectedFloor, setSelectedFloor] = useState(null)
  const [selectedAccounts, setSelectedAccounts] = useState([
    'unit_owner',
    'resident'
  ])
  const debouncedText = useDebounce(searchText, 700)
  const { data: residents, loading, refetch } = useQuery(GET_RESIDENTS, {
    variables: {
      where: {
        accountTypes: selectedAccounts,
        sortBy: { unitName: 1 },
        buildingId,
        floorNumber: selectedFloor,
        search: debouncedText
      },
      limit: pageLimit,
      skip: pageOffset
    }
  })

  const { data: floorNumbers } = useQuery(GET_FLOOR_NUMBERS, {
    variables: {
      buildingId
    }
  })

  const handleRefetch = () => {
    refetch({
      variables: {
        where: {
          accountTypes: selectedAccounts,
          sortBy: { unitName: 1 },
          buildingId,
          floorNumber: selectedFloor,
          search: debouncedText
        },
        limit: pageLimit,
        skip: pageOffset
      }
    })
  }

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

  const units = useMemo(() => {
    const newUnits = residents?.getAccounts?.data?.map(res => ({
      name: res.unit.name,
      id: res.unit._id
    }))
    return uniqWith(newUnits, isEqual)
  }, [residents?.getAccounts])

  const residentsData = useMemo(
    () => ({
      count: residents?.getAccounts?.count || 0,
      limit: residents?.getAccounts?.limit || 10,
      offset: residents?.getAccounts?.skip || 0,
      data:
        units?.length > 0
          ? units.map(unit => {
              return {
                name: unit.name,
                id: unit.id,
                residents: residents.getAccounts.data.map(res => {
                  const dropdownData = [
                    {
                      label: 'View Profile',
                      icon: <span className="ciergio-user" />,
                      function: () => {
                        router.push(`/residents/view/${res._id}`)
                      }
                    }
                  ]

                  if (res?.unit?._id === unit.id) {
                    return {
                      name: `${res.user.firstName} ${res.user.lastName}`,
                      avatar: res.user.avatar,
                      accountType: res.accountType,
                      dropdown: (
                        <Dropdown
                          label={<span className="ciergio-more" />}
                          items={dropdownData}
                        />
                      )
                    }
                  }
                  return null
                })
              }
            })
          : []
    }),
    [residents?.getAccounts, units]
  )

  const customResidentsTable = useMemo(() => {
    return (
      <>
        {residentsData?.data?.map(unit => {
          return (
            <Fragment key={unit.id}>
              <tr className="bg-white">
                <td
                  className="border px-8 py-4 text-left"
                  colSpan={columns?.length}
                >
                  <span className="font-bold text-neutral-dark">
                    {unit.name}
                  </span>
                </td>
              </tr>
              {unit?.residents?.length > 0
                ? unit.residents.map((resident, index) => {
                    if (!resident) return null
                    return (
                      <tr key={index} className="bg-white">
                        <td></td>
                        <td>
                          <div className="flex items-center">
                            <img
                              src={
                                resident?.avatar ??
                                `https://ui-avatars.com/api/?name=${resident?.name}`
                              }
                              alt={resident?.name}
                              className="w-10 h-10 rounded-full mr-4"
                            />
                            <span className="font-bold text-neutral-dark">
                              {resident?.name}
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className="capitalize">
                            {resident?.accountType?.replace('_', ' ')}
                          </span>
                        </td>
                        <td>{resident?.dropdown}</td>
                      </tr>
                    )
                  })
                : null}
            </Fragment>
          )
        })}
      </>
    )
  }, [residentsData?.data])

  const handleShowModal = () => setShowModal(old => !old)

  return (
    <section className="content-wrap">
      <h1 className="content-title">
        {residents?.getAccounts
          ? `${residents?.getAccounts?.data[0]?.building?.name} Resident List`
          : null}
      </h1>

      <div className="flex items-center justify-end mt-12 mx-4 w-full">
        <div className="flex items-center justify-between w-8/12 flex-row">
          <FormSelect
            options={floorOptions}
            className="mr-4"
            onChange={floor => setSelectedFloor(floor.value)}
          />
          <FormSelect
            options={accountTypes}
            className="mr-4"
            onChange={account => setSelectedAccounts(account?.value)}
          />
          <SearchComponent
            name="search"
            searchText={searchText}
            placeholder="Search"
            onSearch={e => {
              if (e.target.value === '') {
                setSearchText(null)
              } else {
                setSearchText(e.target.value)
              }
            }}
            onClearSearch={() => setSearchText(null)}
          />
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
            loading={loading}
            data={residentsData}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            pageLimit={pageLimit}
            setPageLimit={setPageLimit}
            setPageOffset={setPageOffset}
            customBody={customResidentsTable}
            customize
          />
        }
      />
      <AddResidentModal
        showModal={showModal}
        onShowModal={handleShowModal}
        buildingId={buildingId}
        refetch={handleRefetch}
      />
    </section>
  )
}

export default AllResidents
