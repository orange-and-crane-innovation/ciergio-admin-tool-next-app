import { useState, useEffect } from 'react'
import styles from './Main.module.css'
import SearchControl from '@app/components/globals/SearchControl'
import SelectCategory from '@app/components/globals/SelectCategory'
import Table from '@app/components/table'
import Pagination from '@app/components/pagination'
import Button from '@app/components/button'
import Card from '@app/components/card'
import FormInput from '@app/components/forms/form-input'
import DatePicker from '@app/components/forms/form-datepicker/'
import Modal from '@app/components/modal'
import { gql, useQuery } from '@apollo/client'
import P from 'prop-types'
// import { useRouter } from 'next/router'

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

function Unsent({ month, year }) {
  // router
  // const router = useRouter()

  // components state
  const [selectedCategory] = useState('')
  const [searchText] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showModal, setShowModal] = useState(false)
  const [dues, setDues] = useState()

  // Pagination states
  const [activePage, setActivePage] = useState(1)
  const [limitPage, setLimitPage] = useState(10)
  const [offsetPage, setOffsetPage] = useState(0)

  // graphQLFetching
  const { loading, data, error } = useQuery(GET_UNSENT_DUES_QUERY, {
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
  })

  useEffect(() => {
    console.log(month, year)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, data, error])

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
  const onCategorySelect = e => {}
  // =============

  //  Select Floors On Clear Category
  const onClearCategory = e => {}
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
          <SelectCategory
            type="post"
            userType="administrators"
            onChange={onCategorySelect}
            onClear={onClearCategory}
            selected={selectedCategory}
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
                Bill sent <span className={styles.BoldText}>0</span>/17 units
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
