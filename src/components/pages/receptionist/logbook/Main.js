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

const UnitStyle = ({ unitNumber, unitOwnerName }) => {
  return (
    <div className="flex flex-col">
      <b>{unitNumber}</b>
      <p>{unitOwnerName}</p>
    </div>
  )
}

function LogBook({ buildingId, categoryId, status }) {
  const [limitPage, setLimitPage] = useState(10)
  const [offsetPage, setOffsetPage] = useState(0)
  const [sortBy, setSortBy] = useState('checkedIn')
  const [activePage, setActivePage] = useState(1)
  const [tableData, setTableData] = useState()
  const [date, setDate] = useState(new Date())
  const [search, setSearch] = useState('')
  const [checkedInAtTime, setCheckedInAtTime] = useState([
    moment(new Date()).startOf('day').format(),
    moment(new Date()).endOf('day').format()
  ])

  const { loading, error, data, refetch } = useQuery(GET_REGISTRYRECORDS, {
    variables: {
      limit: limitPage,
      offset: offsetPage,
      sort: 1,
      sortBy,
      where: {
        buildingId,
        categoryId,
        status,
        checkedInAt: checkedInAtTime,
        keyword: null
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
            <UnitStyle
              key={index}
              unitNumber={`${registry.forWhat.name}`}
              unitOwnerName={`${registry.forWho.user.firstName} ${registry.forWho.user.lastName}`}
            />
          ),
          personCompany: `${registry.visitor.firstName} ${registry.visitor.lastName}`,
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

  const addVisitor = e => {
    e.preventDefault()
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
    console.log(checkedInAtTime)
  }, [checkedInAtTime])

  const handleSearch = e => {
    setSearch(e.target.value)
  }
  return (
    <>
      <DateAndSearch
        date={date}
        handleDateChange={handleDateChange}
        search={search}
        handleSearchChange={handleSearch}
        showTableData={clickShowButton}
      />
      <Card
        noPadding
        header={
          <div className={styles.ReceptionistCardHeaderContainer}>
            <b className={styles.ReceptionistCardHeader}>Visitors Logbook</b>
            <Button
              primary
              label="Add Visitor"
              leftIcon={<BsPlusCircle />}
              onClick={addVisitor}
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
    </>
  )
}

UnitStyle.propTypes = {
  unitNumber: P.oneOfType(P.string, P.array),
  unitOwnerName: P.string.isRequired
}

LogBook.propTypes = {
  buildingId: P.string.isRequired,
  categoryId: P.string.isRequired,
  status: P.oneOfType[(P.string, P.array)]
}

export default LogBook
