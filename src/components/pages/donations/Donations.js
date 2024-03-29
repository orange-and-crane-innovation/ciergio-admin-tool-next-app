/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useLazyQuery, useQuery } from '@apollo/client'
import { debounce } from 'lodash'
import { FaCaretDown, FaCaretUp, FaTimes } from 'react-icons/fa'

import Tabs from '@app/components/tabs'
import Card from '@app/components/card'
import FormSelect from '@app/components/forms/form-select'
import Table from '@app/components/table'
import PageLoader from '@app/components/page-loader'
import Pagination from '@app/components/pagination'
import Tooltip from '@app/components/tooltip'
import Button from '@app/components/button'

import { DATE, ATTR, TOOLTIP } from '@app/utils'
import showToast from '@app/utils/toast'
import { ACCOUNT_TYPES } from '@app/constants'

import SearchControl from '@app/components/globals/SearchControl'
import SelectCompany from '@app/components/globals/SelectCompany'
import DateRange from '@app/components/daterange'

import { GET_DONATIONS, GET_PAYMENT_METHODS } from './queries'

function Donations() {
  const router = useRouter()
  const [donationLists, setDonationLists] = useState()
  const [sort, setSort] = useState(-1)
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

  const [
    getDonations,
    { data: donations, loading: loadingDonations, error }
  ] = useLazyQuery(GET_DONATIONS)

  const { data: dataPaymentMethod } = useQuery(GET_PAYMENT_METHODS)

  const DONATIONS = donations?.getDonationsWeb
  const PAYMENT_METHODS = dataPaymentMethod?.getPaymentMethods

  useEffect(() => {
    if (!loadingDonations && donations) {
      TOOLTIP.Refresh()
      setDonationLists({
        count: DONATIONS?.overallCount || 0,
        limit: DONATIONS?.limit || 0,
        offset: DONATIONS?.offset || 0,
        data: {
          length: DONATIONS?.data?.reduce((prev, cur) => prev + cur.count, 0)
        }
      })
    }
  }, [donations, loadingDonations])

  useEffect(() => {
    if (error) {
      errorHandler(error)
    } else {
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

      getDonations(where)
    }
  }, [
    error,
    sort,
    offset,
    pageLimit,
    searchText,
    selectedCompany,
    selectedPaymentType,
    appliedDate
  ])

  const columns = useMemo(
    () => [
      {
        name: (
          <div className="flex items-center">
            <span>Date </span>
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
        width: '10%'
      },
      {
        name: 'Donor',
        width: '15%'
      },
      {
        name: 'Amount',
        width: '5%'
      },
      {
        name: 'Campaign',
        width: '15%'
      },
      {
        name: 'Transaction Fees',
        width: '7%',
        hidden: isAdmin
      },
      {
        name: 'Bank Charges',
        width: '7%',
        hidden: !isAdmin
      },
      {
        name: 'OCI Fee',
        width: '6%',
        hidden: !isAdmin
      },
      {
        name: 'Net Amount',
        width: '10%'
      },
      {
        name: 'Reference',
        width: '25%'
      }
    ],
    [sort]
  )

  const tableData = useMemo(() => {
    return DONATIONS?.data?.map((donation, index) => [
      <tr key={index}>
        <td colSpan={8} className="text-info-900 font-black bg-white">
          <Tooltip text={donation.date?.year} effect="solid">
            {DATE.friendlyDateTimeFormat(
              `${donation.date?.month} ${donation.date?.day}, ${donation.date?.year}`,
              'MMM DD'
            )}
          </Tooltip>
          <span className="text-sm mx-2">|</span>
          <span className="text-sm mr-4">Total:</span>
          <span className="text-sm">{ATTR.toCurrency(donation?.total)}</span>
        </td>
      </tr>,
      donation?.data?.map((item, index2) => {
        const rowColor =
          index2 % 2 === 0
            ? { backgroundColor: 'white' }
            : { backgroundColor: '#F5F6FA' }
        const transFee = item?.bankCharges + item?.ociFee

        return (
          <tr key={index2} style={rowColor}>
            <td>{DATE.friendlyDateTimeFormat(item?.createdAt, 'hh:mm A')}</td>
            <td>
              <div className="flex flex-col text-sm">
                <strong>{item?.name}</strong>
                {item?.email && (
                  <span className="text-neutral-500">{item?.email}</span>
                )}
                {isAdmin && item?.srcReference?.company?.name && (
                  <span data-tip="Company">
                    {item?.srcReference?.company?.name}
                  </span>
                )}
              </div>
            </td>
            <td>{ATTR.toCurrency(item?.amount)}</td>
            <td>
              {item?.campaign?.title ? (
                <Link href={`/posts/view/${item?.campaign?._id}`}>
                  <a className="mr-2 hover:underline" target="_blank">
                    {item?.campaign?.title}
                  </a>
                </Link>
              ) : (
                '-'
              )}
            </td>
            {!isAdmin && <td>{ATTR.toCurrency(transFee)}</td>}
            {isAdmin && <td>{ATTR.toCurrency(item?.bankCharges)}</td>}
            {isAdmin && <td>{ATTR.toCurrency(item?.ociFee)}</td>}
            <td>{ATTR.toCurrency(item?.netAmount)}</td>
            <td>
              <div className="flex flex-col text-sm">
                {item?.senderReferenceCode && (
                  <span>
                    <strong>Reference ID: </strong>
                    {item?.senderReferenceCode}
                  </span>
                )}
                {item?.transactionId && (
                  <span>
                    <strong>Trans ID: </strong>
                    {item?.transactionId}
                  </span>
                )}
              </div>
            </td>
          </tr>
        )
      })
    ])
  }, [DONATIONS])

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

  const onPageClick = e => {
    setActivePage(e)
    setPageOffset(pageLimit * (e - 1))
  }

  const onLimitChange = e => {
    setActivePage(1)
    setPageOffset(0)
    setPageLimit(Number(e.value))
  }

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
    const errors = JSON.parse(JSON.stringify(data))

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
          : 'Donations Monitor'}
      </h3>
      <p className="text-base mb-6">via Credit/Debit Card</p>
      <Tabs defaultTab="1">
        <Tabs.TabLabels>
          <Tabs.TabLabel id="1">Overview</Tabs.TabLabel>
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
                {accountType === ACCOUNT_TYPES.SUP.value && (
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
                No of donations:{' '}
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

            <Card
              noPadding
              header={
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg">
                    {postID && DONATIONS?.campaign?.title
                      ? `"${DONATIONS?.campaign?.title}" Donations`
                      : pathname === '/offerings' ||
                        pathname === '/offerings/[id]'
                      ? 'Recent Offerings '
                      : 'Recent Donations '}
                  </h3>
                </div>
              }
              content={
                loadingDonations ? (
                  <PageLoader />
                ) : (
                  tableData && (
                    <Table custom rowNames={columns} customBody={tableData} />
                  )
                )
              }
              className="rounded-t-none"
            />
            {donationLists && (
              <Pagination
                items={donationLists}
                activePage={activePage}
                onPageClick={onPageClick}
                onLimitChange={onLimitChange}
              />
            )}
          </Tabs.TabPanel>
        </Tabs.TabPanels>
      </Tabs>
    </div>
  )
}

export default Donations
