import { useState, useMemo, useRef, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useReactToPrint } from 'react-to-print'
import { CSVLink } from 'react-csv'
import { useRouter } from 'next/router'
import Link from 'next/link'
import P from 'prop-types'
import * as yup from 'yup'

import FormInput from '@app/components/forms/form-input'
import FormSelect from '@app/components/forms/form-select'
import Dropdown from '@app/components/dropdown'
import { Card } from '@app/components/globals'
import PrimaryDataTable from '@app/components/globals/PrimaryDataTable'
import Can from '@app/permissions/can'

import dayjs, {
  friendlyDateTimeFormat,
  toFriendlyISO,
  toFriendlyTime
} from '@app/utils/date'
import showToast from '@app/utils/toast'

import { FaTimes, FaSearch, FaPlusCircle, FaEllipsisH } from 'react-icons/fa'
import { FiDownload } from 'react-icons/fi'
import { HiOutlinePrinter } from 'react-icons/hi'
import useDebounce from '@app/utils/useDebounce'
import { GET_POST_CATEGORY, CREATE_PRAYER_REQUEST } from '../queries'
import Button from '@app/components/button'
import moment from 'moment'
import CreatePrayerRequestModal from './CreatePrayerRequestModal'
import PrayerRequestPrintView from './PrayerRequestPrintView'

import styles from './PrayerRequestsTable.module.css'

const columns = [
  {
    name: 'Date Created',
    width: ''
  },
  {
    name: 'Category',
    width: ''
  },
  {
    name: 'Requestor',
    width: ''
  },
  {
    name: 'Prayer For',
    width: ''
  },
  {
    name: 'Prayer From',
    width: ''
  },
  {
    name: 'Date of Mass',
    width: ''
  },
  {
    name: 'Time of Mass',
    width: ''
  },
  {
    name: 'Message',
    width: ''
  },
  {
    name: '',
    width: ''
  }
]

const validationSchema = yup.object().shape({
  prayerFor: yup.string().required('This field is required'),
  prayerFrom: yup.string().required('This field is required'),
  category: yup.object().shape({
    label: yup.string().required(),
    value: yup.string().required('This field is required')
  }),
  date: yup.string(),
  message: yup.string()
})

