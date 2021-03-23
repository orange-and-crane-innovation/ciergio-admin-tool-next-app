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

const UnitStyle = ({ unitNumber, unitOwnerName }) => {
  return (
    <div className="flex flex-col">
      <b>{unitNumber}</b>
      <p className="text-gray-600">{unitOwnerName}</p>
    </div>
  )
}

function Cancelled({ buildingId, categoryId, status }) {
  const [limitPage, setLimitPage] = useState(10)
  const [offsetPage, setOffsetPage] = useState(0)
  const [sortBy, setSortBy] = useState('checkedIn')
  const [activePage, setActivePage] = useState(1)
  const [tableData, setTableData] = useState()

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
        checkedInAt: ['2021-03-23T00:00:00+08:00', '2021-03-23T23:59:59+08:00'],
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
            <UnitStyle
              key={index}
              unitNumber={`${registry.forWhat.name}`}
              unitOwnerName={`${registry.forWho.user.firstName} ${registry.forWho.user.lastName}`}
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
  return (
    <>
      <DateAndSearch />
      <Card
        noPadding
        header={
          <div className={styles.ReceptionistCardHeaderContainer}>
            <b className={styles.ReceptionistCardHeader}>Cancelled Logbook</b>
            <div className={styles.ReceptionistButtonCard}>
              <Button icon={<FiPrinter />} />
              <Button icon={<FiDownload />} />
              <Button
                primary
                label="Add Visitor"
                leftIcon={<BsPlusCircle />}
                onClick={addVisitor}
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
    </>
  )
}

UnitStyle.propTypes = {
  unitNumber: P.oneOfType(P.string, P.array),
  unitOwnerName: P.string.isRequired
}

Cancelled.propTypes = {
  buildingId: P.string.isRequired,
  categoryId: P.string.isRequired,
  status: P.oneOfType[(P.string, P.array)]
}

export default Cancelled
