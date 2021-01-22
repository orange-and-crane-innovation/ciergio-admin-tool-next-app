import { useState, useEffect } from 'react'
import styles from './Main.module.css'
import SearchControl from '@app/components/globals/SearchControl'
import SelectCategory from '@app/components/globals/SelectCategory'

import Table from '@app/components/table'
import Pagination from '@app/components/pagination'
import Button from '@app/components/button'
import Card from '@app/components/card'
import FormSelect from '@app/components/globals/FormSelect'
import { FaEye } from 'react-icons/fa'
import { gql, useQuery } from '@apollo/client'
import P from 'prop-types'
import Link from 'next/link'

const statusOptions = [
  {
    label: 'All Status',
    value: 'all'
  },
  {
    label: 'Paid',
    value: 'paid'
  },
  {
    label: 'Unpaid',
    value: 'unpaid'
  }
]

const GET_ALL_FLOORS = gql`
  query getFloorNUmbers($buildingId: String!) {
    getFloorNumbers(buildingId: $buildingId)
  }
`

const GETDEUS_QUERY = gql`
  query getDues($where: DuesQueryInput) {
    getDues(where: $where) {
      count {
        all
        seen
        sent
      }
    }
  }
`

const GET_DUES_PER_UNIT_SENT = gql`
  query(
    $unit: DuesPerUnitInput2
    $filter: DuesPerUnitInput3
    $dues: DuesPerUnitInput1
    $offset: Int
    $limit: Int
  ) {
    getDuesPerUnit(
      unit: $unit
      filter: $filter
      limit: $limit
      offset: $offset
      dues: $dues
    ) {
      count
      limit
      offset
      data {
        dues {
          attachment {
            fileUrl
            fileUrl
          }
          dueDate
          status
          views {
            count
          }
        }

        floorNumber
        name
        unitOwner {
          user {
            firstName
            lastName
          }
        }
      }
    }
  }
`

function useKeyPress(targetKey) {
  // State for keeping track of whether key is pressed
  const [keyPressed, setKeyPressed] = useState(false)

  // If pressed key is our target key then set to true
  function downHandler({ key }) {
    if (key === targetKey) {
      setKeyPressed(true)
    }
  }

  // If released key is our target key then set to false
  const upHandler = ({ key }) => {
    if (key === targetKey) {
      setKeyPressed(false)
    }
  }

  // Add event listeners
  useEffect(() => {
    window.addEventListener('keydown', downHandler)
    window.addEventListener('keyup', upHandler)
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('keydown', downHandler)
      window.removeEventListener('keyup', upHandler)
    }
  }, []) // Empty array ensures that effect is only run on mount and unmount

  return keyPressed
}

