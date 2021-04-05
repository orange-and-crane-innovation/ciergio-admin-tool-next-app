import { useState, useEffect } from 'react'
import DateAndSearch from '../DateAndSearch'
import Table from '@app/components/table'
import Card from '@app/components/card'
import styles from '../main.module.css'
import Button from '@app/components/button'
import Dropdown from '@app/components/dropdown'
import Pagination from '@app/components/pagination'
import { BsPlusCircle, BsTrash } from 'react-icons/bs'
import { useQuery, useMutation } from '@apollo/client'
import { GET_REGISTRYRECORDS } from '../query'
import { CANCEL_RECORD, ADD_NOTE, UPDATE_RECORD } from '../mutation'
import P from 'prop-types'
import { DATE } from '@app/utils'
import { FaEllipsisH } from 'react-icons/fa'
import { AiOutlineMessage, AiOutlineFileText } from 'react-icons/ai'
import moment from 'moment'
import useKeyPress from '@app/utils/useKeyPress'
import AddVisitorModal from '../modals/AddVisitorModal'
import ViewMoreDetailsModalContent from '../modals/ViewMoreDetailsModalContent'
import Modal from '@app/components/modal'
import showToast from '@app/utils/toast'
import AddNoteModal from '../modals/AddNoteModal'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

const NUMBEROFCOLUMN = 6

const dummyRow = [
  {
    name: 'Unit',
    width: `${NUMBEROFCOLUMN / 100}%`
  },
  {
    name: 'Person/Company',
    width: `${NUMBEROFCOLUMN / 100}%`
  },
  {
    name: 'Checked In',
    width: `${NUMBEROFCOLUMN / 100}%`
  },
  {
    name: 'Checked Out',
    width: `${NUMBEROFCOLUMN / 100}%`
  },
  {
    name: '',
    width: `${NUMBEROFCOLUMN / 100}%`
  },
  {
    name: '',
    width: `${NUMBEROFCOLUMN / 100}%`
  }
]

const TableColStyle = ({ top, bottom }) => {
  return (
    <>
      {!bottom ? (
        top
      ) : (
        <div className="flex flex-col">
          <p className="text-gray-900 font-bold">{top || ''}</p>
          <p className="text-gray-900">{bottom || ''}</p>
        </div>
      )}
    </>
  )
}