function PrayerRequestsTable({ queryTemplate, status, user, refetchCounts }) {
  const router = useRouter()
  const { complexId, companyId, accountId, initialCategory } = user
  const { control, errors, reset, getValues, trigger } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      prayerFor: '',
      prayerFrom: '',
      category: undefined,
      date: undefined,
      message: ''
    }
  })
  const [searchText, setSearchText] = useState('')
  const [pageLimit, setPageLimit] = useState(10)
  const [offset, setPageOffset] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [category, setCategory] = useState()
  const [showCreatePrayerModal, setShowCreatePrayerModal] = useState(false)
  const debouncedSearchText = useDebounce(searchText, 700)
  const DOCUMENT_TITLE =
    status === 'new' ? 'Prayer_Request_New' : 'Prayer_Request_Received'
  const PDF_TITLE =
    status === 'new' ? 'Prayer Request - New' : 'Prayer Request - Received'

  const printRef = useRef()
  const {
    data,
    loading,
    refetch: refetchPrayerRequests
  } = useQuery(queryTemplate, {
    variables: {
      complexId,
      offset,
      limit: pageLimit,
      search: debouncedSearchText,
      categoryId: category?.value || null
    },
    fetchPolicy: 'network-only'
  })

  const { data: categories } = useQuery(GET_POST_CATEGORY)

  const [createRequest, { loading: creatingPrayerRequest }] = useMutation(
    CREATE_PRAYER_REQUEST,
    {
      onCompleted: () => {
        showToast('success', `Request created.`)
        reset({
          prayerFor: '',
          prayerFrom: '',
          category: null,
          date: undefined,
          message: ''
        })
        setShowCreatePrayerModal(old => !old)
        refetchCounts()
        refetchPrayerRequests({
          variables: {
            complexId,
            offset,
            limit: pageLimit,
            search: debouncedSearchText,
            categoryId: category?.value || null
          }
        })
      },
      onError: e => {
        errorHandler(e)
      }
    }
  )

  const prayerRequests = data?.getIssues

  const onPrintPreview = useReactToPrint({
    documentTitle: DOCUMENT_TITLE,
    content: () => printRef.current,
    removeAfterPrint: true
  })

  const onCancel = () => {
    reset({
      prayerFor: '',
      prayerFrom: '',
      category: null,
      date: undefined,
      message: ''
    })
    setShowCreatePrayerModal(old => !old)
  }

  const onSubmit = async () => {
    const validated = await trigger()

    if (validated) {
      const values = getValues()
      const { date, category, message, prayerFor, prayerFrom } = values

      createRequest({
        variables: {
          data: {
            authorAccountId: accountId,
            companyId,
            complexId: complexId ?? '',
            categoryId: category?.value,
            content: message && message !== '' ? message : null,
            prayer: {
              for: prayerFor,
              from: prayerFrom,
              date: toFriendlyISO(date),
              time: toFriendlyTime(date)
            }
          }
        }
      })
    }
  }

  const downloadData = useMemo(() => {
    const listData = [
      [PDF_TITLE],
      [''],
      [
        '#',
        'Date Created',
        'Category',
        'Requestor',
        'Prayer For',
        'Prayer From',
        'Date of Mass',
        'Message'
      ]
    ]

    prayerRequests?.issue?.map(
      ({ createdAt, category, reporter, prayer, content }, index) => {
        const dateCreated = createdAt
          ? friendlyDateTimeFormat(createdAt, 'MMM DD, YYYY')
          : ''
        const title = category?.name || ''
        const requestor = reporter?.user
          ? `${reporter.user.firstName} ${reporter.user.lastName}`
          : ''
        const prayerFor = prayer.for || ''
        const prayerFrom = prayer.from || ''
        const dateRequested = prayer?.date
          ? friendlyDateTimeFormat(prayer.date, 'MMM DD, YYYY')
          : ''
        const message = content || ''

        return listData.push([
          `${index + 1}`,
          `${dateCreated}`,
          `${title}`,
          `${requestor}`,
          `${prayerFor}`,
          `${prayerFrom}`,
          `${dateRequested}`,
          `${message}`
        ])
      }
    )

    return listData
  }, [prayerRequests?.issue])

  const categoryOptions = useMemo(() => {
    if (categories?.getPostCategory?.count > 0) {
      const cats = categories.getPostCategory.category.map(cat => ({
        label: cat.name,
        value: cat._id
      }))
      return cats
    }
  }, [categories?.getPostCategory])

  useEffect(() => {
    // let path = '/prayer-requests/list'
    // if (router?.query?.complexId) {
    //   path += `?complexId=${complexId}`
    // }
    // router.push(path)
    if (categoryOptions?.length > 0 && initialCategory) {
      const index = categoryOptions?.findIndex(c => c.value === initialCategory)
      setCategory(categoryOptions[index])
    }
  }, [categoryOptions])

  const tableData = useMemo(() => {
    return {
      count: prayerRequests?.count || 0,
      limit: prayerRequests?.limit || 10,
      offset: prayerRequests?.offset || 0,
      data:
        prayerRequests?.issue?.length > 0
          ? prayerRequests.issue.map(
              ({ _id, category, prayer, reporter, createdAt, content }) => {
                const req = reporter?.user
                let path = `/prayer-requests/details/${_id}`
                if (complexId) {
                  path += `?complexId=${complexId}`
                }
                const dropdownData = [
                  {
                    label: 'View Details',
                    icon: <span className="ciergio-file" />,
                    function: () => {
                      router.push(path)
                    }
                  }
                ]
                return {
                  dateCreated: friendlyDateTimeFormat(dayjs(createdAt), 'LL'),
                  category: (
                    <>
                      <span>{category?.name}</span>
                      <Link href={path}>
                        <p className="text-sm text-info-500 cursor-pointer hover:underline">
                          <span>View</span>
                        </p>
                      </Link>
                    </>
                  ),
                  requestor: (
                    <Link href={`/residents/view/${reporter?._id}`}>
                      <span className="text-info-500 cursor-pointer hover:underline">{`${req?.firstName} ${req?.lastName}`}</span>
                    </Link>
                  ),
                  pareyerFor: prayer.for,
                  prayerFrom: prayer.from,
                  prayerDate: friendlyDateTimeFormat(dayjs(prayer?.date), 'LL'),
                  prayerTime: toFriendlyTime(prayer?.time),
                  message: (
                    <span className={styles.messageContainer}>
                      {content || '--'}
                    </span>
                  ),
                  button: (
                    <Dropdown label={<FaEllipsisH />} items={dropdownData} />
                  )
                }
              }
            )
          : []
    }
  }, [prayerRequests?.issue])

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
    <>
      <div className="flex items-center justify-end">
        <div className="w-2/12 md:w-120 mr-2 relative">
          <FormSelect
            isClearable={false}
            placeholder="Select Category"
            value={category}
            options={
              categoryOptions?.length > 0
                ? [
                    {
                      label: 'All Category',
                      value: null
                    },
                    ...categoryOptions
                  ]
                : []
            }
            onChange={selectedValue => {
              setCategory(selectedValue)
              setCurrentPage(1)
              setPageLimit(10)
              setPageOffset(0)
            }}
            defaultValue={null}
          />
        </div>
        <div className="w-2/12 md:w-120 relative">
          <FormInput
            name="search"
            placeholder="Search"
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
              <FaTimes
                className="cursor-pointer"
                onClick={() => setSearchText('')}
              />
            ) : (
              <FaSearch />
            )}
          </span>
        </div>
      </div>
      <Card
        noPadding
        title={
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xl">Prayer Requests</h3>
          </div>
        }
        actions={[
          <Can
            key="print"
            perform="prayerrequests:print"
            yes={
              <Button
                default
                icon={<HiOutlinePrinter />}
                className="mr-1 "
                onClick={onPrintPreview}
                disabled={loading}
              />
            }
          />,
          <Can
            key="download"
            perform="prayerrequests:export"
            yes={
              <CSVLink filename={'prayer_requests.csv'} data={downloadData}>
                <Button
                  default
                  icon={<FiDownload />}
                  onClick={() => {}}
                  className="mr-1 "
                  disabled={loading}
                />
              </CSVLink>
            }
          />,
          <Can
            key="add"
            perform="prayerrequests:create"
            yes={
              <Button
                primary
                label="Create Prayer Request"
                leftIcon={<FaPlusCircle />}
                onClick={() => setShowCreatePrayerModal(old => !old)}
              />
            }
          />
        ]}
        content={
          <PrimaryDataTable
            columns={columns}
            data={tableData}
            loading={loading}
            currentPage={currentPage}
            pageLimit={pageLimit}
            setCurrentPage={setCurrentPage}
            setPageLimit={setPageLimit}
            setPageOffset={setPageOffset}
          />
        }
        className="rounded-t-none"
      />
      <CreatePrayerRequestModal
        visible={showCreatePrayerModal}
        onCancel={onCancel}
        categoryOptions={categoryOptions}
        onSubmit={onSubmit}
        form={{
          errors,
          control
        }}
        loading={creatingPrayerRequest}
      />
      <div className="hidden">
        <PrayerRequestPrintView
          ref={printRef}
          title={PDF_TITLE}
          data={prayerRequests?.issue}
        />
      </div>
    </>
  )
}

PrayerRequestsTable.propTypes = {
  queryTemplate: P.object,
  status: P.string,
  refetchCounts: P.func,
  user: P.object
}

export default PrayerRequestsTable
