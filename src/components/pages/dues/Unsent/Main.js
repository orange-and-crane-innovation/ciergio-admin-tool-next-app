import { useState, useEffect } from 'react'
import styles from './Main.module.css'
import SearchControl from '@app/components/globals/SearchControl'
import FormSelect from '@app/components/globals/FormSelect'
import Table from '@app/components/table'
import Pagination from '@app/components/pagination'
import Button from '@app/components/button'
import Card from '@app/components/card'
import FormInput from '@app/components/forms/form-input'
import DatePicker from '@app/components/forms/form-datepicker/'
import Modal from '@app/components/modal'
import { gql, useQuery } from '@apollo/client'
import P from 'prop-types'
import useKeyPress from '@app/utils/useKeyPress'

const GET_UNSENT_DUES_QUERY = gql`
  query getDuesPerUnit(
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
        floorNumber
        name
        unitType {
          name
        }
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
        units {
          all
          withResidents
        }
      }
    }
  }
`

const tableRowData = [
  {
    name: '',
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
    name: '',
    width: '15%'
  }
]

function Unsent({ month, year }) {
  // router
  // const router = useRouter()

  // components state
  const [selectedFloor, setSelectedFloor] = useState('all')
  const [searchText, setSearchText] = useState(null)
  const [search, setSearch] = useState(null)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showModal, setShowModal] = useState(false)
  const [dues, setDues] = useState()
  const [floors, setFloors] = useState([])

  // Pagination states
  const [activePage, setActivePage] = useState(1)
  const [limitPage, setLimitPage] = useState(10)
  const [offsetPage, setOffsetPage] = useState(0)
  const [count, setCount] = useState({})
  const keyPressed = useKeyPress('Enter')

  const [amountValue, setAmountValue] = useState()

  const temporaryBuildingID = '5d804d6543df5f4239e72911'

  // graphQLFetching
  const { loading, data, error } = useQuery(GET_UNSENT_DUES_QUERY, {
    variables: {
      unit: {
        buildingId: temporaryBuildingID,
        search,
        floorNumber: selectedFloor
      },
      filter: { sent: false },
      dues: {
        period: {
          month: month,
          year: year
        }
      },
      offset: offsetPage,
      limit: limitPage
    }
  })

  const {
    loading: loadingFloorNumbers,
    error: errorGetAllFloors,
    data: dataAllFloors
  } = useQuery(GET_ALL_FLOORS, {
    variables: {
      buildingId: temporaryBuildingID
    }
  })

  const { loading: duesLoading, data: duesData, error: duesError } = useQuery(
    GETDEUS_QUERY,
    {
      variables: {
        where: {
          buildingId: temporaryBuildingID,
          sent: false
        }
      }
    }
  )

  useEffect(() => {
    if (!duesLoading && duesData) {
      setCount(prevState => ({ ...prevState, ...duesData?.getDues?.count }))
    }
  }, [duesLoading, duesData, duesError])

  const onChangeOfAmount = e => {
    setAmountValue(e.target.value)
  }

  const handleChangeDate = date => {
    setSelectedDate(date)
  }

  // Hooks for formatting table row
  const useTableRows = rows => {
    const rowData = []
    let num = 0
    if (rows) {
      rows.forEach((row, index) => {
        if (num !== row.floorNumber) {
          rowData.push({
            floorNumber: row.floorNumber,
            b: '',
            bl: '',
            bla: '',
            blan: '',
            blank: '',
            blankrow: ''
          })
        }
        const unitName = row.name
        const unitOwner = `${row?.unitOwner?.user?.lastName},
        ${row?.unitOwner?.user?.lastName.charAt(0)}`
        const uploadFile = (
          <Button
            key={index}
            default
            label="Choose File"
            onClick={handleModal}
          />
        )
        const amount = (
          <FormInput
            onChange={onChangeOfAmount}
            name={'amount'}
            type="text"
            placeholder="0.0"
            key={index}
            value={amountValue}
          />
        )
        const sendButton = <Button default disabled label="Send" />
        const dueDate = (
          <DatePicker
            disabledPreviousDate={new Date()}
            date={selectedDate}
            onChange={handleChangeDate}
            key={index}
          />
        )

        rowData.push({
          blank: '',
          unitName,
          unitOwner,
          uploadFile,
          amount,
          dueDate,
          sendButton
        })
        num = row.floorNumber
      })
    }
    return rowData
  }

  const table = useTableRows(!loading && data && data?.getDuesPerUnit?.data)

  useEffect(() => {
    if (!loading && !error && data) {
      const duesTable = {
        count: data?.getDuesPerUnit.count || 0,
        limit: data?.getDuesPerUnit.limit || 0,
        offset: data?.getDuesPerUnit.offset || 0,
        data: table || []
      }
      setDues(duesTable)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, data, error])

  useEffect(() => {
    let optionsData = [
      {
        label: '',
        value: ''
      }
    ]
    if (!loadingFloorNumbers && !errorGetAllFloors) {
      optionsData = dataAllFloors?.getFloorNumbers.map(floor => {
        return { label: floor, value: floor }
      })
    }

    setFloors(optionsData)
  }, [loadingFloorNumbers, dataAllFloors, errorGetAllFloors])

  const handleModal = () => setShowModal(show => !show)

  const handleCloseModal = () => {
    handleModal()
  }
  const handleOkModal = () => {
    handleCloseModal()
  }

  //   Select Floors onchange
  const onFloorSelect = e => {
    setSelectedFloor(e.target.value)
  }
  // =============

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
    setLimitPage(parseInt(e.target.value))
  }

  const calendarIcon = () => <span className="ciergio-calendar"></span>

  return (
    <>
      <div className={styles.FormContainer}>
        <div className={styles.DueDateControl}>
          <Button
            primary
            label="Apply Due Dates to All Units"
            leftIcon={calendarIcon()}
            onClick={handleModal}
          />
        </div>
        <div className={styles.FloorControl}>
          <FormSelect
            onChange={onFloorSelect}
            options={floors}
            classNames="mb-4"
            placeholder="All Floors"
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
              <span className="ciergio-dues"></span>
              <div>
                Bills Sent &nbsp;
                <span className={styles.BoldText}> {count?.sent}</span>/
                {count?.units?.withResidents} bills
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
        title="Set Due Date"
        okText="Apply"
        visible={showModal}
        onClose={handleCloseModal}
        onCancel={handleCloseModal}
        onOk={handleOkModal}
      >
        <div className="w-full flex flex-col">
          <DatePicker
            disabledPreviousDate={new Date()}
            date={selectedDate}
            onChange={handleChangeDate}
            containerClassname={'flex w-full justify-center '}
          />
        </div>
      </Modal>
    </>
  )
}

Unsent.propTypes = {
  month: P.number.isRequired,
  year: P.number.isRequired
}

export default Unsent
