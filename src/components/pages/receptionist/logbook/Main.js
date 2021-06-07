import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useQuery, useMutation } from '@apollo/client'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import P from 'prop-types'
import { FiPlusCircle, FiMessageCircle, FiFile, FiTrash2 } from 'react-icons/fi'
import { FaEllipsisH } from 'react-icons/fa'
import moment from 'moment'
import { debounce } from 'lodash'

import Table from '@app/components/table'
import Card from '@app/components/card'
import Button from '@app/components/button'
import Dropdown from '@app/components/dropdown'
import Pagination from '@app/components/pagination'
import PageLoader from '@app/components/page-loader'
import Modal from '@app/components/modal'
import DownloadCSV from '@app/components/globals/DownloadCSV'
import PrintTable from '@app/components/globals/PrintTable'
import NotifCard from '@app/components/globals/NotifCard'

import { DATE } from '@app/utils'
import showToast from '@app/utils/toast'
import errorHandler from '@app/utils/errorHandler'

import DateAndSearch from '../DateAndSearch'
import AddVisitorModal from '../modals/AddVisitorModal'
import ViewMoreDetailsModalContent from '../modals/ViewMoreDetailsModalContent'
import AddNoteModal from '../modals/AddNoteModal'
import ViewNotesModalContent from '../modals/ViewNotesModalContent'

import { GET_REGISTRYRECORDS } from '../query'
import { CANCEL_RECORD, ADD_NOTE, UPDATE_RECORD } from '../mutation'

import Can from '@app/permissions/can'

import styles from '../main.module.css'

const NUMBEROFCOLUMN = 6

const rowName = [
  {
    name: 'Unit',
    width: `${NUMBEROFCOLUMN / 100}%`
  },
  {
    name: 'Person/Company',
    width: `${NUMBEROFCOLUMN / 100}%`
  },
  {
    name: 'Check In',
    width: `${NUMBEROFCOLUMN / 100}%`
  },
  {
    name: 'Check Out',
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
          <span className="font-bold">{top || ''}</span>
          <span className="text-md text-neutral-900">{bottom || ''}</span>
        </div>
      )}
    </>
  )
}

const singularName = pluralName => {
  const singularName =
    (pluralName === 'Deliveries' && 'Delivery') ||
    (pluralName === 'Pick-ups' && 'Package') ||
    (pluralName === 'Services' && 'Service') ||
    (pluralName === 'Visitors' && 'Visitor')
  return singularName
}

