import { useState, useMemo } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import P from 'prop-types'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import FormInput from '@app/components/forms/form-input'
import FormSelect from '@app/components/select'
import Dropdown from '@app/components/dropdown'
import { Card } from '@app/components/globals'
import PrimaryDataTable from '@app/components/globals/PrimaryDataTable'

import dayjs, { friendlyDateTimeFormat } from '@app/utils/date'
import showToast from '@app/utils/toast'

import { AiOutlineEllipsis } from 'react-icons/ai'
import { FaTimes, FaSearch, FaPlusCircle } from 'react-icons/fa'
import { FiDownload } from 'react-icons/fi'
import { HiOutlinePrinter } from 'react-icons/hi'
import useDebounce from '@app/utils/useDebounce'
import { GET_POST_CATEGORY, CREATE_PRAYER_REQUEST } from '../queries'
import Button from '@app/components/button'

import CreatePrayerRequestModal from './CreatePrayerRequestModal'

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

const validationSchema = yup.object().shape({
  prayerFor: yup.string().required(),
  prayerFrom: yup.string().required(),
  category: yup.object().shape({
    label: yup.string(),
    value: yup.string()
  }),
  date: yup.date(),
  message: yup.string()
})

function PrayerRequestsTable({ queryTemplate }) {
  const { handleSubmit, control, errors, reset } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      prayerFor: '',
      prayerFrom: '',
      category: '',
      date: new Date(),
      message: ''
    }
  })
  const [searchText, setSearchText] = useState('')
  const [pageLimit, setPageLimit] = useState(10)
  const [offset, setPageOffset] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [category, setCategory] = useState({
    label: 'All Category',
    value: null
  })
  const [showCreatePrayerModal, setShowCreatePrayerModal] = useState(false)
  const debouncedSearchText = useDebounce(searchText, 700)

  const { data, loading } = useQuery(queryTemplate, {
    variables: {
      complexId: '5f291193643d6011be2d280b',
      offset,
      limit: pageLimit,
      search: debouncedSearchText,
      categoryId: category?.value || null
    }
  })

  const { data: categories } = useQuery(GET_POST_CATEGORY)

  const [createRequest, { loading: creatingPrayerRequest }] = useMutation(
    CREATE_PRAYER_REQUEST,
    {
      onCompleted: () => {
        showToast('success', `Request created.`)
        reset({
          prayerFor: 'hahaha',
          prayerFrom: 'hehehe',
          category: 'lolololo',
          date: '',
          message: ''
        })
        setShowCreatePrayerModal(old => !old)
      }
    }
  )

  const prayerRequests = data?.getIssues

  const onPageClick = e => {
    setCurrentPage(e)
    setPageOffset(pageLimit * (e - 1))
  }

  const onLimitChange = limit => setPageLimit(Number(limit.value))

  const onCancel = () => setShowCreatePrayerModal(old => !old)

  const onSubmit = values => {
    const { date, category, message, prayerFor, prayerFrom } = values

    createRequest({
      variables: {
        data: {
          authorAccountId: '5fd1d549ae785b6e2e923c6a',
          companyId: '5f290f7d0dcafc0ba70e0721',
          complexId: '5f291193643d6011be2d280b',
          categoryId: category?.value,
          content: message,
          prayer: {
            for: prayerFor,
            from: prayerFrom,
            date: date.toISOString()
          }
        }
      }
    })
  }

  const categoryOptions = useMemo(() => {
    if (categories?.getPostCategory?.count > 0) {
      const cats = categories.getPostCategory.category.map(cat => ({
        label: cat.name,
        value: cat._id
      }))
      return cats
    }
  }, [categories?.getPostCategory])

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

  return (
    <>
      <div className="flex items-center justify-end">
        <div className="w-2/12 md:w-120 mr-2 relative -top-2">
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
          <Button
            key="print"
            default
            icon={<HiOutlinePrinter />}
            onClick={() => {}}
            className="mr-1 "
          />,
          <Button
            key="download"
            default
            icon={<FiDownload />}
            onClick={() => {}}
            className="mr-1 "
          />,
          <Button
            key="add"
            primary
            label="Create Prayer Request"
            leftIcon={<FaPlusCircle />}
            onClick={() => setShowCreatePrayerModal(old => !old)}
          />
        ]}
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
      <CreatePrayerRequestModal
        visible={showCreatePrayerModal}
        onCancel={onCancel}
        categoryOptions={categoryOptions}
        onSubmit={handleSubmit(onSubmit)}
        form={{
          errors,
          control
        }}
        loading={creatingPrayerRequest}
      />
    </>
  )
}

PrayerRequestsTable.propTypes = {
  queryTemplate: P.object
}

export default PrayerRequestsTable