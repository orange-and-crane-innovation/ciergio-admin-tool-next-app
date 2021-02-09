import { useState, useMemo } from 'react'
import { useQuery } from '@apollo/client'

import Tabs from '@app/components/tabs'
import Card from '@app/components/card'
import FormInput from '@app/components/forms/form-input'
import PrimaryDataTable from '@app/components/globals/PrimaryDataTable'

import { FaCaretDown, FaCaretUp, FaTimes, FaSearch } from 'react-icons/fa'

import { friendlyDateTimeFormat } from '@app/utils/date'
import { GET_DONATIONS } from './queries'

function Donations() {
  const [sort, setSort] = useState(-1)
  const [searchText, setSearchText] = useState('')
  const [pageLimit, setPageLimit] = useState(10)
  const [offset, setPageOffset] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  const { data: donations, loading: loadingDonations } = useQuery(
    GET_DONATIONS,
    {
      variables: {
        complexId: '5f291193643d6011be2d280b',
        sort,
        offset,
        limit: pageLimit,
        search: searchText
      }
    }
  )

  const DONATIONS = donations?.getDonations

  const onPageClick = e => {
    setCurrentPage(e)
    setPageOffset(e * pageLimit)
  }

  const onLimitChange = limit => setPageLimit(Number(limit.value))

  const columns = useMemo(
    () => [
      {
        name: (
          <div className="flex items-center">
            <span>Date</span>{' '}
            <span
              role="button"
              tabIndex={0}
              onKeyDown={() => {}}
              onClick={() => setSort(old => (old === -1 ? 1 : -1))}
            >
              {sort === -1 ? <FaCaretDown /> : <FaCaretUp />}
            </span>
          </div>
        ),
        width: ''
      },
      {
        name: 'Donor',
        width: ''
      },
      {
        name: 'Amount Donated',
        width: ''
      },
      {
        name: 'Bank Charges',
        width: ''
      },
      {
        name: 'OCI Fee',
        width: ''
      },
      {
        name: 'Net Amount',
        width: ''
      },
      {
        name: 'Order ID',
        width: ''
      },
      {
        name: 'Transaction ID',
        width: ''
      }
    ],
    [sort]
  )

  const tableData = useMemo(() => {
    return {
      count: DONATIONS?.count || 0,
      limit: DONATIONS?.limit || 10,
      offset: DONATIONS?.offset || 0,
      data:
        DONATIONS?.data?.length > 0
          ? DONATIONS.data.map(donation => {
              return {
                date: friendlyDateTimeFormat(donation.createdAt, 'LLL')
              }
            })
          : []
    }
  }, [DONATIONS])
  return (
    <div className="content-wrap">
      <h3 className="content-title">Donations Monitor</h3>
      <p className="text-base mb-6">via Credit/Debit Card</p>
      <Tabs defaultTab="1">
        <Tabs.TabLabels>
          <Tabs.TabLabel id="1">Overview</Tabs.TabLabel>
        </Tabs.TabLabels>
        <Tabs.TabPanels>
          <Tabs.TabPanel id="1">
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
                  <h3 className="font-bold text-xl">Recent Donations</h3>
                </div>
              }
              content={
                <PrimaryDataTable
                  columns={columns}
                  data={tableData}
                  loading={loadingDonations}
                  currentPage={currentPage}
                  onPageChange={onPageClick}
                  onPageLimitChange={onLimitChange}
                />
              }
              className="rounded-t-none"
            />
          </Tabs.TabPanel>
        </Tabs.TabPanels>
      </Tabs>
    </div>
  )
}

export default Donations