const validationSchema = yup.object().shape({
  note: yup.string().label('Note').required()
})
function LogBook({
  buildingId,
  categoryId,
  status,
  name,
  buildingName,
  type,
  icon
}) {
  const router = useRouter()
  const [limitPage, setLimitPage] = useState(10)
  const [offsetPage, setOffsetPage] = useState(0)
  const [activePage, setActivePage] = useState(1)
  const [tableData, setTableData] = useState()
  const [date, setDate] = useState(new Date())
  const [searchText, setSearchText] = useState(null)
  const [showViewMoreDetails, setShowViewMoreDetails] = useState(false)
  const [recordId, setRecordId] = useState('')
  const [modalTitle, setModalTitle] = useState('')
  const [modalFooter, setModalFooter] = useState(true)
  const [checkedInAtTime, setCheckedInAtTime] = useState([
    moment(new Date()).startOf('day').format(),
    moment(new Date()).endOf('day').format()
  ])
  const [showModal, setShowModal] = useState(false)
  const [modalContent, setModalContent] = useState(null)
  const [modalType, setModalType] = useState('')
  const [csvData, setCsvData] = useState([
    ['Current Visitors'],
    ['Building', buildingName],
    ['Date', DATE.toFriendlyDate(new Date())],
    [''],
    ['#', 'Unit No.', 'Unit Owner', "Visitor's Name", "Visitor's Company"]
  ])
  const [printableData, setPrintableData] = useState([])

  const { handleSubmit, control, errors, reset } = useForm({
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
        keyword: searchText || searchText !== '' ? searchText : null
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
  ] = useMutation(CANCEL_RECORD, {
    onError: e => {
      errorHandler(e)
    }
  })

  const [
    addNote,
    { loading: loadingAddNote, called: calledAddNote, data: dataAddNote }
  ] = useMutation(ADD_NOTE, {
    onError: e => {
      errorHandler(e)
    }
  })

  const [
    updateRecord,
    {
      loading: loadingUpdateRecord,
      called: calledUpdateRecord,
      data: dataUpdateRecord
    }
  ] = useMutation(UPDATE_RECORD, {
    onError: e => {
      errorHandler(e)
    }
  })

  useEffect(() => {
    refetch()
  }, [])

  useEffect(() => {
    if (!loadingUpdateRecord && calledUpdateRecord && dataUpdateRecord) {
      if (dataUpdateRecord?.updateRegistryRecord?.message === 'success') {
        showToast('success', `${singularName(name)} checked out`)
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
        showToast('success', `${singularName(name)} Cancelled`)
        setRecordId('')
        refetch()
        setShowViewMoreDetails(false)
      } else {
        showToast('success', `${singularName(name)} Cancelled`)
        setRecordId('')
        refetch()
        setShowViewMoreDetails(false)
      }
    }
  }, [loadingCancelRecord, calledCancelRecord, dataCancelRecord])

  useEffect(() => {
    if (!loading) {
      if (error) {
        errorHandler(error)
      } else if (!error && data) {
        const tableData = []
        const tempIds = []
        const tempCSV = []

        setPrintableData([])
        setCsvData([
          ['Current Visitors'],
          ['Building', buildingName],
          ['Date', DATE.toFriendlyDate(new Date())],
          [''],
          ['#', 'Unit No.', 'Unit Owner', "Visitor's Name", "Visitor's Company"]
        ])

        data?.getRegistryRecords?.data.forEach((registry, index) => {
          const dropdownData = [
            {
              label: 'Message Resident',
              icon: <FiMessageCircle />,
              function: () =>
                registry?.forWho?.conversations?.count > 0 &&
                router.push(
                  `/messages/${registry?.forWho?.conversations?.data[0]._id}`
                )
            },
            {
              label: 'View More Details',
              icon: <FiFile />,
              function: () => handleViewMoreModal('details', registry._id)
            },
            {
              label: 'Cancel',
              icon: <FiTrash2 />,
              function: () => handleViewMoreModal('cancel', registry._id)
            }
          ]
          const dateUTC = new Date(+registry.checkedInAt)
          const dateCheckoutUTC = new Date(+registry.checkedOutAt)
          const num = index + 1

          tempIds.push(registry._id)
          tempCSV.push([
            num,
            registry.forWhat.name,
            `${registry.forWho.user.firstName} ${registry.forWho.user.lastName}`,
            `${registry.visitor.firstName} ${registry.visitor.lastName}`,
            registry.visitor.company
          ])
          tableData.push({
            unitNumberAndOwner: (
              <TableColStyle
                key={index}
                top={registry.forWho ? `${registry.forWho.unit.name}` : ''}
                bottom={
                  registry.forWho &&
                  registry.forWho.user.firstName &&
                  registry.forWho.user.lastName
                    ? `${registry.forWho.user.firstName} ${registry.forWho.user.lastName}`
                    : ' '
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
              <Can
                perform="guestanddeliveries:checkoutschedule"
                yes={
                  <Button
                    label="Checked Out"
                    onClick={e => updateMyRecord(e, registry._id)}
                    noBottomMargin
                  />
                }
              />
            ),
            addNote: (
              <>
                <Can
                  perform="guestanddeliveries:viewnote"
                  yes={
                    <>
                      <Button
                        link
                        label={`View ${
                          registry.notesCount > 0
                            ? `(${registry.notesCount})`
                            : ''
                        }`}
                        onClick={e =>
                          handleViewMoreModal('viewnotes', registry._id)
                        }
                        noBottomMargin
                      />
                      |
                    </>
                  }
                />
                <Can
                  perform="guestanddeliveries:addnote"
                  yes={
                    <Button
                      link
                      label="Add Note"
                      onClick={e =>
                        handleViewMoreModal('addnote', registry._id)
                      }
                      noBottomMargin
                    />
                  }
                />
              </>
            ),
            options: (
              <div className="h-full w-full flex justify-center items-center">
                <Can
                  perform="guestanddeliveries:view:cancel:message"
                  yes={
                    <Dropdown
                      label={<FaEllipsisH />}
                      items={
                        !registry.checkedOutAt
                          ? dropdownData
                          : [dropdownData[0], dropdownData[1]]
                      }
                    />
                  }
                />
              </div>
            )
          })
        })

        const table = {
          count: data?.getRegistryRecords.count || 0,
          limit: data?.getRegistryRecords.limit || 0,
          offset: data?.getRegistryRecords.offset || 0,
          data: tableData || []
        }

        setTableData(table)
        setCsvData(prevState => [...prevState, ...tempCSV])
        setPrintableData(tempCSV)
      }
    }
  }, [loading, error, data])

  const handleCancelRecord = () => {
    if (recordId !== '') {
      cancelRecord({
        variables: { data: { status: 'cancelled' }, id: recordId }
      })
    }
  }

  const updateMyRecord = async (e, id) => {
    e.preventDefault()
    if (id) {
      updateRecord({
        variables: {
          id,
          data: {
            status: 'checkedOut'
          }
        }
      })
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
    }
  }

  const handleSearch = debounce(e => {
    if (e.target.value === '') {
      setSearchText(null)
    } else {
      setSearchText(e.target.value)
    }
  }, 1000)

  const onClearSearch = () => setSearchText(null)

  const handleAddNote = data => {
    const content = data?.note !== '' ? data?.note : null

    addNote({
      variables: {
        data: {
          content,
          recordId
        }
      }
    })
  }

  const handleShowModal = () => setShowModal(show => !show)
  const handleViewMoreModal = (type, rcrdID) => {
    const random = Math.random()
    reset()
    if (rcrdID) {
      switch (type) {
        case 'details':
          setModalTitle('Details')
          setModalContent(
            <ViewMoreDetailsModalContent recordId={rcrdID} refetch={random} />
          )
          setModalType('details')
          setModalFooter(null)
          break
        case 'viewnotes':
          setModalTitle('Notes')
          setModalContent(
            <ViewNotesModalContent id={rcrdID} refetch={random} />
          )
          setModalFooter(null)
          break
        case 'cancel':
          setModalTitle('Cancel')
          setModalType('cancel')
          setModalContent(
            <div className="text-base leading-7">
              Do you want to cancel this entry?
            </div>
          )
          setRecordId(rcrdID)
          setModalFooter(true)
          break
        case 'addnote':
          setModalTitle('Add Note')
          setModalContent(<AddNoteModal forms={{ control, errors }} />)
          setModalTitle('Add Note')
          setModalType('addnote')
          setRecordId(rcrdID)
          setModalFooter(true)
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
        search={searchText}
        handleSearchChange={handleSearch}
        showTableData={clickShowButton}
        handleClear={onClearSearch}
      />
      <Card
        noPadding
        header={
          <div className={styles.ReceptionistCardHeaderContainer}>
            <b className={styles.ReceptionistCardHeader}>
              {searchText
                ? `Search results from "${searchText}"`
                : `${name} Logbook (${data?.getRegistryRecords?.count || 0})`}
            </b>
            <div className={styles.ReceptionistButtonCard}>
              <Can
                perform="guestanddeliveries:print"
                yes={
                  <PrintTable
                    header="Current Visitors"
                    tableHeader={[
                      '#',
                      'Unit No.',
                      'Unit Owner',
                      "Visitor's Name",
                      "Visitor's Company"
                    ]}
                    tableData={printableData}
                    subHeaders={[
                      { title: 'Building Name', content: buildingName },
                      {
                        title: 'Date',
                        content: DATE.toFriendlyDate(new Date())
                      }
                    ]}
                  />
                }
              />
              <Can
                perform="guestanddeliveries:download"
                yes={
                  <DownloadCSV
                    data={csvData}
                    title="Current Visitors"
                    fileName="current_visitors"
                  />
                }
              />
              <Can
                perform="guestanddeliveries:addschedule"
                yes={
                  <Button
                    primary
                    label={`Add ${singularName(name) || name}`}
                    leftIcon={<FiPlusCircle />}
                    onClick={handleShowModal}
                    noBottomMargin
                  />
                }
              />
            </div>
          </div>
        }
        content={
          loading && !tableData ? (
            <PageLoader />
          ) : (
            <Table
              rowNames={rowName}
              items={tableData}
              emptyText={
                <NotifCard
                  icon={icon}
                  header={`No ${type} yet`}
                  content={`Sorry, you don't have any ${type} yet.`}
                />
              }
            />
          )
        }
      />
      {!loading && tableData?.length > 10 && (
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
        name={name}
      />
      <Modal
        title={modalTitle}
        visible={showViewMoreDetails}
        footer={modalFooter}
        okText={modalType === 'addnote' ? 'Submit' : 'Ok'}
        onClose={handleClearModal}
        onCancel={handleClearModal}
        onShowModal={handleViewMoreModal}
        onOk={
          modalType === 'cancel'
            ? handleCancelRecord
            : modalType === 'addnote'
            ? handleSubmit(handleAddNote)
            : () => {}
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
  name: P.string.isRequired,
  buildingName: P.string,
  type: P.string.isRequired,
  icon: P.any.isRequired
}

export default LogBook
