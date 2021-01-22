import { useState, useEffect, useMemo } from 'react'
import styles from './Main.module.css'
import SearchControl from '@app/components/globals/SearchControl'
import SelectCategory from '@app/components/globals/SelectCategory'
import FormSelect from '@app/components/globals/FormSelect'
import Table from '@app/components/table'
import Pagination from '@app/components/pagination'
import Button from '@app/components/button'
import Card from '@app/components/card'
import FormInput from '@app/components/forms/form-input'
import DatePicker from '@app/components/forms/form-datepicker/'
import Modal from '@app/components/modal'
import { gql, useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import P from 'prop-types'

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
      }
    }
  }
`

function Unsent({ month, year }) {
  // router
  const router = useRouter()

  // components state
  const [selectedFloor, setSelectedFloor] = useState('')
  const [searchText, setSearchText] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showModal, setShowModal] = useState(false)
  const [dues, setDues] = useState()
  const [floors, setFloors] = useState([])

  // Pagination states
  const [activePage, setActivePage] = useState(1)
  const [limitPage, setLimitPage] = useState(10)
  const [offsetPage, setOffsetPage] = useState(0)
  const [count, setCount] = useState({})

  // graphQLFetching
  const { loading, data, error, refetch } = useQuery(GET_UNSENT_DUES_QUERY, {
    variables: {
      unit: {
        buildingId: '5d804d6543df5f4239e72911',
        search: searchText
      },
      filter: {
        sent: false
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

  const {
    loading: loadingFloorNumbers,
    error: errorGetAllFloors,
    data: dataAllFloors
  } = useQuery(GET_ALL_FLOORS, {
    variables: {
      buildingId: '5d804d6543df5f4239e72911'
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
            const name = `${floor?.unitOwner?.user?.lastName},
              ${
                floor?.unitOwner?.user?.lastName &&
                floor?.unitOwner?.user?.lastName.charAt(0)
              }`
            const unitOwnerName = name
            const uploadFile = (
              <Button default full label="Choose File" onClick={handleModal} />
            )
            const amount = (
              <FormInput name={'amount'} type="text" placeholder="0.0" />
            )
            const dueDate = (
              <DatePicker
                minDate={new Date()}
                date={selectedDate}
                handleChange={handleChangeDate}
              />
            )

            const sendButton = <Button default disabled label="Send" />
            const rowData = []
            let copyOfOtherData = []
            if (copyOfFloorNumber !== floorNumber) {
              rowData.push(floorNumber, '', '', '', '', '', '')
              copyOfOtherData.push(
                '',
                unitName,
                unitOwnerName,
                uploadFile,
                amount,
                dueDate,
                sendButton
              )
            } else {
              copyOfOtherData = []
              rowData.push(
                '',
                unitName,
                unitOwnerName,
                uploadFile,
                amount,
                dueDate,
                sendButton
              )
            }
            copyOfFloorNumber = floorNumber

            if (copyOfOtherData.length <= 0) {
              return { ...rowData, ...copyOfOtherData }
            } else {
              return { ...rowData }
            }
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

  const handleModal = () => setShowModal(show => !show)

  const handleCloseModal = () => {
    handleModal()
  }
  const handleOkModal = () => {
    handleCloseModal()
  }

  const handleChangeDate = date => {
    setSelectedDate(date)
  }

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

  //   Select Floors onchange
  const onFloorSelect = e => {}
  // =============

  // ============

  // Handle Searches
  const onSearch = e => {
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
                Bills sent{' '}
                <span className={styles.BoldText}>{count?.sent}</span>/
                {count?.all} bills
              </div>
            </div>
          </div>
        }
        content={<Table rowNames={tableRowData} items={dues} />}
      />
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
            minDate={new Date()}
            date={selectedDate}
            handleChange={handleChangeDate}
            containerClassname={'flex md:w-1/6 justify-center '}
          />
        </div>
      </Modal>
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

Unsent.propTypes = {
  month: P.number.isRequired,
  year: P.number.isRequired
}

export default Unsent
