import { useState, useEffect } from 'react'
import styles from './Main.module.css'
import SearchControl from '@app/components/globals/SearchControl'
import Button from '@app/components/button'
import Dropdown from '@app/components/dropdown'
import Table from '@app/components/table'
import Pagination from '@app/components/pagination'
import Card from '@app/components/card'
import FormSelect from '@app/components/globals/FormSelect'
import PageLoader from '@app/components/page-loader'
import showToast from '@app/utils/toast'

import {
  FaEye,
  FaEllipsisH,
  FaPencilAlt,
  FaRegFileAlt,
  FaBullseye
} from 'react-icons/fa'
import { useQuery, useMutation } from '@apollo/client'
import P from 'prop-types'
import { toFriendlyDate } from '@app/utils/date'
import Modal from '@app/components/modal'
import useKeyPress from '@app/utils/useKeyPress'
import HistoryBills from './Cards/HistoryBills'
import UpdateBills from './Cards/UpdateBills'
import * as Query from './Query'
import * as Mutation from './Mutation'

const statusOptions = [
  {
    label: 'All Status',
    value: null
  },
  {
    label: 'Paid',
    value: 'paid'
  },
  {
    label: 'Unpaid',
    value: 'unpaid'
  }
]

const tableRowData = [
  {
    name: 'Floor',
    width: '10%'
  },
  {
    name: 'Seen',
    width: '5%'
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
    name: 'Amount ',
    width: '10%'
  },
  {
    name: 'Due Date',
    width: '20%'
  },
  {
    name: 'Paid',
    width: '10%'
  },
  {
    name: '',
    width: '10%'
  }
]

