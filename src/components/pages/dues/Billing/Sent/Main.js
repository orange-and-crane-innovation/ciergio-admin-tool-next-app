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
import { FaEye, FaEllipsisH, FaPencilAlt, FaRegFileAlt } from 'react-icons/fa'
import { useQuery, useMutation } from '@apollo/client'
import P from 'prop-types'
import { toFriendlyDate } from '@app/utils/date'
import { useRouter } from 'next/router'
import Modal from '@app/components/modal'
import useKeyPress from '@app/utils/useKeyPress'
import HistoryBills from './Modals/HistoryBills'
import UpdateBills from './Modals/UpdateBills'
import * as Query from './Query'
import * as Mutation from './Mutation'

import Can from '@app/permissions/can'

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
  const router = useRouter()
  const { buildingID, categoryID } = router.query
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

  // graphQLFetching
  const { loading, data, error, refetch } = useQuery(
    Query.GET_DUES_PER_UNIT_SENT,
    {
      variables: {
        unit: {
          buildingId: buildingID,
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
          buildingId: buildingID,
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
      buildingId: buildingID
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
      if (dataUpdateDues?.updateDues?.message === 'success') {
        setShowModal(false)

        showToast('success', `You have successfully updated a billing`)
        refetch()
      }
    }
  }, [loadingUpdateDues, calledUpdateDues, dataUpdateDues])

  useEffect(() => {
    if (!duesLoading) {
      setCount(preState => ({ ...preState, ...duesData?.getDues?.count }))
    }
  }, [duesLoading, duesData, duesError])

  const getData = async items => {
    const newData = {
      id: items.id,
      data: {
        amount: items.amount,
        dueDate: items.dueDate,
        attachment: items.attachment
      }
    }

    try {
      await updateDues({
        variables: newData
      })
    } catch (e) {
      console.log(e)
    }
  }

  const isConfirm = confirmed => {
    if (confirmed) {
      handleShowModal(false)
    }
  }

  const handleShowModal = (type, id) => {
    const selected =
      !loading && data?.getDuesPerUnit?.data.find(due => due._id === id)
    console.log(selected)
    if (selected) {
      switch (type) {
        case 'update': {
          setModalTitle('Edit Billing')
          const amount = selected?.dues[0]?.amount
          const dueDate = selected?.dues[0]?.dueDate
          const fileUrl = selected?.dues[0]?.attachment?.fileUrl
          const id = selected?.dues[0]?._id

          setModalContent(
            <UpdateBills
              amount={amount}
              dueDate={dueDate}
              fileUrl={fileUrl}
              getData={getData}
              id={id}
              isClose={isConfirm}
            />
          )

          break
        }
        case 'details': {
          setModalTitle(`Unit ${selected.name} History`)
          setModalContent(<HistoryBills dues={selected?.dues} />)

          break
        }
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
            href={row?.dues[0]?.attachment?.fileUrl}
            className={styles.fileLink}
            target="_blank"
            rel="noreferrer"
          >
            View File
          </a>
        )
        const amount = `₱${row?.dues[0]?.amount.toFixed(2)}`
        const status =
          row?.dues[0]?.status === 'overdue' ||
          row?.dues[0]?.status === 'unpaid' ? (
            <Button className={styles.paid} disabled full label="Unpaid" />
          ) : (
            <Button full disabled onClick={() => alert('paid')} label="Paid" />
          )
        const seen = row?.dues[0]?.views.count ? <FaEye /> : null
        const dueDate = toFriendlyDate(row?.dues[0]?.dueDate)
        const unitName = row?.name
        const unitOwner = `${row?.unitOwner?.user?.lastName},
            ${row?.unitOwner?.user?.lastName.charAt(0)}`
        const dropDown = (
          <Can
            perform="dues:view::update"
            yes={<Dropdown label={<FaEllipsisH />} items={dropdownData} />}
          />
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
  }, [loading, data, error, refetch])

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
    setLimitPage(parseInt(e.value))
  }

  const handleOkModal = () => {
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
            <Can
              perform="dues:view"
              yes={<Table rowNames={tableRowData} items={dues} />}
              no={<Table rowNames={tableRowData} items={{ dues: [] }} />}
            />
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
        footer={null}
        onOk={handleOkModal}
        onCancel={() => setShowModal(old => !old)}
      >
        <div className="w-full px-5">{modalContent}</div>
      </Modal>
    </>
  )
}

Sent.propTypes = {
  month: P.number.isRequired,
  year: P.number.isRequired
}

export default Sent
