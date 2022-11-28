import { debounce } from 'lodash'
import { useRouter } from 'next/router'
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useEffect, useMemo, useState } from 'react'
import { FaCaretDown, FaCaretUp, FaTimes } from 'react-icons/fa'
import { FiDownload } from 'react-icons/fi'
import { HiOutlinePrinter } from 'react-icons/hi'

import { useLazyQuery, useQuery } from '@apollo/client'
import Button from '@app/components/button'
import Card from '@app/components/card'
import DateRange from '@app/components/daterange'
import FormSelect from '@app/components/forms/form-select'
import PrimaryDataTable from '@app/components/globals/PrimaryDataTable'
import SearchControl from '@app/components/globals/SearchControl'
import SelectCompany from '@app/components/globals/SelectCompany'
import Tabs from '@app/components/tabs'
import {
  ACCOUNT_TYPES,
  PAYMENTMETHODS,
  TRANSACTIONSTATUS
} from '@app/constants'
import { ATTR, DATE } from '@app/utils'
import showToast from '@app/utils/toast'

import { GET_PAYMENT_METHODS, GET_TRANSACTIONS } from './queries'

function Transactions() {
  const router = useRouter()
  const [sort, setSort] = useState(-1)
  const [sortby, setSortBy] = useState('createdAt')
  const [searchText, setSearchText] = useState('')
  const [pageLimit, setPageLimit] = useState(10)
  const [offset, setPageOffset] = useState(0)
  const [activePage, setActivePage] = useState(1)
  const [selectedDate, setSelectedDate] = useState('all')
  const [selectedDateRange, setSelectedDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ])
  const [selectedPaymentType, setSelectedPaymentType] = useState()
  const [selectedCompany, setSelectedCompany] = useState()
  const [appliedDate, setAppliedDate] = useState()

  const profile = JSON.parse(localStorage.getItem('profile'))
  const accountType = profile?.accounts?.data[0]?.accountType
  const companyID = profile?.accounts?.data[0]?.company?._id
  const complexID = profile?.accounts?.data[0]?.complex?._id
  const pathname = router.pathname
  const isAdmin = accountType === ACCOUNT_TYPES.SUP.value
  const postID = router?.query?.id

  const [getDonations, { data: donations, loading, error }] = useLazyQuery(
    GET_TRANSACTIONS
  )

  const { data: dataPaymentMethod } = useQuery(GET_PAYMENT_METHODS)

  const DONATIONS = donations?.getDonationsWeb
  const PAYMENT_METHODS = dataPaymentMethod?.getPaymentMethods

  useEffect(() => {
    if (!loading && donations) {
      if (error) errorHandler(error)
    }
  }, [donations, loading, error])

  useEffect(() => {
    const where = {
      variables: {
        sort,
        offset,
        limit: pageLimit
      }
    }

    if (accountType === ACCOUNT_TYPES.COMPYAD.value) {
      where.variables.companyId = companyID
    } else if (accountType === ACCOUNT_TYPES.COMPXAD.value) {
      where.variables.complexId = complexID
    }

    if (searchText !== '') {
      where.variables.search = searchText
    }

    if (selectedCompany) {
      where.variables.companyId = selectedCompany
    }

    if (selectedPaymentType) {
      where.variables.paymentMethod = selectedPaymentType
    }

    if (appliedDate) {
      where.variables.date = appliedDate
    }

    if (postID) {
      where.variables.campaignId = postID
    }

    if (sortby) {
      where.variables.sortBy = sortby
    }

    getDonations(where)
  }, [
    sort,
    sortby,
    offset,
    pageLimit,
    searchText,
    selectedCompany,
    selectedPaymentType,
    appliedDate
  ])

  const tableRowNames = useMemo(
    () => [
      {
        name: (
          <div
            className="flex flex-nowrap items-center whitespace-nowrap cursor-pointer"
            onClick={() => {
              setSort(old => (old === -1 ? 1 : -1))
              setSortBy('createdAt')
            }}
          >
            <span>Date and Time </span>
            <span role="button" tabIndex={0} onKeyDown={() => {}}>
              {sortby === 'createdAt' ? (
                sort === -1 ? (
                  <FaCaretDown />
                ) : (
                  <FaCaretUp />
                )
              ) : (
                <FaCaretDown />
              )}
            </span>
          </div>
        ),
        width: ''
      },
      {
        name: (
          <div
            className="flex flex-nowrap items-center whitespace-nowrap cursor-pointer"
            onClick={() => {
              setSort(old => (old === -1 ? 1 : -1))
              setSortBy('status')
            }}
          >
            <span>Status </span>
            <span role="button" tabIndex={0} onKeyDown={() => {}}>
              {sortby === 'status' ? (
                sort === -1 ? (
                  <FaCaretDown />
                ) : (
                  <FaCaretUp />
                )
              ) : (
                <FaCaretDown />
              )}
            </span>
          </div>
        ),
        width: ''
      },
      {
        name: (
          <div
            className="flex flex-nowrap items-center whitespace-nowrap cursor-pointer"
            onClick={() => {
              setSort(old => (old === -1 ? 1 : -1))
              setSortBy('method')
            }}
          >
            <span>Name of Merchant </span>
            <span role="button" tabIndex={0} onKeyDown={() => {}}>
              {sortby === 'method' ? (
                sort === -1 ? (
                  <FaCaretDown />
                ) : (
                  <FaCaretUp />
                )
              ) : (
                <FaCaretDown />
              )}
            </span>
          </div>
        ),
        width: '',
        hidden: !isAdmin
      },
      {
        name: (
          <div
            className="flex flex-nowrap items-center whitespace-nowrap cursor-pointer"
            onClick={() => {
              setSort(old => (old === -1 ? 1 : -1))
              setSortBy('name')
            }}
          >
            <span>Name of Payor </span>
            <span role="button" tabIndex={0} onKeyDown={() => {}}>
              {sortby === 'name' ? (
                sort === -1 ? (
                  <FaCaretDown />
                ) : (
                  <FaCaretUp />
                )
              ) : (
                <FaCaretDown />
              )}
            </span>
          </div>
        ),
        width: ''
      },
      {
        name: (
          <div
            className="flex flex-nowrap items-center whitespace-nowrap cursor-pointer"
            onClick={() => {
              setSort(old => (old === -1 ? 1 : -1))
              setSortBy('amount')
            }}
          >
            <span>Amount Paid </span>
            <span role="button" tabIndex={0} onKeyDown={() => {}}>
              {sortby === 'amount' ? (
                sort === -1 ? (
                  <FaCaretDown />
                ) : (
                  <FaCaretUp />
                )
              ) : (
                <FaCaretDown />
              )}
            </span>
          </div>
        ),
        width: ''
      },
      {
        name: (
          <div className="flex flex-nowrap items-center whitespace-nowrap">
            <span>Bank Fees </span>
          </div>
        ),
        width: '',
        hidden: !isAdmin
      },
      {
        name: (
          <div className="flex flex-nowrap items-center whitespace-nowrap">
            <span>OCI Fees </span>
          </div>
        ),
        width: '',
        hidden: !isAdmin
      },
      {
        name: (
          <div
            className="flex flex-nowrap items-center whitespace-nowrap cursor-pointer"
            onClick={() => {
              setSort(old => (old === -1 ? 1 : -1))
              setSortBy('netAmount')
            }}
          >
            <span>Net Amount </span>
            <span role="button" tabIndex={0} onKeyDown={() => {}}>
              {sortby === 'netAmount' ? (
                sort === -1 ? (
                  <FaCaretDown />
                ) : (
                  <FaCaretUp />
                )
              ) : (
                <FaCaretDown />
              )}
            </span>
          </div>
        ),
        width: '',
        hidden: !isAdmin
      },
      {
        name: (
          <div
            className="flex flex-nowrap items-center whitespace-nowrap cursor-pointer"
            onClick={() => {
              setSort(old => (old === -1 ? 1 : -1))
              setSortBy('method')
            }}
          >
            <span>Type of Payment </span>
            <span role="button" tabIndex={0} onKeyDown={() => {}}>
              {sortby === 'method' ? (
                sort === -1 ? (
                  <FaCaretDown />
                ) : (
                  <FaCaretUp />
                )
              ) : (
                <FaCaretDown />
              )}
            </span>
          </div>
        ),
        width: ''
      },
      {
        name: (
          <div
            className="flex flex-nowrap items-center whitespace-nowrap cursor-pointer"
            onClick={() => {
              setSort(old => (old === -1 ? 1 : -1))
              setSortBy('transactionId')
            }}
          >
            <span>Transaction ID </span>
            <span role="button" tabIndex={0} onKeyDown={() => {}}>
              {sortby === 'transactionId' ? (
                sort === -1 ? (
                  <FaCaretDown />
                ) : (
                  <FaCaretUp />
                )
              ) : (
                <FaCaretDown />
              )}
            </span>
          </div>
        ),
        width: ''
      },
      {
        name: (
          <div
            className="flex flex-nowrap items-center whitespace-nowrap cursor-pointer"
            onClick={() => {
              setSort(old => (old === -1 ? 1 : -1))
              setSortBy('senderReferenceCode')
            }}
          >
            <span>Reference ID </span>
            <span role="button" tabIndex={0} onKeyDown={() => {}}>
              {sortby === 'senderReferenceCode' ? (
                sort === -1 ? (
                  <FaCaretDown />
                ) : (
                  <FaCaretUp />
                )
              ) : (
                <FaCaretDown />
              )}
            </span>
          </div>
        ),
        width: ''
      },
      {
        name: (
          <div
            className="flex flex-nowrap items-center whitespace-nowrap cursor-pointer"
            onClick={() => {
              setSort(old => (old === -1 ? 1 : -1))
              setSortBy('campaign')
            }}
          >
            <span>Campaign </span>
            <span role="button" tabIndex={0} onKeyDown={() => {}}>
              {sortby === 'campaign' ? (
                sort === -1 ? (
                  <FaCaretDown />
                ) : (
                  <FaCaretUp />
                )
              ) : (
                <FaCaretDown />
              )}
            </span>
          </div>
        ),
        width: ''
      }
    ],
    [sort]
  )

  const tableListData = useMemo(
    () => ({
      count: DONATIONS?.overallCount || 0,
      limit: DONATIONS?.limit || 0,
      offset: DONATIONS?.offset || 0,
      data:
        DONATIONS?.data?.length > 0
          ? DONATIONS?.data?.map((donation, index) => {
              return isAdmin
                ? {
                    date: (
                      <span className="whitespace-nowrap">
                        {DATE.friendlyDateTimeFormat(
                          `${donation.createdAt}`,
                          'MMM DD, YYYY - HH:mm A'
                        )}
                      </span>
                    ),
                    status: (
                      <>
                        <span
                          className={`bg-success-500 border flex items-center justify-center rounded-full flex-col md:flex-row text-white`}
                        >
                          {TRANSACTIONSTATUS[donation?.status]}
                        </span>
                      </>
                    ),
                    merchant: (
                      <span className="whitespace-nowrap">
                        {donation?.srcReference?.company?.name}
                      </span>
                    ),
                    payor: (
                      <span className="whitespace-nowrap">
                        {donation?.name}
                      </span>
                    ),
                    amount: <>{ATTR.toCurrency(donation?.amount)}</>,
                    bank_fees: <>{ATTR.toCurrency(donation?.bankCharges)}</>,
                    oci_fees: <>{ATTR.toCurrency(donation?.ociFee)}</>,
                    net_amount: <>{ATTR.toCurrency(donation?.netAmount)}</>,
                    type_payment: <>{donation.type || PAYMENTMETHODS[donation?.method]}</>,
                    transactions_id: <>{donation?.transactionId || donation?.gatewayTransactionId}</>,
                    ref_id: <>{donation?.senderReferenceCode}</>,
                    campaign: <>{donation?.campaign || '-'}</>
                  }
                : {
                    date: (
                      <span className="whitespace-nowrap">
                        {DATE.friendlyDateTimeFormat(
                          `${donation.createdAt}`,
                          'MMM DD, YYYY - HH:mm A'
                        )}
                      </span>
                    ),
                    status: (
                      <>
                        <span
                          className={`bg-success-500 border flex items-center justify-center rounded-full flex-col md:flex-row text-white`}
                        >
                          {TRANSACTIONSTATUS[donation?.status]}
                        </span>
                      </>
                    ),
                    payor: (
                      <span className="whitespace-nowrap">
                        {donation?.name}
                      </span>
                    ),
                    amount: <>{ATTR.toCurrency(donation?.amount)}</>,
                    type_payment: <>{donation.type || PAYMENTMETHODS[donation?.method] || '-'}</>,
                    transactions_id: <>{donation?.transactionId || donation?.gatewayTransactionId || '-'}</>,
                    ref_id: <>{donation?.senderReferenceCode || '-'}</>,
                    campaign: <>{donation?.campaign || '-'}</>
                  }
            })
          : []
    }),
    [donations]
  )

  const paymentOptions = useMemo(() => {
    return PAYMENT_METHODS?.data?.map(item => {
      return {
        label: item.label,
        value: item.value
      }
    })
  }, [PAYMENT_METHODS])

  const dateOptions = [
    {
      label: 'All Time',
      value: 'all'
    },
    {
      label: 'Chosen Time',
      value: 'selected'
    }
  ]

  const onSearch = debounce(e => {
    setSearchText(e.target.value !== '' ? e.target.value : null)
    resetPages()
  }, 1000)

  const onClearSearch = () => {
    setSearchText(null)
  }

  const resetPages = () => {
    setActivePage(1)
    setPageOffset(0)
  }

  const onDateChange = e => {
    setSelectedDate(e.value)

    if (e.value === 'all') {
      setAppliedDate(null)
    }
  }

  const onDateRangeChange = e => {
    setSelectedDateRange(e)
  }

  const onPaymentChange = e => {
    setSelectedPaymentType(e.value)
  }

  const onCompanyChange = e => {
    setSelectedCompany(e.value)
  }

  const onClearPayment = () => {
    setSelectedPaymentType(null)
  }

  const onClearDate = () => {
    setSelectedDate('all')
  }

  const onClearCompany = () => {
    setSelectedCompany(null)
  }

  const onDateApply = () => {
    setAppliedDate({
      from: DATE.toFriendlyISO(
        DATE.setInitialTime(selectedDateRange[0].startDate)
      ),
      to: DATE.toFriendlyISO(DATE.setEndTime(selectedDateRange[0].endDate))
    })
  }

  const onDateClear = () => {
    setAppliedDate(null)
  }

  const onClearFilterPost = () => {
    router.push(`/${pathname.split('/')[1]}`)
  }

  const errorHandler = data => {
    const errors = data ? JSON.parse(JSON.stringify(data)) : null

    if (errors) {
      const { graphQLErrors, networkError, message } = errors
      if (graphQLErrors)
        graphQLErrors.map(({ message, locations, path }) =>
          showToast('danger', message)
        )

      if (networkError?.result?.errors) {
        showToast('danger', errors?.networkError?.result?.errors[0]?.message)
      }

      if (
        message &&
        graphQLErrors?.length === 0 &&
        !networkError?.result?.errors
      ) {
        showToast('danger', message)
      }
    }
  }

  return (
    <div className="content-wrap">
      <h3 className="content-title">
        {pathname === '/offerings' || pathname === '/offerings/[id]'
          ? 'Offerings Monitor'
          : 'Transactions Monitor'}
      </h3>
      {/* <p className="text-base mb-6">via Credit/Debit Card</p> */}
      <Tabs defaultTab="1">
        <Tabs.TabLabels>
          <Tabs.TabLabel id="1">Transaction History</Tabs.TabLabel>
          <Tabs.TabLabel id="2">Manage QR Codes</Tabs.TabLabel>
        </Tabs.TabLabels>
        <Tabs.TabPanels>
          <Tabs.TabPanel id="1">
            <div className="flex items-center justify-between flex-col lg:flex-row">
              <div className="flex items-center justify-start w-full flex-col md:flex-row">
                <div className="w-full md:w-64 md:mr-2">
                  <FormSelect
                    id="date"
                    name="date"
                    options={dateOptions}
                    placeholder="Payment Method"
                    value={dateOptions.filter(
                      item => item.value === selectedDate
                    )}
                    onChange={onDateChange}
                    onClear={onClearDate}
                  />
                </div>

                <div className="w-full">
                  <DateRange
                    placeholder="Filter date"
                    isShown={selectedDate === 'selected'}
                    onDateChange={onDateRangeChange}
                    onDateApply={onDateApply}
                    onDateClear={onDateClear}
                    hasApplyButton
                    hasClear
                  />
                </div>
              </div>

              <div className="flex items-center justify-end w-full flex-col md:flex-row">
                {isAdmin && (
                  <SelectCompany
                    name="companyId"
                    type="active"
                    placeholder="Filter Company"
                    userType={accountType}
                    onChange={onCompanyChange}
                    onClear={onClearCompany}
                    selected={selectedCompany}
                  />
                )}

                <span className="mx-2 w-full md:max-w-xs">
                  <FormSelect
                    id="paymentType"
                    name="paymentType"
                    options={paymentOptions || []}
                    placeholder="Payment Method"
                    value={paymentOptions?.filter(
                      item => item.value === selectedPaymentType
                    )}
                    onChange={onPaymentChange}
                    onClear={onClearPayment}
                    isClearable
                  />
                </span>

                <SearchControl
                  placeholder="Search All"
                  searchText={searchText}
                  onSearch={onSearch}
                  onClearSearch={onClearSearch}
                />
              </div>
            </div>

            {postID && DONATIONS?.campaign?.title && (
              <h3 className="pt-4 pb-6 font-semibold text-lg flex items-center">
                <span>{`Filtered to "${DONATIONS?.campaign?.title}" donations`}</span>
                <Button
                  label="Clear Filter"
                  leftIcon={<FaTimes />}
                  link
                  noBottomMargin
                  onClick={onClearFilterPost}
                />
              </h3>
            )}

            <div className="p-4 mb-4 bg-secondary-50 border border-secondary-200 flex items-start justify-start text-base rounded-md flex-col md:flex-row">
              <span className="mr-4">
                No of transactions:{' '}
                <span className="text-info-900 font-semibold">
                  {DONATIONS?.overallCount ?? 0}
                </span>
              </span>
              <span className="mr-4">
                Total Amount:{' '}
                <span className="text-info-900 font-semibold">
                  PHP {ATTR.toCurrency(DONATIONS?.overallTotal ?? 0, true)}
                </span>
              </span>
              <span className="mr-4">
                Receivable Amount:{' '}
                <span className="text-info-900 font-semibold">
                  PHP {ATTR.toCurrency(DONATIONS?.overallTotalNet ?? 0, true)}
                </span>
              </span>
            </div>

            <div className="flex items-center justify-between bg-white border-t border-l border-r rounded-t">
              <h1 className="font-bold text-base px-8 py-4">{`Recent Transactions `}</h1>
              <div className="flex items-center">
                <Button
                  default
                  icon={<HiOutlinePrinter />}
                  onClick={() => {}}
                  className="mr-4 mt-4"
                />
                <Button
                  default
                  icon={<FiDownload />}
                  onClick={() => {}}
                  className="mr-4 mt-4"
                />
              </div>
            </div>

            <Card
              content={
                <PrimaryDataTable
                  data={tableListData}
                  columns={tableRowNames}
                  loading={loading}
                  currentPage={activePage}
                  pageLimit={pageLimit}
                  setCurrentPage={setActivePage}
                  setPageOffset={setPageOffset}
                  setPageLimit={setPageLimit}
                  className="overflow-x-auto"
                />
              }
            />
          </Tabs.TabPanel>
        </Tabs.TabPanels>
      </Tabs>
    </div>
  )
}

export default Transactions
