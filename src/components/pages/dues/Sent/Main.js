import { useState, useEffect } from 'react'
import styles from './Main.module.css'
import SearchControl from '@app/components/globals/SearchControl'
import SelectCategory from '@app/components/globals/SelectCategory'

import Table from '@app/components/table'
import Pagination from '@app/components/pagination'
import Button from '@app/components/button'
import Card from '@app/components/card'
import FormSelect from '@app/components/forms/form-select'
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

const GETDEUS_QUERY = gql`
  query ($where: {
    getDues(
      where: {
        buildingId: "5d804d6543df5f4239e72911"
        period: { month: 1, year: 2020 }
      }
    ) {
      count {
        all
        seen
        sent
        units {
          all
          withResidents
        }
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

function Sent({ month, year }) {
  const [selectedFloor, setSelectedFloor] = useState('')
  const [searchText, setSearchText] = useState('')
  const [limitPage, setLimitPage] = useState(10)
  const [activePage, setActivePage] = useState(1)
  const [offsetPage, setOffsetPage] = useState(0)
  const [dues, setDues] = useState()

  // graphQLFetching
  const { loading, data, error, refetch: refetchPosts } = useQuery(
    GET_DUES_PER_UNIT_SENT,
    {
      variables: {
        unit: {
          buildingId: '5d804d6543df5f4239e72911'
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
    }
  )

  const { loading: duesLoading, data: duesData, error: duesError } = useQuery(
    GETDEUS_QUERY,
    {
      variables: {}
    }
  )

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
      console.log(data)
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

  //   Select Floors onchange
  const onFloorSelect = e => {}
  // =============

  //  Select Floors On Clear Category
  const onClearFloor = e => {}
  // ============

  // Handle Searches
  const onSearch = e => {}
  // ==========

  // Clear searches
  const onClearSearch = e => {}
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

  return (
    <>
      <div className={styles.FormContainer}>
        <div className={styles.StatusFloorControl}>
          <FormSelect options={statusOptions} />
          <SelectCategory
            type="post"
            userType="administrators"
            onChange={onFloorSelect}
            onClear={onClearFloor}
            selected={selectedFloor}
          />
          <SearchControl
            placeholder="Search by title"
            searchText={searchText}
            onSearch={onSearch}
            onClearSearch={onClearSearch}
            className={styles.SearchControl}
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
                Bill viewed <span className={styles.BoldText}>0</span>/0 units
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