const validationSchema = yup.object().shape({
  note: yup.string().required()
})
function LogBook({ buildingId, categoryId, status, name }) {
  const [limitPage, setLimitPage] = useState(10)
  const [offsetPage, setOffsetPage] = useState(0)
  const [activePage, setActivePage] = useState(1)
  const [tableData, setTableData] = useState()
  const [date, setDate] = useState(new Date())
  const [search, setSearch] = useState(null)
  const [searchText, setSearchText] = useState(null)
  const [showViewMoreDetails, setShowViewMoreDetails] = useState(false)
  const [recordId, setRecordId] = useState('')

  const [modalTitle, setModalTitle] = useState('')
  const [checkedInAtTime, setCheckedInAtTime] = useState([
    moment(new Date()).startOf('day').format(),
    moment(new Date()).endOf('day').format()
  ])

  const keyPressed = useKeyPress('Enter')
  const [showModal, setShowModal] = useState(false)
  const [modalContent, setModalContent] = useState(null)
  const [modalType, setModalType] = useState('')

  const { handleSubmit, control, errors } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      note: ''
    }
  })

  const { loading, error, data, refetch } = useQuery(GET_REGISTRYRECORDS, {
    variables: {
      limit: limitPage,
      offset: offsetPage,
      sort: 1,
      sortBy: 'checkedIn',
      where: {
        status,
        categoryId,
        checkedInAt: checkedInAtTime,
        keyword: search
      }
    }
  })

  const [
    cancelRecord,
    {
      loading: loadingCancelRecord,
      called: calledCancelRecord,
      data: dataCancelRecord
    }
  ] = useMutation(CANCEL_RECORD)

  const [
    addNote,
    { loading: loadingAddNote, called: calledAddNote, data: dataAddNote }
  ] = useMutation(ADD_NOTE)

  const [
    updateRecord,
    {
      loading: loadingUpdateRecord,
      called: calledUpdateRecord,
      data: dataUpdateRecord
    }
  ] = useMutation(UPDATE_RECORD)

  useEffect(() => {
    if (!loadingUpdateRecord && calledUpdateRecord && dataUpdateRecord) {
      if (dataUpdateRecord?.updateRegistryRecord?.message === 'success') {
        showToast('success', `${name} checked out`)
        refetch()
      }
    }
  }, [loadingUpdateRecord, calledUpdateRecord, dataUpdateRecord])

  useEffect(() => {
    if (!loadingAddNote && dataAddNote && calledAddNote) {
      if (dataAddNote.createRegistryNote?.message === 'success') {
        refetch()
        showToast('success', 'Note Added')
        setRecordId('')
        setShowViewMoreDetails(false)
      }
    }
  }, [loadingAddNote, calledAddNote, dataAddNote])

  useEffect(() => {
    if (!loadingCancelRecord && dataCancelRecord && calledCancelRecord) {
      if (dataCancelRecord.updateRegistryRecord?.message === 'success') {
        showToast('success', 'Visitor Cancelled')
        setRecordId('')
        refetch()
        setShowViewMoreDetails(false)
      } else {
        showToast('success', 'Visitor Cancelled')
        setRecordId('')
        refetch()
        setShowViewMoreDetails(false)
      }
    }
  }, [loadingCancelRecord, calledCancelRecord, dataCancelRecord])

  useEffect(() => {
    if (!loading && !error && data) {
      const tableData = []
      const tempIds = []
      data?.getRegistryRecords?.data.forEach((registry, index) => {
        tempIds.push(registry._id)
        const dropdownData = [
          {
            label: 'Message Resident',
            icon: <AiOutlineMessage />,
            function: () => console.log('wew')
          },
          {
            label: 'View More Details',
            icon: <AiOutlineFileText />,
            function: () => handleViewMoreModal('details', registry._id)
          },
          {
            label: 'Cancel',
            icon: <BsTrash />,
            function: () => handleViewMoreModal('cancel', registry._id)
          }
        ]
        const dateUTC = new Date(+registry.checkedInAt)
        const dateCheckoutUTC = new Date(+registry.checkedOutAt)
        tableData.push({
          unitNumberAndOwner: (
            <TableColStyle
              key={index}
              top={registry.forWho ? `${registry.forWho.unit.name}` : ''}
              bottom={
                registry.forWho
                  ? `${registry.forWho.user.firstName} ${registry.forWho.user.lastName}`
                  : ''
              }
            />
          ),
          personCompany: (
            <TableColStyle
              key={index}
              top={`${registry.visitor.firstName} ${registry.visitor.lastName}`}
              bottom={registry.visitor.company}
            />
          ),
          checkedIn: DATE.toFriendlyTime(dateUTC.toUTCString()),
          checkedOut: registry.checkedOutAt ? (
            DATE.toFriendlyTime(dateCheckoutUTC.toUTCString())
          ) : (
            <Button
              label="Checked Out"
              onClick={e => updateMyRecord(e, registry._id)}
            />
          ),
          addNote: (
            <Button
              label="Add Note"
              onClick={e => handleViewMoreModal('addnote', registry._id)}
            />
          ),
          options: <Dropdown label={<FaEllipsisH />} items={dropdownData} />
        })
      })

      const table = {
        count: data?.getRegistryRecords.count || 0,
        limit: data?.getRegistryRecords.limit || 0,
        offset: data?.getRegistryRecords.offset || 0,
        data: tableData || []
      }

      setTableData(table)
    }
  }, [loading, error, data])

  const handleCancelRecord = async () => {
    try {
      if (recordId !== '') {
        await cancelRecord({
          variables: { data: { status: 'cancelled' }, id: recordId }
        })
      }
    } catch (e) {
      showToast('warning', 'Problem saving visitor cancelled')
      setShowViewMoreDetails(false)
    }
  }

  const updateMyRecord = async (e, id) => {
    e.preventDefault()
    try {
      if (id) {
        await updateRecord({
          variables: {
            id,
            data: {
              status: 'checkedOut'
            }
          }
        })
      }
    } catch (error) {
      showToast('warning', 'Unexpected error occur. Plase try again')
    }
  }

  const onPageClick = e => {
    setActivePage(e)
    setOffsetPage(limitPage * (e - 1))
  }

  const onLimitChange = e => {
    setLimitPage(parseInt(e.value))
  }

  const handleDateChange = date => {
    setDate(date)
  }

  const clickShowButton = e => {
    if (date) {
      const startOfADay = moment(date).startOf('day').format()
      const endOfADay = moment(date).endOf('day').format()
      setCheckedInAtTime([startOfADay, endOfADay])
      refetch()
    }
  }

  useEffect(() => {
    if (keyPressed) {
      setSearch(searchText)
      refetch()
    }
  }, [keyPressed, searchText])

  const handleSearch = e => {
    if (e.target.value === '') {
      setSearch(null)
    } else {
      setSearchText(e.target.value)
    }
  }
  const onClearSearch = () => setSearch('')

  const handleAddNote = async data => {
    try {
      const content = data.note.replace(/(<([^>]+)>)/gi, '')

      await addNote({
        variables: {
          data: {
            content,
            recordId
          }
        }
      })
    } catch (e) {
      showToast('warning', 'Unecpected error occur. Please try again')
      setShowViewMoreDetails(false)
    }
  }

  const handleShowModal = () => setShowModal(show => !show)
  const handleViewMoreModal = (type, rcrdID) => {
    if (rcrdID) {
      switch (type) {
        case 'details':
          setModalTitle('Details')
          setModalContent(<ViewMoreDetailsModalContent recordId={rcrdID} />)
          setModalType('details')
          break
        case 'cancel':
          setModalTitle('Cancel')
          setModalType('cancel')
          setModalContent(
            <div className="text-muted lead text-xl align-center">
              Do you want to cancel this entry?
            </div>
          )
          setRecordId(rcrdID)
          break
        case 'addnote':
          setModalTitle('Add Note')
          setModalContent(<AddNoteModal forms={{ control, errors }} />)
          setModalTitle('Add Note')
          setModalType('addnote')
          setRecordId(rcrdID)
          break
        default:
      }
    }
    setShowViewMoreDetails(show => !show)
  }
  const handleClearModal = () => setShowViewMoreDetails(false)
  const setSuccess = isSuccess => {
    if (isSuccess) {
      setShowModal(show => !show)
    }
  }

  const willRefetch = will => {
    if (will) {
      refetch()
    }
  }

  return (
    <>
      <DateAndSearch
        date={date}
        handleDateChange={handleDateChange}
        search={search}
        handleSearchChange={handleSearch}
        showTableData={clickShowButton}
        handleClear={onClearSearch}
      />
      <Card
        noPadding
        header={
          <div className={styles.ReceptionistCardHeaderContainer}>
            <b className={styles.ReceptionistCardHeader}>
              {search
                ? `Search results from "${search}"`
                : `${name} Logbook (${data?.getRegistryRecords?.count || 0})`}
            </b>
            <Button
              primary
              label="Add Visitors"
              leftIcon={<BsPlusCircle />}
              onClick={handleShowModal}
            />
          </div>
        }
        content={
          !loading &&
          tableData && <Table rowNames={dummyRow} items={tableData} />
        }
      />
      {!loading && tableData && (
        <Pagination
          items={tableData}
          activePage={activePage}
          onPageClick={onPageClick}
          onLimitChange={onLimitChange}
        />
      )}
      <AddVisitorModal
        showModal={showModal}
        onShowModal={handleShowModal}
        buildingId={buildingId}
        categoryId={categoryId}
        success={setSuccess}
        refetch={willRefetch}
      />
      <Modal
        title={modalTitle}
        visible={showViewMoreDetails}
        onClose={handleClearModal}
        onShowModal={handleViewMoreModal}
        onOk={
          (modalType === 'cancel' && handleCancelRecord) ||
          (modalType === 'addnote' && handleSubmit(handleAddNote))
        }
      >
        {modalContent}
      </Modal>
    </>
  )
}

TableColStyle.propTypes = {
  top: P.string,
  bottom: P.string
}

LogBook.propTypes = {
  buildingId: P.string.isRequired,
  categoryId: P.string.isRequired,
  status: P.oneOfType[(P.string, P.array)],
  name: P.string.isRequired
}

export default LogBook