function Sent({ month, year }) {
  const [limitPage, setLimitPage] = useState(10)
  const [activePage, setActivePage] = useState(1)
  const [offsetPage, setOffsetPage] = useState(0)
  const [dues, setDues] = useState()
  const [floors, setFloors] = useState([])
  const [floorNumber, setFloorNumber] = useState('all')
  const [count, setCount] = useState({
    all: 0,
    seen: 0
  })
  const [modalTitle, setModalTitle] = useState('')
  const [modalContent, setModalContent] = useState()
  const [showModal, setShowModal] = useState(false)
  const [searchText, setSearchText] = useState(null)
  const [search, setSearch] = useState(null)

  const keyPressed = useKeyPress('Enter')

  const [status, setStatus] = useState([])

  const [modalFooter, setModalFooter] = useState(false)
  const [confirmationModal, setConfirmationModal] = useState()
  const [updateDuesId, setUpdateDuesId] = useState()

  // graphQLFetching
  const { loading, data, error, refetch } = useQuery(
    Query.GET_DUES_PER_UNIT_SENT,
    {
      variables: {
        unit: {
          buildingId: '5d804d6543df5f4239e72911',
          search: search,
          floorNumber: floorNumber
        },
        filter: {
          sent: true,
          status: status
        },
        dues: {
          period: {
            month: month,
            year: year
          }
        },
        limit: 10,
        offset: offsetPage
      }
    }
  )

  const { loading: duesLoading, data: duesData, error: duesError } = useQuery(
    Query.GETDEUS_QUERY,
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

  const {
    loading: loadingFloorNumbers,
    error: errorGetAllFloors,
    data: dataAllFloors
  } = useQuery(Query.GET_ALL_FLOORS, {
    variables: {
      buildingId: '5d804d6543df5f4239e72911'
    }
  })

  const [
    updateDues,
    {
      loading: loadingUpdateDues,
      called: calledUpdateDues,
      data: dataUpdateDues
    }
  ] = useMutation(Mutation.UPDATE_DUES)

  useEffect(() => {
    if (!loadingUpdateDues && calledUpdateDues && dataUpdateDues) {
      console.log('yow')
      if (dataUpdateDues?.data?.updateDues?.message === 'success') {
        setShowModal(show => !show)
        setConfirmationModal(show => !show)
        showToast('success', `You have successfully updated a billing`)
        refetch()
      } else {
        setShowModal(show => !show)
        setConfirmationModal(show => !show)
        showToast('warning', dataUpdateDues?.errors[0]?.message)
      }
    }
  }, [loadingUpdateDues, calledUpdateDues, dataUpdateDues])

  useEffect(() => {
    if (!duesLoading) {
      setCount(preState => ({ ...preState, ...duesData?.getDues?.count }))
    }
  }, [duesLoading, duesData, duesError])

  const handleShowModal = (type, id) => {
    const selected =
      !loading && data?.getDuesPerUnit?.data.find(due => due._id === id)
    console.log(selected)
    if (selected) {
      switch (type) {
        case 'update':
          setModalTitle('Edit Billing')
          setModalContent(
            <UpdateBills
              amount={selected?.dues[0]?.amount}
              dueDate={selected?.dues[0]?.dueDate}
              fileUrl={selected?.dues[0]?.attachment.fileUrl}
            />
          )
          setUpdateDuesId(selected?._id)
          setModalFooter(true)
          break
        case 'details':
          setModalTitle(`Unit ${selected.name} History`)
          setModalContent(<HistoryBills dues={selected?.dues} />)

          break
      }
    }

    setShowModal(open => !open)
  }

  const handleClearModal = () => {
    handleShowModal()
  }
  // Hooks for formatting table row
  const useTableRows = rows => {
    const rowData = []
    let num = 0

    if (rows) {
      rows.forEach(row => {
        const dropdownData = [
          {
            label: 'Update Bills',
            icon: <FaPencilAlt />,
            function: () => handleShowModal('update', row?._id)
          },
          {
            label: 'Bills Details',
            icon: <FaRegFileAlt />,
            function: () => handleShowModal('details', row?._id)
          }
        ]
        if (num !== row.floorNumber) {
          rowData.push({
            floorNumber: row.floorNumber,
            b: '',
            bl: '',
            bla: '',
            blan: '',
            blank: '',
            blankrow: '',
            blankrowspa: '',
            blankrowspan: ''
          })
        }

        const attachment = (
          <a
            href={row?.dues[0]?.attachment.fileUrl}
            className={styles.fileLink}
          >
            View File
          </a>
        )
        const amount = `₱${row?.dues[0]?.amount.toFixed(2)}`
        const status =
          row?.dues[0]?.status === 'overdue' ||
          row?.dues[0]?.status === 'unpaid' ? (
            <Button
              className={styles.paid}
              disabled
              full
              label="Unpaid"
              onClick={() => alert('unpaid')}
            />
          ) : (
            <Button full onClick={() => alert('paid')} label="Paid" />
          )
        const seen = row?.dues[0]?.views.count ? <FaEye /> : null
        const dueDate = toFriendlyDate(row?.dues[0]?.dueDate)
        const unitName = row?.name
        const unitOwner = `${row?.unitOwner?.user?.lastName},
          ${row?.unitOwner?.user?.lastName.charAt(0)}`
        const dropDown = (
          <Dropdown label={<FaEllipsisH />} items={dropdownData} />
        )
        rowData.push({
          floor: '',
          seen,
          unitName,
          unitOwner,
          attachment,
          amount,
          dueDate,
          status,
          dropDown
        })

        num = row.floorNumber
      })
    }
    return rowData
  }

  const table = useTableRows(!loading && data && data?.getDuesPerUnit?.data)
  // Component did mount for generating table data

  useEffect(() => {
    if (!loading && data && !error) {
      const duesData = {
        count: data?.getDuesPerUnit.count || 0,
        limit: data?.getDuesPerUnit.limit || 0,
        offset: data?.getDuesPerUnit.offset || 0,
        data: table || []
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
    if (!loadingFloorNumbers && !errorGetAllFloors) {
      optionsData = dataAllFloors?.getFloorNumbers.map(floor => {
        return { label: floor, value: floor }
      })
    }

    setFloors(optionsData)
  }, [loadingFloorNumbers, dataAllFloors, errorGetAllFloors])

  //   Select Floors onchange
  const onFloorSelect = e => {
    setFloorNumber(e.target.value)
  }
  // =============

  const onStatusSelect = e => {
    const value =
      e.target.value === 'paid' ? ['settled'] : ['overdue', 'unpaid']
    setStatus(value)
  }

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

  const handleOkModal = () => {
    setConfirmationModal(show => !show)
    setShowModal(show => !show)
  }

  const handleConfirmUpdate = async () => {
    const data = { amount: 20, dueDate: new Date(), attachment: null }

    try {
      await updateDues({
        variables: {
          data,
          id: updateDuesId
        }
      })
    } catch (e) {
      console.log(e)
    }
  }

  const handleClearConfirmationModal = () => {
    setConfirmationModal(show => !show)
    setShowModal(show => !show)
  }

  return (
    <>
      <div className={styles.FormContainer}>
        <div className={styles.StatusFloorControl}>
          <FormSelect
            onChange={onStatusSelect}
            options={statusOptions}
            classNames="mb-4"
          />
          <FormSelect
            placeholder="All Floors"
            onChange={onFloorSelect}
            options={floors}
            classNames="mb-4"
          />
          <SearchControl
            placeholder="Search by unit"
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
              <FaEye />
              <div>
                Bills viewed &nbsp;
                <span className={styles.BoldText}>{count?.seen}</span>/
                {count?.all}
                &nbsp;bills
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
        title={modalTitle}
        okText="Submit"
        visible={showModal}
        onClose={handleClearModal}
        footer={modalFooter}
        onOk={handleOkModal}
        onCancel={() => setShowModal(old => !old)}
      >
        <div className="w-full px-5">{modalContent}</div>
      </Modal>

      <Modal
        title=""
        okText="Confirm"
        visible={confirmationModal}
        onClose={handleClearConfirmationModal}
        onOk={handleConfirmUpdate}
        cancelText="Cancel"
        onCancel={() => setConfirmationModal(old => !old)}
      >
        <div className="w-full p-12">
          <p className="text-4xl text-gray-500">
            The resident may have already seen the file, but you can update the
            document if you made a mistake. Are you sure you want to update this
            file?
          </p>
        </div>
      </Modal>
    </>
  )
}

Sent.prototype = {
  month: P.number.isRequired,
  year: P.number.isRequired
}

export default Sent
