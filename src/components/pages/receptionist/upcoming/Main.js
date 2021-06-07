import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useQuery, useMutation } from '@apollo/client'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { FaEllipsisH } from 'react-icons/fa'
import { BsPlusCircle, BsTrash } from 'react-icons/bs'
import { AiOutlineMessage, AiOutlineFileText } from 'react-icons/ai'
import P from 'prop-types'
import moment from 'moment'
import { debounce } from 'lodash'

import Table from '@app/components/table'
import Card from '@app/components/card'
import Button from '@app/components/button'
import Dropdown from '@app/components/dropdown'
import Pagination from '@app/components/pagination'
import Modal from '@app/components/modal'
import PageLoader from '@app/components/page-loader'
import DownloadCSV from '@app/components/globals/DownloadCSV'
import PrintTable from '@app/components/globals/PrintTable'
import NotifCard from '@app/components/globals/NotifCard'

import { DATE } from '@app/utils'
import showToast from '@app/utils/toast'
import errorHandler from '@app/utils/errorHandler'

import DateAndSearch from '../DateAndSearch'
import AddNoteModal from '../modals/AddNoteModal'
import AddVisitorModal from '../modals/AddVisitorModal'
import ViewMoreDetailsModalContent from '../modals/ViewMoreDetailsModalContent'
import ViewNotesModalContent from '../modals/ViewNotesModalContent'

import { GET_REGISTRYRECORDS } from '../query'
import { CANCEL_RECORD, ADD_NOTE, UPDATE_RECORD } from '../mutation'

import Can from '@app/permissions/can'

import styles from '../main.module.css'

const COLCOUNT = 6
const rowName = [
  {
    name: 'Unit',
    width: `${COLCOUNT / 100}%`
  },
  {
    name: 'Person/Company',
    width: `${COLCOUNT / 100}%`
  },
  {
    name: 'Check-In Schedule',
    width: `${COLCOUNT / 100}%`
  },
  {
    name: 'Check In',
    width: `${COLCOUNT / 100}%`
  },
  {
    name: '',
    width: `${COLCOUNT / 100}%`
  },
  {
    name: '',
    width: `${COLCOUNT / 100}%`
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
  note: yup.string().required()
})

