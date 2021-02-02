import React, { useState, useEffect, useRef } from 'react'
import styles from './Main.module.css'
import SearchControl from '@app/components/globals/SearchControl'
import FormSelect from '@app/components/globals/FormSelect'
import Table from '@app/components/table'
import Pagination from '@app/components/pagination'
import Button from '@app/components/button'
import FileUpload from '@app/components/forms/form-fileupload'
import Card from '@app/components/card'
import PageLoader from '@app/components/page-loader'
import FormInput from '@app/components/forms/form-input'
import DatePicker from '@app/components/forms/form-datepicker/'
import Modal from '@app/components/modal'
import { useQuery } from '@apollo/client'
import P from 'prop-types'
import useKeyPress from '@app/utils/useKeyPress'
import * as Query from './Query.js'
import axios from 'axios'

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

// const validationSchema = yup.object().shape({
//   unitName: yup.string().required(),
//   unitOwnerFirstName: yup.string().required(),
//   unitOwnerLastName: yup.string().required(),
//   file: yup
//     .object()
//     .shape({
//       name: yup.string().required()
//     })
//     .required(),
//   amount: yup.number().required(),
//   dueDate: yup.date().min(yup.ref('startDate'), "date should start based on the due billing date")
// })

function Unsent({ month, year }) {
  // router
  // const router = useRouter()

  // components state
  const [selectedFloor, setSelectedFloor] = useState('all')
  const [searchText, setSearchText] = useState(null)
  const [search, setSearch] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [dues, setDues] = useState()
  const [floors, setFloors] = useState([])

  // Pagination states
  const [activePage, setActivePage] = useState(1)
  const [limitPage, setLimitPage] = useState(10)
  const [offsetPage, setOffsetPage] = useState(0)
  const [count, setCount] = useState({})
  const keyPressed = useKeyPress('Enter')
  const [modalDate, setModalDate] = useState(null)
  const [date, setDate] = useState(null)
  const [amountValue, setAmountValue] = useState()

  const [fileUrl, setFileUrl] = useState()
  const [loader, setLoader] = useState(false)
  const [fileUploadedData, setFileUploadedData] = useState()
  const ref = useRef(null)
  const [perDate, setPerDate] = useState([
    {
      date: new Date()
    }
  ])

  const temporaryBuildingID = '5d804d6543df5f4239e72911'

  // graphQLFetching
  const { loading, data, error } = useQuery(Query.GET_UNSENT_DUES_QUERY, {
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
  } = useQuery(Query.GET_ALL_FLOORS, {
    variables: {
      buildingId: temporaryBuildingID
    }
  })

  const { loading: duesLoading, data: duesData, error: duesError } = useQuery(
    Query.GETDEUS_QUERY,
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

  useEffect(() => {
    const today = new Date()
    const formatTodate = `${month}-${String(today.getDate()).padStart(
      2,
      '0'
    )}-${year}`
    setDate(formatTodate)
  }, [month, year])

  const onChangeOfAmount = e => {
    setAmountValue(e.target.value)
  }

  const handleChangeDate = date => {
    console.log(ref.current)

    if (date) {
      setSelectedDate(date)
    }
  }

  const handleModalChangeDate = date => {
    setModalDate(date)
  }

  useEffect(() => {
    console.log(fileUploadedData)
  }, [fileUploadedData])

  const uploadApi = async payload => {
    const response = await axios.post(
      process.env.NEXT_PUBLIC_UPLOAD_API,
      payload,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )

    if (response.data) {
      const imageData = response.data.map(item => {
        return {
          url: item.location,
          type: item.mimetype
        }
      })

      setFileUploadedData(imageData)
    }
  }

  const handleFile = file => {
    const formData = new FormData()

    setLoader(true)
    if (file) {
      formData.append('file', file)
      setLoader(false)

      uploadApi(formData)
    }
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
          <FileUpload
            label="Upload File"
            getFile={handleFile}
            loading={loader}
            maxSize={5}
            key={index}
          />
        )
        const amount = (
          <FormInput
            onChange={onChangeOfAmount}
            name="amount"
            type="text"
            placeholder="0.0"
            key={index}
            value={amountValue}
          />
        )
        const sendButton = <Button full default disabled label="Send" />

        const dueDate = (
          <DatePicker
            id={index}
            disabledPreviousDate={date && date}
            date={perDate[index]?.date}
            onChange={handleChangeDate}
            key={index}
            placeHolder="Date"
            inputRef={ref}
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
  }, [loading, data, error, selectedDate, date])

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
    setSelectedDate(modalDate)
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
        content={
          loading ? (
            <PageLoader />
          ) : (
            <Table rowNames={tableRowData} items={dues} />
          )
        }
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
        <div className="w-full flex flex-col p-4">
          <DatePicker
            rightIcon
            disabledPreviousDate={date && date}
            date={modalDate}
            onChange={handleModalChangeDate}
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
