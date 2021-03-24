import { useState, useEffect } from 'react'
import DateAndSearch from '../DateAndSearch'
import Table from '@app/components/table'
import Card from '@app/components/card'
import styles from '../main.module.css'
import Button from '@app/components/button'
import Dropdown from '@app/components/dropdown'
import Pagination from '@app/components/pagination'
import { FiPrinter, FiDownload } from 'react-icons/fi'
import { BsPlusCircle } from 'react-icons/bs'
import { useQuery } from '@apollo/client'
import { GET_REGISTRYRECORDS } from '../query'
import P from 'prop-types'
import { FaEllipsisH } from 'react-icons/fa'
import { AiOutlineFileText } from 'react-icons/ai'
import moment from 'moment'
import AddVisitorModal from '../modals/AddVisitorModal'

const dummyRow = [
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

function Cancelled({ buildingId, categoryId, status, name }) {
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
  const [showModal, setShowModal] = useState(false)

  const { loading, error, data } = useQuery(GET_REGISTRYRECORDS, {
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
            label: 'View More Details',
            icon: <AiOutlineFileText />,
            function: () => console.log('View More Details')
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
          personCompany: `${registry.visitor.firstName} ${registry.visitor.lastName}`,
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

  const handleSearch = e => {
    setSearch(e.target.value)
  }

  const onClearSearch = () => {
    setSearch('')
  }

  const handleShowModal = () => setShowModal(show => !show)

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
                : `Cancelled ${name} (${data?.getRegistryRecords?.count})`}
            </b>
            <div className={styles.ReceptionistButtonCard}>
              <Button icon={<FiPrinter />} />
              <Button icon={<FiDownload />} />
              <Button
                primary
                label="Add Visitor"
                leftIcon={<BsPlusCircle />}
                onClick={handleShowModal}
              />
            </div>
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
      <AddVisitorModal showModal={showModal} onShowModal={handleShowModal} />
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
  name: P.string.isRequired
}

export default Cancelled
