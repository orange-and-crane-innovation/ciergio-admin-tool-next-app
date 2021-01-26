import { useState, useEffect } from 'react'
import styles from './Main.module.css'
import SearchControl from '@app/components/globals/SearchControl'
import Button from '@app/components/button'
import Dropdown from '@app/components/dropdown'
import Table from '@app/components/table'
import Pagination from '@app/components/pagination'
import Card from '@app/components/card'
import FormSelect from '@app/components/globals/FormSelect'
import { FaEye, FaEllipsisH, FaPencilAlt, FaRegFileAlt } from 'react-icons/fa'
import { gql, useQuery } from '@apollo/client'
import P from 'prop-types'
import { toFriendlyDate } from '@app/utils/date'
import Modal from '@app/components/modal'
import useKeyPress from '@app/utils/useKeyPress'
import HistoryBills from './Cards/HistoryBills'

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
          }
          amount
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

const statusOptions = [
  {
    label: 'All Status',
    value: 'null'
  },
  {
    label: 'Paid',
    value: 'settled'
  },
  {
    label: 'Unpaid',
    value: 'unpaid'
  }
]

const tableRowData = [
  {
    name: 'Floor',
    width: '10%'
  },
  {
    name: 'Seen',
    width: '5%'
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
    name: 'Amount ',
    width: '10%'
  },
  {
    name: 'Due Date',
    width: '20%'
  },
  {
    name: 'Paid',
    width: '10%'
  },
  {
    name: '',
    width: '10%'
  }
]

function Sent({ month, year }) {
  const [limitPage, setLimitPage] = useState(10)
  const [activePage, setActivePage] = useState(1)
  const [offsetPage, setOffsetPage] = useState(0)
  const [dues, setDues] = useState()
  const [floors, setFloors] = useState([])
  const [floorNumber, setFloorNumber] = useState('all')
  const [count, setCount] = useState({
    all: 0,
    seen: 0
  })
  const [modalTitle, setModalTitle] = useState('')
  const [modalContent, setModalContent] = useState()
  const [showModal, setShowModal] = useState(false)
  const [searchText, setSearchText] = useState(null)
  const [search, setSearch] = useState(null)

  const keyPressed = useKeyPress('Enter')
  // graphQLFetching
  const { loading, data, error } = useQuery(GET_DUES_PER_UNIT_SENT, {
    variables: {
      unit: {
        buildingId: '5d804d6543df5f4239e72911',
        search: search,
        floorNumber: floorNumber
      },
      filter: {
        sent: true
      },
      dues: {
        period: {
          month: month,
          year: year
        }
      },
      limit: 10,
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

  const {
    loading: loadingFloorNumbers,
    error: errorGetAllFloors,
    data: dataAllFloors
  } = useQuery(GET_ALL_FLOORS, {
    variables: {
      buildingId: '5d804d6543df5f4239e72911'
    }
  })

  useEffect(() => {
    if (!duesLoading) {
      setCount(preState => ({ ...preState, ...duesData?.getDues?.count }))
    }
  }, [duesLoading, duesData, duesError])

  const handleShowModal = (type, id) => {
    if (id === 1) {
      setShowModal(old => !old)
    }
  }

  const handleClearModal = () => {
    handleShowModal()
  }
  // Hooks for formatting table row
  const useTableRows = rows => {
    const rowData = []
    let num = 0
    const dropdownData = [
      {
        label: 'Update Bills',
        icon: <FaPencilAlt />,
        function: () => handleShowModal('update', 1)
      },
      {
        label: 'Bills Details',
        icon: <FaRegFileAlt />,
        function: () => handleShowModal('details', 1)
      }
    ]
    if (rows.length > 0 && rows) {
      rows.forEach(row => {
        if (num !== row.floorNumber) {
          rowData.push({
            floorNumber: row.floorNumber,
            b: '',
            bl: '',
            bla: '',
            blan: '',
            blank: '',
            blankrow: '',
            blankrowspa: '',
            blankrowspan: ''
          })
        }

        const attachment = (
          <a
            href={row?.dues[0]?.attachment.fileUrl}
            className={styles.fileLink}
          >
            View File
          </a>
        )

        for (let i = 0; i <= row?.dues.length; i++) {
          const amount = `₱${row?.dues[i]?.amount.toFixed(2)}`
          const status =
            row?.dues[i]?.status === 'overdue' || row?.dues[i]?.status === 'due'
              ? 'unpaid'
              : 'paid'
          const seen = row?.dues[i]?.views.count ? <FaEye /> : null
          const dueDate = toFriendlyDate(row?.dues[i]?.dueDate)
          const unitName = row?.name
          const unitOwner = `${row?.unitOwner?.user?.lastName},
          ${row?.unitOwner?.user?.lastName.charAt(0)}`
          const dropDown = (
            <Dropdown label={<FaEllipsisH />} items={dropdownData} />
          )
          rowData.push({
            floor: '',
            seen,
            unitName,
            unitOwner,
            attachment,
            amount,
            dueDate,
            status,
            dropDown
          })
        }

        num = row.floorNumber
      })
    }
    return rowData
  }

  const table = useTableRows(!loading && data && data?.getDuesPerUnit?.data)
  // Component did mount for generating table data
  useEffect(() => {
    if (!loading && data) {
      const duesData = {
        count: data?.getDuesPerUnit.count || 0,
        limit: data?.getDuesPerUnit.limit || 0,
        offset: data?.getDuesPerUnit.offset || 0,
        data: table
      }

      setDues(duesData)
    }
  }, [loading, data, error, table])

  useEffect(() => {
    let optionsData = [
      {
        label: '',
        value: ''
      }
    ]
    if (!loadingFloorNumbers) {
      optionsData = dataAllFloors?.getFloorNumbers.map(floor => {
        return { label: floor, value: floor }
      })
    }

    setFloors(optionsData)
  }, [loadingFloorNumbers, errorGetAllFloors, dataAllFloors])

  //   Select Floors onchange
  const onFloorSelect = e => {
    setFloorNumber(e.target.value.toString())
  }
  // =============

  const onStatusSelect = e => {
    setFloorNumber(e.target.value)
  }

  // useEffect for useKeyPress
  useEffect(() => {
    if (keyPressed) {
      setSearch(searchText)
    }
  }, [keyPressed, searchText])
  // ============

  // Handle Searches
  const onSearch = e => {
    if (e.target.value === '') {
      setSearch(null)
    } else {
      setSearchText(e.target.value)
    }
  }

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
            onChange={onStatusSelect}
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
                Bills viewed &nbsp;
                <span className={styles.BoldText}>{count?.seen}</span>/
                {count?.all}
                &nbsp;bills
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

      <Modal
        title={'sample title'}
        visible={showModal}
        onClose={handleClearModal}
        footer={null}
      >
        <div className="w-full">
          <h1>Hello</h1>
        </div>
      </Modal>
    </>
  )
}

Sent.prototype = {
  month: P.number.isRequired,
  year: P.number.isRequired
}

export default Sent
