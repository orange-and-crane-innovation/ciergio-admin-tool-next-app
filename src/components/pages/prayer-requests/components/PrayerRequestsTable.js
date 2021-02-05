import { useState, useMemo } from 'react'
import { useQuery } from '@apollo/client'
import P from 'prop-types'

import FormInput from '@app/components/forms/form-input'
import Dropdown from '@app/components/dropdown'
import Card from '@app/components/card'
import PrimaryDataTable from '@app/components/globals/PrimaryDataTable'

import dayjs, { friendlyDateTimeFormat } from '@app/utils/date'

import { AiOutlineEllipsis } from 'react-icons/ai'
import { FaTimes, FaSearch } from 'react-icons/fa'

const columns = [
  {
    name: 'Date Created',
    width: ''
  },
  {
    name: 'Title',
    width: ''
  },
  {
    name: 'Requestor',
    width: ''
  },
  {
    name: 'Last Update',
    width: ''
  },
  {
    name: '',
    width: ''
  }
]

function PrayerRequestsTable({ queryTemplate, type }) {
  const [searchText, setSearchText] = useState('')
  const [pageLimit, setPageLimit] = useState(10)
  const [offset, setPageOffset] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  const { data, loading } = useQuery(queryTemplate, {
    variables: {
      complexId: '5f291193643d6011be2d280b',
      offset,
      limit: pageLimit,
      search: searchText
    }
  })

  const prayerRequests = data?.getIssues

  const onPageClick = e => {
    setCurrentPage(e)
    setPageOffset(e * pageLimit)
  }

  const onLimitChange = limit => setPageLimit(Number(limit.value))

  const tableData = useMemo(() => {
    return {
      count: prayerRequests?.count || 0,
      limit: prayerRequests?.limit || 10,
      offset: prayerRequests?.offset || 0,
      data:
        prayerRequests?.issue?.length > 0
          ? prayerRequests.issue.map(
              ({ category, prayer, reporter, createdAt, updatedAt }) => {
                const dropdownData = [
                  {
                    label: 'View Details',
                    icon: <span className="ciergio-file" />,
                    function: () => {}
                  }
                ]
                return {
                  dateCreated: friendlyDateTimeFormat(
                    dayjs(Number(createdAt)),
                    'LL'
                  ),
                  title: (
                    <p>
                      <span>{category.name}</span> - <span>{prayer.from}</span>
                    </p>
                  ),
                  requestor: <span>{`${reporter.user.firstName}`}</span>,
                  lastUpdate: friendlyDateTimeFormat(
                    dayjs(Number(updatedAt)),
                    'LL'
                  ),
                  button: (
                    <Dropdown
                      label={<AiOutlineEllipsis />}
                      items={dropdownData}
                    />
                  )
                }
              }
            )
          : []
    }
  }, [prayerRequests])
  console.log({ prayerRequests })
  return (
    <>
      <div className="flex items-center justify-end">
        <div className="w-2/12 md:w-120 md:ml-2 relative">
          <FormInput
            name="search"
            placeholder="Search"
            inputClassName="pr-8"
            onChange={e => {
              if (e.target.value !== '') {
                setSearchText(e.target.value)
              } else {
                setSearchText(null)
              }
            }}
            value={searchText}
          />
          <span className="absolute top-4 right-4">
            {searchText ? (
              <FaTimes className="cursor-pointer" onClick={() => {}} />
            ) : (
              <FaSearch />
            )}
          </span>
        </div>
      </div>
      <Card
        noPadding
        header={
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xl">Prayer Requests</h3>
          </div>
        }
        content={
          <PrimaryDataTable
            columns={columns}
            data={tableData}
            loading={loading}
            currentPage={currentPage}
            onPageChange={onPageClick}
            onPageLimitChange={onLimitChange}
          />
        }
        className="rounded-t-none"
      />
    </>
  )
}

PrayerRequestsTable.propTypes = {
  queryTemplate: P.object,
  type: P.string
}

export default PrayerRequestsTable