function Sent({ month, year }) {
  const [limitPage, setLimitPage] = useState(10)
  const [activePage, setActivePage] = useState(1)
  const [offsetPage, setOffsetPage] = useState(0)
  const [dues, setDues] = useState()
  const [floors, setFloors] = useState([])
  const [count, setCount] = useState({
    all: 0,
    seen: 0
  })

  const keyPress = useKeyPress('')

  const [searchText, setSearchText] = useState(null)

  // graphQLFetching
  const { loading, data, error, refetch } = useQuery(GET_DUES_PER_UNIT_SENT, {
    variables: {
      unit: {
        buildingId: '5d804d6543df5f4239e72911',
        search: searchText
      },
      filter: {
        sent: true
      },
      dues: {
        period: {
          month,
          year
        }
      },
      limit: limitPage,
      offset: offsetPage
    }
  })

  const { loading: duesLoading, data: duesData, error: duesError } = useQuery(
    GETDEUS_QUERY,
    {
      variables: {
        where: {
          sent: true,
          buildingId: '5d804d6543df5f4239e72911',
          period: {
            month,
            year
          }
        }
      }
    }
  )

  useEffect(() => {
    if (!duesLoading) {
      setCount({ ...count, ...duesData?.getDues?.count })
    }
  }, [duesLoading, duesData, duesError])

  const {
    loading: loadingFloorNumbers,
    error: errorGetAllFloors,
    data: dataAllFloors
  } = useQuery(GET_ALL_FLOORS, {
    variables: {
      buildingId: '5d804d6543df5f4239e72911'
    }
  })

  const tableRowData = [
    {
      name: 'Seen',
      width: '10%'
    },
    {
      name: 'Unit',
      width: '10%'
    },
    {
      name: 'Unit Owner',
      width: '15%'
    },
    {
      name: 'Upload File',
      width: '15%'
    },
    {
      name: 'Amount (Optional)',
      width: '20%'
    },
    {
      name: 'Due Date',
      width: '15%'
    },
    {
      name: 'Paid',
      width: '15%'
    }
  ]

  // Component did mount for generating table data
  useEffect(() => {
    let copyOfFloorNumber = null

    if (!loading && data) {
      const duesData = {
        count: data?.getDuesPerUnit.count || 0,
        limit: data?.getDuesPerUnit.limit || 0,
        offset: data?.getDuesPerUnit.offset || 0,
        data:
          data?.getDuesPerUnit?.data.map((floor, index) => {
            const floorNumber = floor?.floorNumber
            const unitName = floor?.name
            const name = `${floor?.unitOwner?.user?.lastName}
              ${floor?.unitOwner?.user?.lastName}`
            const unitOwnerName = name
            const uploadedFile = (
              <a href={floor?.dues?.attachment?.fileUrl}>View File</a>
            )
            const amount = floor?.dues?.amount
            const dueDate = floor?.dues?.dueDate

            const status = floor?.dues?.status
            const seen = floor?.dues?.views?.count > 0 ? <FaEye /> : null
            const rowData = []

            if (copyOfFloorNumber !== floorNumber) {
              rowData.push(floorNumber, '', '', '', '', '', '')
            } else {
              rowData.push(
                seen,
                unitName,
                unitOwnerName,
                uploadedFile,
                amount,
                dueDate,
                status
              )
            }
            copyOfFloorNumber = floorNumber

            return { ...rowData }
          }) || null
      }

      setDues(duesData)
    }
  }, [loading, data, error])

  useEffect(() => {
    let optionsData = [
      {
        label: '',
        value: ''
      }
    ]
    if (!loading && dataAllFloors) {
      optionsData = dataAllFloors?.getFloorNumbers.map(floor => {
        return { label: floor, value: floor }
      })
    }

    setFloors(optionsData)
  }, [loadingFloorNumbers, errorGetAllFloors, dataAllFloors])

  //   Select Floors onchange
  const onFloorSelect = e => {}
  // =============

  // Handle Searches
  const onSearch = e => {
    if (keyPress) {
      alert(e.target.value)
    }
    if (e.target.value === '') {
      setSearchText(null)
    } else {
      setSearchText(e.target.value)
    }
  }

  // ==========

  // Clear searches
  const onClearSearch = e => {
    setSearchText(null)
  }
  // ==============

  // Click pagination
  const onPageClick = e => {
    setActivePage(e)
    setOffsetPage(limitPage * (e - 1))
  }

  // setting limit in pagination
  const onLimitChange = e => {
    setLimitPage(Number(e.target.value))
  }

  // We will refetch the post one time
  const handleKeyDown = e => {
    alert('asdasd')
  }

  return (
    <>
      <div className={styles.FormContainer}>
        <div className={styles.StatusFloorControl}>
          <FormSelect
            onChange={onFloorSelect}
            options={statusOptions}
            classNames="mb-4"
          />
          <FormSelect
            placeholder="All Floors"
            onChange={onFloorSelect}
            options={floors}
            classNames="mb-4"
          />
          <SearchControl
            placeholder="Search by unit"
            searchText={searchText}
            onSearch={onSearch}
            onClearSearch={onClearSearch}
            className={styles.SearchControl}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>

      <Card
        noPadding
        header={
          <div className={styles.ContentFlex}>
            <span className={styles.CardHeader}>My Dues</span>
            <div className={styles.InfoViewText}>
              <FaEye />
              <div>
                Bills viewed{' '}
                <span className={styles.BoldText}>{count?.seen}</span>/
                {count?.all}
                bills
              </div>
            </div>
          </div>
        }
        content={<Table rowNames={tableRowData} items={dues} />}
      />
      {!loading && dues && (
        <Pagination
          items={dues}
          activePage={activePage}
          onPageClick={onPageClick}
          onLimitChange={onLimitChange}
        />
      )}
    </>
  )
}

Sent.prototype = {
  month: P.number.isRequired,
  year: P.number.isRequired
}

export default Sent
