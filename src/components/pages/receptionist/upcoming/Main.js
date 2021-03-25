import { useState, useEffect } from 'react'
import DateAndSearch from '../DateAndSearch'
import Table from '@app/components/table'
import Card from '@app/components/card'
import styles from '../main.module.css'
import Button from '@app/components/button'
import Dropdown from '@app/components/dropdown'
import Pagination from '@app/components/pagination'
import { BsPlusCircle, BsTrash } from 'react-icons/bs'
import { useQuery } from '@apollo/client'
import { GET_REGISTRYRECORDS } from '../query'
import P from 'prop-types'
import { DATE } from '@app/utils'
import { FaEllipsisH } from 'react-icons/fa'
import { AiOutlineMessage, AiOutlineFileText } from 'react-icons/ai'
import moment from 'moment'
import useKeyPress from '@app/utils/useKeyPress'
import AddVisitorModal from '../modals/AddVisitorModal'

const COLCOUNT = 6
const dummyRow = [
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
    <div className="flex flex-col">
      <p className="text-gray-900">{top}</p>
      <p className="text-gray-400">{bottom}</p>
    </div>
  )
}

function Upcoming({ buildingId, categoryId, status, name }) {
  const [limitPage, setLimitPage] = useState(10)
  const [offsetPage, setOffsetPage] = useState(0)
  const [activePage, setActivePage] = useState(1)
  const [tableData, setTableData] = useState()
  const [search, setSearch] = useState(null)
  const [searchText, setSearchText] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const keyPressed = useKeyPress('Enter')
  console.log(status)

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
        keyword: search
      }
    }
  })

  useEffect(() => {
    if (!loading && !error && data) {
      console.log(data)
      const tableData = []
      data?.getRegistryRecords?.data.forEach((registry, index) => {
        const dropdownData = [
          {
            label: 'Message Resident',
            icon: <AiOutlineMessage />,
            function: () => console.log('Message Resident')
          },
          {
            label: 'View More Details',
            icon: <AiOutlineFileText />,
            function: () => console.log('View More Details')
          },
          {
            label: 'Cancel',
            icon: <BsTrash />,
            function: () => console.log('Cancel')
          }
        ]
        const dateUTC = new Date(+registry.checkedInAt)
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
          checkedIn: DATE.toFriendlyTime(dateUTC.toUTCString()),
          checkedOut: registry.checkedOutAt ? (
            DATE.toFriendlyTime(registry.checkedOutAt)
          ) : (
            <Button label="Checked Out" />
          ),
          addNote: <Button label="Add Note" />,
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

  const onPageClick = e => {
    setActivePage(e)
    setOffsetPage(limitPage * (e - 1))
  }

  const onLimitChange = e => {
    setLimitPage(parseInt(e.value))
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

  const handleShowModal = () => setShowModal(show => !show)

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
                : `Upcoming ${name} (${data?.getRegistryRecords?.count})`}
            </b>
            <Button
              primary
              label="Add Visitor"
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
        buildingId={buildingId}
        showModal={showModal}
        onShowModal={handleShowModal}
      />
    </>
  )
}

TableColStyle.propTypes = {
  top: P.oneOfType(P.string, P.array),
  bottom: P.string
}

Upcoming.propTypes = {
  buildingId: P.string.isRequired,
  categoryId: P.string.isRequired,
  status: P.oneOfType[(P.string, P.array)],
  name: P.string.isRequired
}

export default Upcoming