export default function Upcoming({
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
  const [customTable, setCustomTable] = useState()
  const [searchText, setSearchText] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [recordId, setRecordId] = useState('')
  const [modalContent, setModalContent] = useState(null)
  const [modalType, setModalType] = useState('')
  const [showViewMoreDetails, setShowViewMoreDetails] = useState(false)
  const [ids, setIds] = useState([])
  const [modalTitle, setModalTitle] = useState('')
  const [modalFooter, setModalFooter] = useState(true)
  const [csvData, setCsvData] = useState([
    ['Upcoming Visitors'],
    ['Building', buildingName],
    ['Date', DATE.toFriendlyDate(new Date())],
    [''],
    ['#', 'Unit No.', 'Unit Owner', "Visitor's Name", "Visitor's Company"]
  ])
  const [printableData, setPrintableData] = useState([])

  const { loading, error, data, refetch } = useQuery(GET_REGISTRYRECORDS, {
    variables: {
      limit: limitPage,
      offset: offsetPage,
      sort: 1,
      sortBy: 'checkInSchedule',
      where: {
        buildingId,
        categoryId,
        status,
        checkInSchedule: moment(new Date()).startOf('day').format(),
        keyword: searchText || searchText !== '' ? searchText : null
      }
    }
  })

  const { handleSubmit, control, errors, reset } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      email: ''
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

  useEffect(() => {
    if (!loadingUpdateRecord && calledUpdateRecord && dataUpdateRecord) {
      if (dataUpdateRecord?.updateRegistryRecord?.message === 'success') {
        showToast('success', `${singularName(name)} checked in`)
        refetch()
      }
    }
  }, [loadingUpdateRecord, calledUpdateRecord, dataUpdateRecord])

  useEffect(() => {
    if (!loadingAddNote && dataAddNote && calledAddNote) {
      if (dataAddNote.createRegistryNote?.message === 'success') {
        showToast('success', 'Note Added Successfully')
        setRecordId('')
        refetch()
        setShowViewMoreDetails(false)
      }
    }
  }, [loadingAddNote, calledAddNote, dataAddNote])

  useEffect(() => {
    refetch()
  }, [])

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
    if (!loading) {
      if (error) {
        errorHandler(error)
      } else if (!error && data) {
        const tableToday = []
        const tableTomorrow = []
        const tempIds = []
        const tableData = []
        const tempCSV = []

        setPrintableData([])
        setCsvData([
          ['Upcoming Visitors'],
          ['Building', buildingName],
          ['Date', DATE.toFriendlyDate(new Date())],
          [''],
          ['#', 'Unit No.', 'Unit Owner', "Visitor's Name", "Visitor's Company"]
        ])

        data?.getRegistryRecords?.data.forEach((registry, index) => {
          const dropdownData = [
            {
              label: 'Message Resident',
              icon: <AiOutlineMessage />,
              function: () =>
                registry?.forWho?.conversations?.count > 0 &&
                router.push(
                  `/messages/${registry?.forWho?.conversations?.data[0]._id}`
                )
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
          const dateUTC = new Date(+registry.checkInSchedule)
          const dates = {
            today: DATE.toFriendlyShortDate(moment(new Date()).format()),
            tomorrow: DATE.toFriendlyShortDate(
              moment(new Date()).add(1, 'days').format()
            )
          }
          const momentDate = DATE.toFriendlyShortDate(moment(dateUTC).format())
          const num = index + 1

          tempIds.push(registry._id)
          tempCSV.push([
            num,
            registry.forWhat.name,
            `${registry.forWho.user.firstName} ${registry.forWho.user.lastName}`,
            `${registry.visitor.firstName} ${registry.visitor.lastName}`,
            registry.visitor.company
          ])

          if (dates.today === momentDate) {
            tableToday.push(
              <tr>
                <td>
                  <TableColStyle
                    key={index}
                    top={`${registry.forWhat.name}`}
                    bottom={`${registry.forWho.user.firstName} ${registry.forWho.user.lastName}`}
                  />
                </td>
                <td>
                  <TableColStyle
                    key={index}
                    top={`${registry.visitor.firstName} ${registry.visitor.lastName}`}
                    bottom={registry.visitor.company}
                  />
                </td>
                <td>
                  <TableColStyle
                    key={index}
                    top={`${DATE.toFriendlyTime(dateUTC.toUTCString())}`}
                    bottom={`${DATE.toFriendlyShortDate(
                      dateUTC.toUTCString()
                    )}`}
                  />
                </td>
                <td>
                  <Can
                    perform="guestanddeliveries:checkinschedule"
                    yes={
                      <Button
                        label="Check In"
                        onClick={e => updateMyRecord(e, registry._id)}
                        noBottomMargin
                      />
                    }
                  />
                </td>
                <td>
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
                </td>
                <td>
                  <Can
                    perform="guestanddeliveries:view:cancel:message"
                    yes={
                      <Dropdown label={<FaEllipsisH />} items={dropdownData} />
                    }
                  />
                </td>
              </tr>
            )
          } else if (dates.tomorrow === momentDate) {
            tableTomorrow.push(
              <tr>
                <td>
                  <TableColStyle
                    key={index}
                    top={`${registry.forWhat.name}`}
                    bottom={`${registry.forWho.user.firstName} ${registry.forWho.user.lastName}`}
                  />
                </td>
                <td>
                  <TableColStyle
                    key={index}
                    top={`${registry.visitor.firstName} ${registry.visitor.lastName}`}
                    bottom={registry.visitor.company}
                  />
                </td>
                <td>
                  <TableColStyle
                    key={index}
                    top={`${DATE.toFriendlyTime(dateUTC.toUTCString())}`}
                    bottom={`${DATE.toFriendlyShortDate(
                      dateUTC.toUTCString()
                    )}`}
                  />
                </td>
                <td>
                  <Can
                    perform="guestanddeliveries:checkinschedule"
                    yes={
                      <Button
                        label="Check In"
                        onClick={e => updateMyRecord(e, registry._id)}
                        noBottomMargin
                      />
                    }
                  />
                </td>
                <td>
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
                </td>
                <td>
                  <Can
                    perform="guestanddeliveries:view:cancel:message"
                    yes={
                      <Dropdown label={<FaEllipsisH />} items={dropdownData} />
                    }
                  />
                </td>
              </tr>
            )
          } else {
            tableData.push(
              <>
                <tr>
                  <td className="text-gray-900 font-bold pl-8 py-5">
                    {DATE.toFriendlyShortDate(dateUTC)}
                  </td>
                </tr>
                <tr>
                  <td>
                    <TableColStyle
                      key={index}
                      top={`${registry.forWhat.name}`}
                      bottom={`${registry.forWho.user.firstName} ${registry.forWho.user.lastName}`}
                    />
                  </td>
                  <td>
                    <TableColStyle
                      key={index}
                      top={`${registry.visitor.firstName} ${registry.visitor.lastName}`}
                      bottom={registry.visitor.company}
                    />
                  </td>
                  <td>
                    <TableColStyle
                      key={index}
                      top={`${DATE.toFriendlyTime(dateUTC.toUTCString())}`}
                      bottom={`${DATE.toFriendlyShortDate(
                        dateUTC.toUTCString()
                      )}`}
                    />
                  </td>
                  <td>
                    <Can
                      perform="guestanddeliveries:checkinschedule"
                      yes={
                        <Button
                          label="Check In"
                          onClick={e => updateMyRecord(e, registry._id)}
                          noBottomMargin
                        />
                      }
                    />
                  </td>
                  <td>
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
                  </td>
                  <td>
                    <Can
                      perform="guestanddeliveries:view:cancel:message"
                      yes={
                        <Dropdown
                          label={<FaEllipsisH />}
                          items={dropdownData}
                        />
                      }
                    />
                  </td>
                </tr>
              </>
            )
          }
        })

        if (tableTomorrow.length > 0) {
          tableTomorrow.unshift(
            <tr>
              <td className="text-gray-900 font-bold pl-8 py-5">Tomorrow</td>
            </tr>
          )
        }

        if (tableToday.length > 0) {
          tableToday.unshift(
            <tr>
              <td className="text-gray-900 font-bold pl-8 py-5">Today</td>
            </tr>
          )
        }

        // this is only temporary function, to divide the dates by tomorrow, today, yesterday or other dates
        const custom = []
        custom.push(...tableToday, ...tableTomorrow, ...tableData)

        const table = {
          count: data?.getRegistryRecords.count || 0,
          limit: data?.getRegistryRecords.limit || 0,
          offset: data?.getRegistryRecords.offset || 0,
          data: {
            length: data?.getRegistryRecords?.data?.reduce(
              (prev, cur) => prev + cur.count,
              0
            )
          }
        }

        setIds(tempIds)
        setTableData(table)
        setCustomTable(custom)
        setCsvData(prevState => [...prevState, ...tempCSV])
        setPrintableData(tempCSV)
      }
    }
  }, [loading, error, data])

  const onPageClick = e => {
    setActivePage(e)
    setOffsetPage(limitPage * (e - 1))
  }

  const onLimitChange = e => {
    setLimitPage(parseInt(e.value))
  }

  const handleViewMoreModal = (type, recordId) => {
    const found = ids.length > 0 ? ids.find(id => recordId === id) : recordId
    const random = Math.random()
    reset()
    if (found) {
      switch (type) {
        case 'details':
          setModalContent(<ViewMoreDetailsModalContent recordId={found} />)
          setModalType('details')
          setModalTitle('Details')
          setModalFooter(null)
          break
        case 'viewnotes':
          setModalTitle('Notes')
          setModalContent(<ViewNotesModalContent id={found} refetch={random} />)
          setModalFooter(null)
          break
        case 'cancel':
          setModalType('cancel')
          setModalTitle('Cancel')
          setModalContent(
            <div className="text-base leading-7">
              Do you want to cancel this entry?
            </div>
          )
          setRecordId(found)
          setModalFooter(true)
          break
        case 'addnote':
          setModalContent(<AddNoteModal forms={{ control, errors }} />)
          setModalTitle('Add Note')
          setModalType('addnote')
          setRecordId(found)
          setModalFooter(true)
          break
        default:
      }
    }
    setShowViewMoreDetails(show => !show)
  }

  const handleCancelRecord = () => {
    if (recordId !== '') {
      cancelRecord({
        variables: { data: { status: 'cancelled' }, id: recordId }
      })
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
  const handleClearModal = () => setShowViewMoreDetails(false)
  const handleShowModal = e => {
    reset()
    setShowModal(show => !show)
  }

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

  const updateMyRecord = (e, id) => {
    e.preventDefault()
    if (id) {
      updateRecord({
        variables: {
          id,
          data: {
            status: 'checkedIn'
          }
        }
      })
    }
  }

  return (
    <>
      <DateAndSearch
        noDate
        search={searchText}
        handleSearchChange={handleSearch}
        handleClear={onClearSearch}
      />
      <Card
        noPadding
        header={
          <div className={styles.ReceptionistCardHeaderContainer}>
            <b className={styles.ReceptionistCardHeader}>
              {searchText
                ? `Search results from "${searchText}"`
                : `Upcoming ${name} (${data?.getRegistryRecords?.count || 0})`}
            </b>
            <div className={styles.ReceptionistButtonCard}>
              <Can
                perform="guestanddeliveries:print"
                yes={
                  <PrintTable
                    header="Upcoming Visitors"
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
                    title="Upcoming Visitors"
                    fileName="upcoming_visitors"
                  />
                }
              />
              <Can
                perform="guestanddeliveries:addschedule"
                yes={
                  <Button
                    primary
                    label={`Add ${singularName(name) || name}`}
                    leftIcon={<BsPlusCircle />}
                    onClick={handleShowModal}
                    noBottomMargin
                  />
                }
              />
            </div>
          </div>
        }
        content={
          loading && !customTable ? (
            <PageLoader />
          ) : (
            customTable && (
              <Table
                custom
                rowNames={rowName}
                customBody={customTable}
                emptyText={
                  <NotifCard
                    icon={icon}
                    header={`No ${type} yet`}
                    content={`Sorry, you don't have any ${type} yet.`}
                  />
                }
              />
            )
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

Upcoming.propTypes = {
  buildingId: P.string.isRequired,
  categoryId: P.string.isRequired,
  status: P.oneOfType[(P.string, P.array)],
  name: P.string.isRequired,
  buildingName: P.string,
  type: P.string.isRequired,
  icon: P.any.isRequired
}
