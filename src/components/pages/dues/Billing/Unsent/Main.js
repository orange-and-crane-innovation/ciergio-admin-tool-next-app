import React, { useState, useEffect, useMemo } from 'react'
import styles from './Main.module.css'
import SearchControl from '@app/components/globals/SearchControl'
import FormSelect from '@app/components/forms/form-select'
import Table from '@app/components/table'
import Pagination from '@app/components/pagination'
import Button from '@app/components/button'
import FileUpload from '@app/components/forms/form-fileupload'
import Card from '@app/components/card'
import PageLoader from '@app/components/page-loader'
import FormInput from '@app/components/forms/form-input'
import DatePicker from '@app/components/forms/form-datepicker/'
import Modal from '@app/components/modal'
import showToast from '@app/utils/toast'
import { useQuery, useMutation } from '@apollo/client'
import P from 'prop-types'
import useKeyPress from '@app/utils/useKeyPress'
import * as Query from './Query.js'
import axios from 'axios'
import * as Mutation from './Mutation'
import { FaCheck, FaExclamation } from 'react-icons/fa'
import { useRouter } from 'next/router'
import { DateInput } from '@app/components/datetime'

import Can from '@app/permissions/can'

const _ = require('lodash')

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

const DueDate = ({ fieldData }) => {
  const [selectedDate, setSelectedDate] = useState(null)

  useEffect(() => {
    if (fieldData.value.length === 0) {
      setSelectedDate(null)
    } else {
      fieldData.value.forEach((val, index) => {
        const data = fieldData.value[index]

        if (Object.keys(data)[0] === 'all') {
          setSelectedDate(data.all)
        } else if (Object.keys(data)[0] === fieldData?.Name) {
          setSelectedDate(data)
        }
      })
    }
  }, [fieldData])

  return (
    <DatePicker
      rightIcon
      date={selectedDate ? selectedDate[fieldData.Name] : null}
      placeHolder="Date"
      disabledPreviousDate={fieldData.minDate}
      onChange={(value, event) => {
        event.target = { type: 'text', value: value, name: fieldData.Name }
        fieldData.ChangeHandler(event)
      }}
    />
  )
}

