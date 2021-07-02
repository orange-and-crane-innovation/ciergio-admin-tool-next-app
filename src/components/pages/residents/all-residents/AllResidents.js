import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useQuery } from '@apollo/client'
import { FaPlusCircle, FaEllipsisH } from 'react-icons/fa'

import Button from '@app/components/button'
import Dropdown from '@app/components/dropdown'
import FormSelect from '@app/components/forms/form-select'
import Card from '@app/components/card'
import PrimaryDataTable from '@app/components/globals/PrimaryDataTable'
import SearchComponent from '@app/components/globals/SearchControl'
import NotifCard from '@app/components/globals/NotifCard'

import useDebounce from '@app/utils/useDebounce'
import getAccountTypeName from '@app/utils/getAccountTypeName'

import {
  GET_BUILDINGS_QUERY,
  GET_RESIDENTS,
  GET_FLOOR_NUMBERS
} from '../queries'

import AddResidentModal from '../components/AddResidentModal'

import Can from '@app/permissions/can'

const _ = require('lodash')

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
  const [buildingName, setBuildingName] = useState()
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

  const {
    loading: loadingBuildings,
    data: dataBuildings,
    error: errorBuildings
  } = useQuery(GET_BUILDINGS_QUERY, {
    enabled: false,
    variables: {
      where: {
        _id: buildingId
      }
    }
  })

  const {
    data: residents,
    loading,
    refetch
  } = useQuery(GET_RESIDENTS, {
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

  useEffect(() => {
    if (!loadingBuildings && dataBuildings) {
      setBuildingName(dataBuildings?.getBuildings?.data[0]?.name)
    }
  }, [loadingBuildings, dataBuildings, errorBuildings])

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
    return [
      {
        label: 'All Floors',
        value: null
      }
    ]
  }, [floorNumbers])

  const residentsData = useMemo(() => {
    return {
      count: residents?.getAccounts?.count || 0,
      limit: residents?.getAccounts?.limit || 0,
      offset: residents?.getAccounts?.skip || 0,
      data:
        residents?.getAccounts?.data.map(item => {
          const residentName = `${item?.user?.firstName} ${item?.user?.lastName}`
          const dropdownData = [
            {
              label: 'View Profile',
              icon: <span className="ciergio-user" />,
              function: () => {
                router.push(`/residents/view/${item?._id}`)
              }
            }
          ]

          return {
            unitId: item?.unit?._id,
            unit: item?.unit?.name,
            residentId: item?._id,
            resident: residentName ?? '',
            avatar:
              item?.user?.avatar ??
              `https://ui-avatars.com/api/?name=${residentName}`,
            accountType: getAccountTypeName(item?.accountType),
            button: <Dropdown label={<FaEllipsisH />} items={dropdownData} />
          }
        }) ?? []
    }
  }, [residents?.getAccounts])

  const customResidentsTable = useMemo(() => {
    const groupedData = _.groupBy(
      residentsData?.data,
      item => item.unit || null
    )

    return Object.keys(groupedData).map(key => [
      <tr key={key} className="bg-neutral-100">
        <td colSpan={4}>
          <strong>
            <Link
              href={`/properties/unit/${
                residentsData?.data?.find(item => item.unit === key)?.unitId
              }/overview`}
            >
              <a className="mr-2 hover:underline">{key}</a>
            </Link>
          </strong>
        </td>
      </tr>,
      ...groupedData[key].map((item, index) => {
        return (
          <tr key={index} style={{ backgroundColor: 'white' }}>
            <td></td>
            <td>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full overflow-auto border border-neutral-300">
                  <img
                    src={item?.avatar}
                    alt={item?.resident}
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <span className="ml-4 font-bold text-neutral-dark">
                  <Link href={`/residents/view/${item?.residentId}`}>
                    <a className="mr-2 hover:underline">{item?.resident}</a>
                  </Link>
                </span>
              </div>
            </td>
            <td>{item?.accountType}</td>
            <td>{item.button}</td>
          </tr>
        )
      })
    ])
  }, [residentsData?.data])

  const handleShowModal = () => setShowModal(old => !old)

  return (
    <section className="content-wrap">
      <h1 className="content-title">
        {buildingName ? `${buildingName} Resident List` : null}
      </h1>
      <div className="flex items-center justify-end mt-12 w-full">
        <div className="flex items-center justify-between w-8/12 flex-row">
          <FormSelect
            className="mr-2"
            options={floorOptions}
            defaultValue={floorOptions[0]}
            onChange={floor => setSelectedFloor(floor.value)}
          />
          <FormSelect
            className="mr-2"
            options={accountTypes}
            defaultValue={accountTypes[0]}
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

      <Card
        noPadding
        header={
          <div className="flex items-center justify-between">
            <h1 className="font-bold text-lg">Residents</h1>
            <div className="flex items-center">
              <Can
                perform="residents:create"
                yes={
                  <Button
                    default
                    leftIcon={<FaPlusCircle />}
                    label="Add Resident"
                    onClick={handleShowModal}
                  />
                }
              />
            </div>
          </div>
        }
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
            emptyText={
              <NotifCard
                icon={<i className="ciergio-user" />}
                header="No residents yet"
                content="Sorry, this building don't have any residents yet."
              />
            }
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
