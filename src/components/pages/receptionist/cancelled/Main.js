import { useState, useEffect } from 'react'
import DateAndSearch from '../DateAndSearch'
import Table from '@app/components/table'
import Card from '@app/components/card'
import styles from '../main.module.css'
import Button from '@app/components/button'
import Dropdown from '@app/components/dropdown'
import Pagination from '@app/components/pagination'
import { BsPlusCircle } from 'react-icons/bs'
import { useQuery, useMutation } from '@apollo/client'
import { GET_REGISTRYRECORDS } from '../query'
import P from 'prop-types'
import { FaEllipsisH } from 'react-icons/fa'
import { AiOutlineFileText } from 'react-icons/ai'
import { ADD_NOTE } from '../mutation'
import moment from 'moment'
import ViewMoreDetailsModalContent from '../modals/ViewMoreDetailsModalContent'
import Modal from '@app/components/modal'
import AddVisitorModal from '../modals/AddVisitorModal'
import showToast from '@app/utils/toast'
import AddNoteModal from '../modals/AddNoteModal'
import ViewNotesModalContent from '../modals/ViewNotesModalContent'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import PageLoader from '@app/components/page-loader'
import { yupResolver } from '@hookform/resolvers/yup'
import useKeyPress from '@app/utils/useKeyPress'
import DownloadCSV from '@app/components/globals/DownloadCSV'
import { DATE } from '@app/utils'
import PrintTable from '@app/components/globals/PrintTable'
import Can from '@app/permissions/can'

const rowName = [
  {
    name: 'Unit',
    width: `${4 / 100}%`
  },
  {
    name: 'Person/Company',
    width: `${4 / 100}%`
  },
  {
    name: '',
    width: `${4 / 100}%`
  },
  {
    name: '',
    width: `${4 / 100}%`
  }
]

const validationSchema = yup.object().shape({
  note: yup.string().required()
})

const TableColStyle = ({ top, bottom }) => {
  return (
    <>
      {!bottom ? (
        top
      ) : (
        <div className="flex flex-col">
          <p className="text-gray-900 font-bold">{top}</p>
          <p className="text-gray-900">{bottom}</p>
        </div>
      )}
    </>
  )
}

