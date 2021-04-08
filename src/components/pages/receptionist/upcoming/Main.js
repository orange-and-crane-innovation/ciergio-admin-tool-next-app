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
import PageLoader from '@app/components/page-loader'

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
    name: 'Checked-In Schedule',
    width: `${COLCOUNT / 100}%`
  },
  {
    name: 'Checked In',
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
          <p className="text-gray-900 font-bold">{top || ''}</p>
          <p className="text-gray-900">{bottom || ''}</p>
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

function Upcoming({ buildingId, categoryId, status, name }) {
  const [limitPage, setLimitPage] = useState(10)
  const [offsetPage, setOffsetPage] = useState(0)
  const [activePage, setActivePage] = useState(1)
  const [tableData, setTableData] = useState()
  const [search, setSearch] = useState(null)
  const [searchText, setSearchText] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [recordId, setRecordId] = useState('')
  const [modalContent, setModalContent] = useState(null)
  const [modalType, setModalType] = useState('')
  const keyPressed = useKeyPress('Enter')
  const [showViewMoreDetails, setShowViewMoreDetails] = useState(false)
  const [ids, setIds] = useState([])
  const [modalTitle, setModalTitle] = useState('')

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
        keyword: search || search !== '' ? search : null
      }
    }
  })

  const { handleSubmit, control, errors } = useForm({
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
  ] = useMutation(UPDATE_RECORD)

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
    if (!loading && !error && data) {
      const tableData = []
      const tableToday = []
      const tableTomorrow = []
      const talbeDates = []
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
        const dateUTC = new Date(+registry.checkInSchedule)
        const dates = {
          today: DATE.toFriendlyDate(moment(new Date()).format()),
          tomorrow: DATE.toFriendlyDate(
            moment(new Date()).add(1, 'days').format()
          )
        }
        const momentDate = DATE.toFriendlyDate(moment(dateUTC).format())

        if (dates.today === momentDate) {
          tableToday.push({
            unitNumberAndOwner: (
              <TableColStyle
                key={index}
                top={`${registry.forWhat.name}`}
                bottom={`${registry.forWho.user.firstName} ${registry.forWho.user.lastName}`}
              />
            ),
            personCompany: (
              <TableColStyle
                key={index}
                top={`${registry.visitor.firstName} ${registry.visitor.lastName}`}
                bottom={registry.visitor.company}
              />
            ),
            checkedIn: (
              <TableColStyle
                key={index}
                top={`${DATE.toFriendlyTime(dateUTC.toUTCString())}`}
                bottom={`${DATE.toFriendlyDate(dateUTC.toUTCString())}`}
              />
            ),
            checkedOut: (
              <Button
                label="Checked In"
                onClick={e => updateMyRecord(e, registry._id)}
              />
            ),
            addNote: (
              <Button
                link
                label="Add Note"
                onClick={e => handleViewMoreModal('addnote', registry._id)}
              />
            ),
            options: (
              <div className="h-full w-full flex justify-center items-center">
                <Dropdown label={<FaEllipsisH />} items={dropdownData} />
              </div>
            )
          })
        } else if (dates.tomorrow === momentDate) {
          tableTomorrow.push({
            unitNumberAndOwner: (
              <TableColStyle
                key={index}
                top={`${registry.forWhat.name}`}
                bottom={`${registry.forWho.user.firstName} ${registry.forWho.user.lastName}`}
              />
            ),
            personCompany: (
              <TableColStyle
                key={index}
                top={`${registry.visitor.firstName} ${registry.visitor.lastName}`}
                bottom={registry.visitor.company}
              />
            ),
            checkedIn: (
              <TableColStyle
                key={index}
                top={`${DATE.toFriendlyTime(dateUTC.toUTCString())}`}
                bottom={`${DATE.toFriendlyDate(dateUTC.toUTCString())}`}
              />
            ),
            checkedOut: (
              <Button
                label="Checked In"
                onClick={e => updateMyRecord(e, registry._id)}
              />
            ),
            addNote: (
              <Button
                link
                label="Add Note"
                onClick={e => handleViewMoreModal('addnote', registry._id)}
              />
            ),
            options: (
              <div className="h-full w-full flex justify-center items-center">
                <Dropdown label={<FaEllipsisH />} items={dropdownData} />
              </div>
            )
          })
        } else {
          talbeDates.push(
            {
              date: (
                <div className="text-gray-900 font-bold">
                  {DATE.toFriendlyDate(dateUTC)}
                </div>
              ),
              blank: '',
              blank1: '',
              blank2: '',
              blank3: '',
              blank4: ''
              // temporary
            },
            {
              unitNumberAndOwner: (
                <TableColStyle
                  key={index}
                  top={`${registry.forWhat.name}`}
                  bottom={`${registry.forWho.user.firstName} ${registry.forWho.user.lastName}`}
                />
              ),
              personCompany: (
                <TableColStyle
                  key={index}
                  top={`${registry.visitor.firstName} ${registry.visitor.lastName}`}
                  bottom={registry.visitor.company}
                />
              ),
              checkedIn: (
                <TableColStyle
                  key={index}
                  top={`${DATE.toFriendlyTime(dateUTC.toUTCString())}`}
                  bottom={`${DATE.toFriendlyDate(dateUTC.toUTCString())}`}
                />
              ),
              checkedOut: (
                <Button
                  label="Checked In"
                  onClick={e => updateMyRecord(e, registry._id)}
                />
              ),
              addNote: (
                <Button
                  link
                  label="Add Note"
                  onClick={e => handleViewMoreModal('addnote', registry._id)}
                />
              ),
              options: (
                <div className="h-full w-full flex justify-center items-center">
                  <Dropdown label={<FaEllipsisH />} items={dropdownData} />
                </div>
              )
            }
          )
        }
      })
      setIds(tempIds)
      if (tableTomorrow.length > 0) {
        tableTomorrow.unshift({
          date: <div className="text-gray-900 font-bold">Tomorrow</div>,
          blank: '',
          blank1: '',
          blank2: '',
          blank3: '',
          blank4: ''
          // temporary
        })
      }

      if (tableToday.length > 0) {
        tableToday.unshift({
          date: <div className="text-gray-900 font-bold">Today</div>,
          blank: '',
          blank1: '',
          blank2: '',
          blank3: '',
          blank4: ''
          // temporary
        })
      }

      // this is only temporary function, to divide the dates by tomorrow, today, yesterday or other dates

      tableData.push(...tableToday, ...tableTomorrow, ...talbeDates)

      const table = {
        count: data?.getRegistryRecords.count || 0,
        limit: data?.getRegistryRecords.limit || 0,
        offset: data?.getRegistryRecords.offset || 0,
        data: tableData || []
      }

      setTableData(table)
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
    if (found) {
      switch (type) {
        case 'details':
          setModalContent(<ViewMoreDetailsModalContent recordId={found} />)
          setModalType('details')
          setModalTitle('Details')
          break
        case 'cancel':
          setModalType('cancel')
          setModalTitle('Cancel')
          setModalContent(
            <div className="text-muted lead text-xl align-center">
              Do you want to cancel this entry?
            </div>
          )
          setRecordId(found)
          break
        case 'addnote':
          setModalContent(<AddNoteModal forms={{ control, errors }} />)
          setModalTitle('Add Note')
          setModalType('addnote')
          setRecordId(found)
          break
        default:
      }
    }
    setShowViewMoreDetails(show => !show)
  }

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

  useEffect(() => {
    if (keyPressed) {
      setSearch(searchText)
      refetch()
    }
  }, [keyPressed, searchText])
  // ============

  const handleSearch = e => {
    if (e.target.value === '') {
      setSearch(null)
    } else {
      setSearchText(e.target.value)
    }
  }
  const onClearSearch = () => {
    setSearch('')
  }

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
  const handleShowModal = e => setShowModal(show => !show)

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
      showToast('warning', 'Problem adding note')
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
              status: 'checkedIn'
            }
          }
        })
      }
    } catch (error) {
      showToast('warning', 'Unexpected error occur. Plase try again')
    }
  }

  return (
    <>
      <DateAndSearch
        noDate
        search={search}
        handleSearchChange={handleSearch}
        handleClear={onClearSearch}
      />
      <Card
        noPadding
        header={
          <div className={styles.ReceptionistCardHeaderContainer}>
            <b className={styles.ReceptionistCardHeader}>
              {search
                ? `Search results from "${search}"`
                : `Upcoming ${name} (${data?.getRegistryRecords?.count || 0})`}
            </b>
            <Button
              primary
              label={`Add ${singularName(name) || name}`}
              leftIcon={<BsPlusCircle />}
              onClick={handleShowModal}
            />
          </div>
        }
        content={
          loading && !tableData ? (
            <PageLoader />
          ) : (
            <Table rowNames={rowName} items={tableData} />
          )
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
        name={name}
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

Upcoming.propTypes = {
  buildingId: P.string.isRequired,
  categoryId: P.string.isRequired,
  status: P.oneOfType[(P.string, P.array)],
  name: P.string.isRequired
}

export default Upcoming
