import { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { FaEllipsisH } from 'react-icons/fa'
import { AiOutlineFileText } from 'react-icons/ai'
import P from 'prop-types'
import moment from 'moment'
import { debounce } from 'lodash'

import Table from '@app/components/table'
import Card from '@app/components/card'
import Button from '@app/components/button'
import Dropdown from '@app/components/dropdown'
import Pagination from '@app/components/pagination'

import { BsPlusCircle } from 'react-icons/bs'

import Modal from '@app/components/modal'
import PageLoader from '@app/components/page-loader'
import DownloadCSV from '@app/components/globals/DownloadCSV'
import PrintTable from '@app/components/globals/PrintTable'
import NotifCard from '@app/components/globals/NotifCard'

import { DATE } from '@app/utils'
import showToast from '@app/utils/toast'
import errorHandler from '@app/utils/errorHandler'

import DateAndSearch from '../DateAndSearch'
import ViewMoreDetailsModalContent from '../modals/ViewMoreDetailsModalContent'
import AddVisitorModal from '../modals/AddVisitorModal'
import AddNoteModal from '../modals/AddNoteModal'
import ViewNotesModalContent from '../modals/ViewNotesModalContent'

import { GET_REGISTRYRECORDS } from '../query'
import { ADD_NOTE } from '../mutation'

import Can from '@app/permissions/can'

import styles from '../main.module.css'

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

function Cancelled({
  buildingId,
  categoryId,
  status,
  name,
  buildingName,
  type,
  icon
}) {
  const [limitPage, setLimitPage] = useState(10)
  const [offsetPage, setOffsetPage] = useState(0)
  const [activePage, setActivePage] = useState(1)
  const [tableData, setTableData] = useState()
  const [date, setDate] = useState(new Date())
  const [searchText, setSearchText] = useState(null)
  const [checkedInAtTime, setCheckedInAtTime] = useState([
    moment(new Date()).startOf('day').format(),
    moment(new Date()).endOf('day').format()
  ])
  const [showViewMoreDetails, setShowViewMoreDetails] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [modalContent, setModalContent] = useState(null)
  const [modalTitle, setModalTitle] = useState(null)
  const [modalFooter, setModalFooter] = useState(true)
  const [recordId, setRecordId] = useState(null)
  const [modalType, setModalType] = useState(null)
  const [csvData, setCsvData] = useState([
    ['Cancelled Visitors'],
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

  const [
    addNote,
    { loading: loadingAddNote, called: calledAddNote, data: dataAddNote }
  ] = useMutation(ADD_NOTE, {
    onError: e => {
      errorHandler(e)
    }
  })

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
        updatedAt: checkedInAtTime,
        keyword: searchText || searchText !== '' ? searchText : null
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
    if (!loading) {
      if (error) {
        errorHandler(error)
      } else if (!error && data) {
        const tableData = []
        const tempIds = []
        const tempCSV = []
        setPrintableData([])
        setCsvData([
          ['Cancelled Visitors'],
          ['Building', buildingName],
          ['Date', DATE.toFriendlyDate(new Date())],
          [''],
          ['#', 'Unit No.', 'Unit Owner', "Visitor's Name", "Visitor's Company"]
        ])

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
              function: () => handleModals('details', registry._id)
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
                    <>
                      <Button
                        link
                        label={`View ${
                          registry.notesCount > 0
                            ? `(${registry.notesCount})`
                            : ''
                        }`}
                        onClick={e => handleModals('viewnotes', registry._id)}
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
                      onClick={e => handleModals('addnotes', registry._id)}
                      noBottomMargin
                    />
                  }
                />
              </div>
            ),
            options: (
              <Can
                perform="guestanddeliveries:view:cancel:message"
                yes={<Dropdown label={<FaEllipsisH />} items={dropdownData} />}
              />
            )
          })
          tempIds.push(registry._id)
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

  useEffect(() => {
    refetch()
  }, [])

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

  const handleSearch = debounce(e => {
    if (e.target.value === '') {
      setSearchText(null)
    } else {
      setSearchText(e.target.value)
    }
  }, 1000)

  const onClearSearch = () => setSearchText(null)

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
      const random = Math.random()
      reset()
      switch (type) {
        case 'details':
          setModalTitle('Details')
          setModalContent(
            <ViewMoreDetailsModalContent recordId={id} refetch={random} />
          )
          setModalFooter(null)
          break
        case 'viewnotes':
          setModalTitle('Notes')
          setModalContent(<ViewNotesModalContent id={id} refetch={random} />)
          setModalFooter(null)
          break
        case 'addnotes':
          setModalTitle('Add Note')
          setModalContent(<AddNoteModal forms={{ control, errors }} />)
          setModalTitle('Add Note')
          setModalType('addnotes')
          setRecordId(id)
          setModalFooter(true)
          break
        default:
      }
    }
    setShowViewMoreDetails(show => !show)
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

  const handleClearModal = () => setShowViewMoreDetails(false)

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
                : `Cancelled ${name} (${data?.getRegistryRecords?.count || 0})`}
            </b>
            <div className={styles.ReceptionistButtonCard}>
              <Can
                perform="guestanddeliveries:print"
                yes={
                  <PrintTable
                    header="Cancelled Visitors"
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
                    title="Cancelled Visitors"
                    fileName="cancelled_visitors"
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
      {!loading && tableData?.length !== 0 && (
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
        okText={modalType === 'addnotes' ? 'Submit' : 'Ok'}
        onClose={handleClearModal}
        onCancel={handleClearModal}
        onShowModal={handleModals}
        onOk={modalType === 'addnotes' ? handleSubmit(handleAddNote) : () => {}}
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
  buildingName: P.string,
  type: P.string.isRequired,
  icon: P.any.isRequired
}

export default Cancelled