function Cancelled({ buildingId, categoryId, status, name, buildingName }) {
  const [limitPage, setLimitPage] = useState(10)
  const [offsetPage, setOffsetPage] = useState(0)
  const [activePage, setActivePage] = useState(1)
  const [tableData, setTableData] = useState()
  const [date, setDate] = useState(new Date())
  const [search, setSearch] = useState('')
  const [checkedInAtTime, setCheckedInAtTime] = useState([
    moment(new Date()).startOf('day').format(),
    moment(new Date()).endOf('day').format()
  ])
  const [searchText, setSearchText] = useState('')
  const [showViewMoreDetails, setShowViewMoreDetails] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [ids, setIds] = useState([])
  const [modalContent, setModalContent] = useState(null)
  const [modalTitle, setModalTitle] = useState(null)
  const [recordId, setRecordId] = useState(null)
  const [modalType, setModalType] = useState(null)
  const keyPressed = useKeyPress('Enter')
  const { handleSubmit, control, errors } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      note: ''
    }
  })
  const [csvData, setCsvData] = useState([
    ['Cancelled Visitor'],
    ['Building', buildingName],
    ['Date', DATE.toFriendlyDate(new Date())],
    [''],
    ['#', 'Unit No.', 'Unit Owner', "Visitor's Name", "Visitor's Company"]
  ])
  const [printableData, setPrintableData] = useState([])

  const [
    addNote,
    { loading: loadingAddNote, called: calledAddNote, data: dataAddNote }
  ] = useMutation(ADD_NOTE)

  const { loading, error, data, refetch } = useQuery(GET_REGISTRYRECORDS, {
    variables: {
      limit: limitPage,
      offset: offsetPage,
      sort: 1,
      sortBy: 'updatedAt',
      where: {
        buildingId,
        categoryId,
        status,
        checkedInAt: checkedInAtTime,
        keyword: search || search !== '' ? search : null
      }
    }
  })

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
    if (!loading && !error && data) {
      const tableData = []
      const tempIds = []
      const tempCSV = []

      data?.getRegistryRecords?.data.forEach((registry, index) => {
        const num = index + 1
        tempCSV.push([
          num,
          registry.forWhat.name,
          `${registry.forWho.user.firstName} ${registry.forWho.user.lastName}`,
          `${registry.visitor.firstName} ${registry.visitor.lastName}`,
          registry.visitor.company
        ])
        const dropdownData = [
          {
            label: 'View More Details',
            icon: <AiOutlineFileText />,
            function: () => handleViewMoreModal('details', registry._id)
          }
        ]

        tableData.push({
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
          addOrView: (
            <div>
              <Can
                perform="guestanddeliveries:viewnote"
                yes={
                  <Button
                    link
                    label={`View ${
                      registry.notesCount > 0 ? registry.notesCount : ''
                    }`}
                    onClick={e => handleModals('viewnotes', registry._id)}
                  />
                }
                no={
                  <Button
                    link
                    label={`View ${
                      registry.notesCount > 0 ? registry.notesCount : ''
                    }`}
                    disabled
                  />
                }
              />{' '}
              |{' '}
              <Can
                perform="guestanddeliveries:addnote"
                yes={
                  <Button
                    link
                    label="Add Note"
                    onClick={e => handleModals('addnotes', registry._id)}
                  />
                }
                no={<Button link label="Add Note" disabled />}
              />
            </div>
          ),
          options: (
            <div className="h-full w-full flex justify-center items-center">
              <Can
                perform="guestanddeliveries:view:cancel:message"
                yes={<Dropdown label={<FaEllipsisH />} items={dropdownData} />}
              />
            </div>
          )
        })
        tempIds.push(registry._id)
      })
      setIds(tempIds)
      setCsvData(prevState => [...prevState, ...tempCSV])
      setPrintableData(tempCSV)
      const table = {
        count: data?.getRegistryRecords.count || 0,
        limit: data?.getRegistryRecords.limit || 0,
        offset: data?.getRegistryRecords.offset || 0,
        data: tableData || []
      }

      setTableData(table)
    }
  }, [loading, error, data])

  useEffect(() => {
    refetch()
  }, [])

  const handleViewMoreModal = (type, recordId) => {
    const found = ids.length > 0 ? ids.find(id => recordId === id) : recordId

    if (found) {
      setShowViewMoreDetails(show => !show)
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
    e.preventDefault()
    if (date) {
      const startOfADay = moment(date).startOf('day').format()
      const endOfADay = moment(date).endOf('day').format()
      setCheckedInAtTime([startOfADay, endOfADay])
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

  const onClearSearch = () => {
    setSearch('')
  }

  const handleShowModal = () => setShowModal(show => !show)

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

  const handleModals = (type, id) => {
    if (id) {
      switch (type) {
        case 'details':
          setModalTitle('Details')
          setModalContent(<ViewMoreDetailsModalContent recordId={id} />)
          break
        case 'viewnotes':
          setModalTitle('Notes')

          setModalContent(<ViewNotesModalContent id={id} />)
          break
        case 'addnotes':
          setModalTitle('Add Note')
          setModalContent(<AddNoteModal forms={{ control, errors }} />)
          setModalTitle('Add Note')
          setModalType('addnotes')
          setRecordId(id)
          break
        default:
      }
    }
    setShowViewMoreDetails(show => !show)
  }

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

  const handleClearModal = () => setShowViewMoreDetails(false)

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
                : `Cancelled ${name} (${data?.getRegistryRecords?.count || 0})`}
            </b>
            <div className={styles.ReceptionistButtonCard}>
              <Can
                perform="guestanddeliveries:print"
                yes={
                  <PrintTable
                    header="Cancelled Visistor"
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
                no={
                  <PrintTable
                    header="Cancelled Visistor"
                    tableHeader={[]}
                    tableData={printableData}
                    subHeaders={[]}
                    disabled
                  />
                }
              />
              <Can
                perform="guestanddeliveries:download"
                yes={
                  <DownloadCSV
                    data={csvData}
                    title="Cancelled Visitor"
                    fileName="Cancelled"
                  />
                }
                no={
                  <DownloadCSV
                    data={csvData}
                    disabled
                    title="Cancelled Visitor"
                    fileName="Cancelled"
                  />
                }
              />

              <Can
                perform="guestanddeliveries:addschedule"
                yes={
                  <Button
                    primary
                    label={`Add ${name}`}
                    leftIcon={<BsPlusCircle />}
                    onClick={handleShowModal}
                  />
                }
                no={
                  <Button
                    primary
                    disabled
                    label={`Add ${name}`}
                    leftIcon={<BsPlusCircle />}
                    onClick={handleShowModal}
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
        onShowModal={handleModals}
        onOk={modalType === 'addnotes' && handleSubmit(handleAddNote)}
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

Cancelled.propTypes = {
  buildingId: P.string.isRequired,
  categoryId: P.string.isRequired,
  status: P.oneOfType[(P.string, P.array)],
  name: P.string.isRequired,
  buildingName: P.string
}

export default Cancelled