function Unsent({ month, year, buildingName }) {
  const router = useRouter()
  const { buildingID, categoryID } = router.query
  // components state
  const [selectedFloor, setSelectedFloor] = useState('all')
  const [searchText, setSearchText] = useState(null)
  const [search, setSearch] = useState(null)

  const [showModal, setShowModal] = useState(false)

  const [floors, setFloors] = useState([])

  // Pagination states
  const [activePage, setActivePage] = useState(1)
  const [limitPage, setLimitPage] = useState(10)
  const [offsetPage, setOffsetPage] = useState(0)
  const [count, setCount] = useState({})
  const keyPressed = useKeyPress('Enter')
  const [modalDate, setModalDate] = useState(null)
  const [date, setDate] = useState(null)

  const [isSent, setIsSent] = useState({})
  const [notSent, setNotSent] = useState({})
  const [loader, setLoader] = useState(false)
  const [fileUploadedData, setFileUploadedData] = useState({})
  const [datePerRow, setDatePerRow] = useState({})
  const [sentLoading, setSentLoading] = useState(false)
  const [period, setPeriod] = useState({
    month: month,
    year: year
  })
  const title = `${buildingName} ${month} - ${year}`
  const [amountPerRow, setAmountPerRow] = useState({})
  const [perDate, setPerDate] = useState([])
  const [companyIdPerRow, setCompanyIdPerRow] = useState({})
  const [complexIDPerRow, setComplexIdPerRow] = useState({})
  const [unitIdPerRow, setUnitIdPerRow] = useState({})
  const [idRow, setIdRow] = useState()

  const [
    createDues,
    {
      loading: loadingCreatingDues,
      called: calledCreatingDues,
      data: dataCreatingDues
    }
  ] = useMutation(Mutation.CREATE_DUES)

  // graphQLFetching
  const { loading, data, error, refetch } = useQuery(
    Query.GET_UNSENT_DUES_QUERY,
    {
      variables: {
        unit: {
          buildingId: buildingID,
          search,
          floorNumber: String(selectedFloor)
        },
        filter: { sent: false },
        dues: {
          categoryId: categoryID,
          period: {
            month: month,
            year: year
          }
        },
        offset: offsetPage,
        limit: limitPage
      }
    }
  )

  const {
    loading: loadingFloorNumbers,
    error: errorGetAllFloors,
    data: dataAllFloors
  } = useQuery(Query.GET_ALL_FLOORS, {
    variables: {
      buildingId: buildingID
    }
  })

  const { loading: duesLoading, data: duesData, error: duesError } = useQuery(
    Query.GETDEUS_QUERY,
    {
      variables: {
        where: {
          buildingId: buildingID,
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
    setPerDate([])
    setPeriod({
      month,
      year
    })
  }, [month, year])

  const handleChangeDate = event => {
    const value = event.target.value
    const name = event.target.name
    const id = name[name.length - 1]

    const date = { [name]: value }
    setPerDate(prevState => [...prevState, date])
    setDatePerRow(prevState => ({
      ...prevState,
      [`form${id}`]: {
        dueDate: value
      }
    }))
  }

  const handleModalChangeDate = date => {
    setModalDate(new Date(date))
  }

  const uploadApi = async (payload, name) => {
    const response = await axios.post(
      process.env.NEXT_PUBLIC_UPLOAD_API,
      payload,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )

    if (response) {
      const imageData = response.data.map(item => {
        return {
          fileUrl: item.location,
          fileType: item.mimetype
        }
      })

      setFileUploadedData(prevState => ({ ...prevState, [name]: imageData[0] }))
    }
  }

  const onChangeAmount = e => {
    const name = e.target.name
    const value = e.target.value
    const id = name[name.length - 1]
    const amount = { amount: value }
    const formName = [`form${id}`]
    if (/^(\s*|\d+)$/.test(value)) {
      setAmountPerRow(prevData => ({ ...prevData, [formName]: { ...amount } }))
    }
  }

  const handleFile = file => {
    const formData = new FormData()
    const name = file.target.name
    const formName = `form${name[name.length - 1]}`
    const fileData = file.target.files
      ? file.target.files[0]
      : file.dataTransfer.files[0]
    setLoader(true)
    if (file) {
      formData.append('photos', fileData)
      setLoader(false)
    }
    uploadApi(formData, formName)
  }

  useEffect(() => {
    if (!loadingCreatingDues && calledCreatingDues && dataCreatingDues) {
      setSentLoading(true)
      if (
        dataCreatingDues?.createDues?.processId &&
        dataCreatingDues?.createDues?.processId !== ''
      ) {
        showToast('success', 'successfully submitted')
        setIsSent(prevState => ({ ...prevState, [idRow]: true }))
      } else {
        setNotSent(prevState => ({ ...prevState, [idRow]: true }))
      }
    }
  }, [loadingCreatingDues, calledCreatingDues, dataCreatingDues])

  const submitForm = async e => {
    e.preventDefault()
    const name = e.target.name
    setIdRow(name)
    try {
      const data = {
        amount: parseInt(amountPerRow[name]?.amount),
        companyId: companyIdPerRow[name]?.companyID,
        unitId: unitIdPerRow[name]?.unitID,
        complexId: complexIDPerRow[name]?.complexID,
        dueDate: datePerRow[name]?.dueDate,
        buildingId: buildingID,
        categoryId: categoryID,
        sent: true,
        title,
        period: {
          ...period
        },
        attachment: { ...fileUploadedData[name] }
      }

      await createDues({
        variables: {
          data: data
        }
      })
    } catch (e) {
      showToast('warning', 'Submit Failed')

      setNotSent(prevState => ({ ...prevState, [idRow]: true }))
    }
  }

  const memoTable = useMemo(() => {
    if (!loading) {
      const rowData = []
      let num = 0
      if (data?.getDuesPerUnit?.data) {
        data?.getDuesPerUnit?.data.forEach((row, index) => {
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
          ${row?.unitOwner?.user?.lastName}`
          const uploadFile = (
            <FileUpload
              label="Upload File"
              name={`file${index}`}
              getFile={handleFile}
              loading={loader}
              maxSize={5}
              key={index}
            />
          )

          const amount = (
            <FormInput
              onChange={onChangeAmount}
              name={`amount${index}`}
              type="text"
              placeholder="0.0"
              key={index}
              value={
                amountPerRow[`form${index}`] !== undefined
                  ? amountPerRow[`form${index}`].amount
                  : ''
              }
            />
          )
          const isAmountEmpty = !!(
            amountPerRow[`form${index}`] &&
            amountPerRow[`form${index}`].amount !== ''
          )
          const isDueDateEmpty = !_.isEmpty(datePerRow[`form${index}`])
          const isFileEmpty = !_.isEmpty(fileUploadedData[`form${index}`])

          const sendButton = (
            <Can
              perform="dues:create"
              yes={
                <Button
                  primary={!isSent[`form${index}`]}
                  success={isSent[`form${index}`]}
                  danger={notSent[`form${index}`]}
                  disabled={!(isAmountEmpty && isDueDateEmpty && isFileEmpty)}
                  label={
                    isSent[`form${index}`] ? (
                      <FaCheck />
                    ) : notSent[`form${index}`] ? (
                      <FaExclamation />
                    ) : (
                      'Send'
                    )
                  }
                  name={`form${index}`}
                  onClick={e => submitForm(e)}
                />
              }
              no={<Button disabled label="Send" />}
            />
          )

          const fieldData = {
            Name: `date${index}`,
            ChangeHandler: handleChangeDate,
            value: perDate,
            minDate: date,
            allDate: modalDate
          }

          const dueDate = <DueDate fieldData={fieldData} />

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
  }, [
    loading,
    data,
    error,
    date,
    perDate,
    amountPerRow,
    datePerRow,
    fileUploadedData,
    isSent,
    sentLoading,
    selectedFloor,
    notSent
  ])

  useEffect(() => {
    if (!loading && !error && data) {
      const companyIDArray = {}
      const complexIDArray = {}
      const unitIDArray = {}
      data?.getDuesPerUnit?.data.forEach((due, index) => {
        companyIDArray[`form${index}`] = { companyID: due?.company?._id }
        complexIDArray[`form${index}`] = { complexID: due?.complex?._id }
        unitIDArray[`form${index}`] = { unitID: due?.unitOwner?.unit?._id }
      })

      setCompanyIdPerRow(companyIDArray)
      setComplexIdPerRow(complexIDArray)
      setUnitIdPerRow(unitIDArray)
    }
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

    setFloors([{ label: 'All', value: 'all' }, ...optionsData])
  }, [
    loadingFloorNumbers,
    dataAllFloors,
    errorGetAllFloors,
    amountPerRow,
    datePerRow
  ])

  useEffect(() => {
    refetch()
    setActivePage(1)
  }, [selectedFloor])

  const handleModal = () => setShowModal(show => !show)

  const handleCloseModal = () => {
    handleModal()
  }
  const handleOkModal = () => {
    const allDates = []
    const datePerRowArray = {}
    for (let i = 0; i < limitPage; i++) {
      const key = `date${i}`
      const date = { [key]: modalDate }
      datePerRowArray[`form${i}`] = { dueDate: modalDate }
      allDates.push(date)
    }
    setDatePerRow(datePerRowArray)
    setPerDate(allDates)
    handleCloseModal()
  }

  const onFloorSelect = e => {
    setSelectedFloor(e.value)
  }

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

  const onClearSearch = e => {
    setSearchText(null)
  }

  const onPageClick = e => {
    setActivePage(e)
    setOffsetPage(limitPage * (e - 1))
    setPerDate([])
    setAmountPerRow({})
    setIsSent({})
    setNotSent({})
  }

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
            <Table
              rowNames={tableRowData}
              items={{
                count: data?.getDuesPerUnit.count || 0,
                limit: data?.getDuesPerUnit.limit || 0,
                offset: data?.getDuesPerUnit.offset || 0,
                data: memoTable
              }}
            />
          )
        }
      />

      {!loading && (
        <Pagination
          items={{
            count: data?.getDuesPerUnit.count || 0,
            limit: data?.getDuesPerUnit.limit || 0,
            offset: data?.getDuesPerUnit.offset || 0,
            data: memoTable
          }}
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
          <DateInput
            date={date}
            onDateChange={handleModalChangeDate}
            dateFormat="MMMM DD, YYYY"
            minDate={new Date()}
          />
        </div>
      </Modal>
    </>
  )
}

DueDate.propTypes = {
  fieldData: P.object
}

Unsent.propTypes = {
  month: P.number.isRequired,
  year: P.number.isRequired,
  buildingName: P.string.isRequired
}

export default Unsent
