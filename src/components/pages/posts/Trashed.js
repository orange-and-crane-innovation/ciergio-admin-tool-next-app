/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/jsx-key */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { gql, useQuery, useMutation } from '@apollo/client'
import { debounce } from 'lodash'
import { FaEllipsisH, FaTimes } from 'react-icons/fa'
import { FiFileText, FiEye } from 'react-icons/fi'
import Datetime from 'react-datetime'

import PageLoader from '@app/components/page-loader'
import Card from '@app/components/card'
import FormInput from '@app/components/forms/form-input'
import Checkbox from '@app/components/forms/form-checkbox'
import Button from '@app/components/button'
import Table from '@app/components/table'
import Pagination from '@app/components/pagination'
import Dropdown from '@app/components/dropdown'
import Modal from '@app/components/modal'
import Tooltip from '@app/components/tooltip'

import { DATE } from '@app/utils'
import showToast from '@app/utils/toast'
import { ACCOUNT_TYPES } from '@app/constants'

import ViewsCard from './components/ViewsCard'
import UpdateCard from './components/UpdateCard'
import PostDetailsCard from './components/PostDetailsCard'
import SelectBulk from '@app/components/globals/SelectBulk'
import SelectCategory from '@app/components/globals/SelectCategory'
import SearchControl from '@app/components/globals/SearchControl'

import styles from './Main.module.css'

const bulkOptions = [
  {
    label: 'Delete Permanently',
    value: 'deleted'
  },
  {
    label: 'Restore',
    value: 'draft'
  }
]

const GET_ALL_POST_QUERY = gql`
  query getAllPost(
    $where: AllPostInput
    $limit: Int
    $offset: Int
    $sort: PostSort
  ) {
    getAllPost(where: $where, limit: $limit, offset: $offset, sort: $sort) {
      count
      limit
      offset
      post {
        _id
        title
        content
        status
        createdAt
        updatedAt
        publishedAt
        author {
          _id
          user {
            firstName
            lastName
            email
            avatar
          }
          accountType
          company {
            _id
            name
          }
          complex {
            _id
            name
          }
          building {
            _id
            name
          }
        }
        category {
          name
        }
        views {
          count
          unique {
            count
            users {
              firstName
              lastName
              avatar
            }
          }
        }
      }
    }
  }
`

const GET_ALL_POST_DAILY_READINGS_QUERY = gql`
  query getAllPost(
    $where: AllPostInput
    $limit: Int
    $offset: Int
    $sort: PostSort
  ) {
    getAllPost(where: $where, limit: $limit, offset: $offset, sort: $sort) {
      count
      limit
      offset
      post {
        _id
        title
        content
        status
        createdAt
        updatedAt
        publishedAt
        author {
          _id
          user {
            firstName
            lastName
            email
            avatar
          }
          accountType
          company {
            _id
            name
          }
          complex {
            _id
            name
          }
          building {
            _id
            name
          }
        }
        category {
          name
        }
        views {
          count
          unique {
            count
            users {
              firstName
              lastName
              avatar
            }
          }
        }
        dailyReadingDate
      }
    }
  }
`

const BULK_UPDATE_MUTATION = gql`
  mutation bulkUpdatePost($id: [String], $status: postStatus) {
    bulkUpdatePost(id: $id, status: $status) {
      processId
      message
    }
  }
`

const UPDATE_POST_MUTATION = gql`
  mutation($id: String, $data: PostInput) {
    updatePost(id: $id, data: $data) {
      _id
      processId
      message
    }
  }
`

const PostComponent = () => {
  const router = useRouter()
  const [posts, setPosts] = useState()
  const [searchText, setSearchText] = useState()
  const [activePage, setActivePage] = useState(1)
  const [limitPage, setLimitPage] = useState(10)
  const [offsetPage, setOffsetPage] = useState(0)
  const [selectedData, setSelectedData] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState()
  const [modalID, setModalID] = useState()
  const [modalContent, setModalContent] = useState()
  const [modalTitle, setModalTitle] = useState()
  const [modalFooter, setModalFooter] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState()
  const [selectedBulk, setSelectedBulk] = useState()
  const [isBulkDisabled, setIsBulkDisabled] = useState(true)
  const [isBulkButtonDisabled, setIsBulkButtonDisabled] = useState(true)
  const [isBulkButtonHidden, setIsBulkButtonHidden] = useState(false)
  const [temporaryDate, setTemporaryDate] = useState('')
  const [temporaryMonth, setTemporaryMonth] = useState('')
  const [selectedDate, setSelectedDate] = useState()
  const [selectedMonth, setSelectedMonth] = useState()
  const user = JSON.parse(localStorage.getItem('profile'))
  const accountType = user?.accounts?.data[0]?.accountType
  const companyID = user?.accounts?.data[0]?.company?._id
  const isAttractionsEventsPage = router.pathname === '/attractions-events'
  const isQRCodePage = router.pathname === '/qr-code'
  const isDailyReadingsPage = router.pathname === '/daily-readings'
  const routeName = isAttractionsEventsPage
    ? 'attractions-events'
    : isQRCodePage
    ? 'qr-code'
    : isDailyReadingsPage
    ? 'daily-readings'
    : 'posts'

  const tableRowData = [
    {
      name: (
        <Checkbox
          primary
          id="checkbox_select_all"
          name="checkbox_select_all"
          onChange={e => onCheckAll(e)}
        />
      ),
      width: '5%'
    },
    {
      name: 'Title',
      width: '30%'
    },
    {
      name: 'Author',
      width: '30%'
    },
    {
      name: 'Category',
      width: '15%',
      hidden: isDailyReadingsPage
    },
    {
      name: 'Status',
      width: '15%'
    },
    {
      name: '',
      width: ''
    }
  ]

  const fetchFilter = {
    status: ['trashed'],
    type: 'post',
    categoryId: selectedCategory !== '' ? selectedCategory : null,
    search: {
      allpost: searchText
    }
  }

  if (routeName === 'qr-code') {
    fetchFilter.qr = true
  }

  if (isDailyReadingsPage) {
    fetchFilter.type = 'daily_reading'

    if (selectedDate && selectedDate !== '') {
      fetchFilter.dailyReadingDate = selectedDate
    }

    if (selectedMonth && selectedMonth !== '') {
      fetchFilter.dailyReadingDateRange = selectedMonth
    }
  }

  const { loading, data, error, refetch: refetchPosts } = useQuery(
    isDailyReadingsPage
      ? GET_ALL_POST_DAILY_READINGS_QUERY
      : GET_ALL_POST_QUERY,
    {
      enabled: false,
      variables: {
        where: fetchFilter,
        limit: limitPage,
        offset: offsetPage,
        sort: {
          by: isDailyReadingsPage ? 'dailyReadingDate' : 'createdAt',
          order: 'desc'
        }
      }
    }
  )

  const [
    bulkUpdate,
    {
      loading: loadingBulk,
      called: calledBulk,
      error: errorBulk,
      data: dataBulk
    }
  ] = useMutation(BULK_UPDATE_MUTATION)

  const [
    updatePost,
    {
      loading: loadingUpdate,
      called: calledUpdate,
      data: dataUpdate,
      error: errorUpdate
    }
  ] = useMutation(UPDATE_POST_MUTATION)

  useEffect(() => {
    setIsBulkButtonHidden(isDailyReadingsPage)
    refetchPosts()
  }, [])

  useEffect(() => {
    if (!loading && data) {
      let isMine, checkbox
      const tableData = {
        count: data?.getAllPost.count || 0,
        limit: data?.getAllPost.limit || 0,
        offset: data?.getAllPost.offset || 0,
        data:
          data?.getAllPost.post.map(item => {
            let buildingName, status
            const dropdownData = [
              {
                label: isDailyReadingsPage
                  ? 'Daily Reading Details'
                  : 'Article Details',
                icon: <FiFileText />,
                function: () => handleShowModal('details', item._id)
              },
              {
                label: 'Who View this Article',
                icon: <FiEye />,
                function: () => handleShowModal('views', item._id)
              }
            ]

            switch (item.author?.accountType) {
              case ACCOUNT_TYPES.SUP.value: {
                buildingName = item.author?.company?.name
                break
              }
              case ACCOUNT_TYPES.COMPYAD.value: {
                buildingName = item.author?.company?.name
                break
              }
              case ACCOUNT_TYPES.COMPXAD.value: {
                buildingName = item.author?.complex?.name
                break
              }
              case ACCOUNT_TYPES.BUIGAD.value: {
                buildingName = item.author?.building?.name
                break
              }
              case ACCOUNT_TYPES.RECEP.value: {
                buildingName = item.author?.building?.name
                break
              }
            }

            switch (item.status) {
              case 'published': {
                status = 'Published'
                break
              }
              case 'unpublished': {
                status = 'Unpublished'
                break
              }
              case 'draft': {
                status = 'Draft'
                break
              }
              case 'trashed': {
                status = 'Trashed'
                break
              }
              case 'scheduled': {
                status = 'Scheduled'
                break
              }
            }

            if (
              user._id === item.author._id ||
              accountType === ACCOUNT_TYPES.SUP.value ||
              (((item.author.accountType !== ACCOUNT_TYPES.SUP.value &&
                accountType === ACCOUNT_TYPES.COMPYAD.value) ||
                (item.author.accountType !== ACCOUNT_TYPES.SUP.value &&
                  item.author.accountType !== ACCOUNT_TYPES.COMPYAD.value &&
                  accountType === ACCOUNT_TYPES.COMPXAD.value)) &&
                item.author.company._id === companyID)
            ) {
              isMine = true
              checkbox = (
                <Checkbox
                  primary
                  id={`checkbox-${item._id}`}
                  name="checkbox"
                  data-id={item._id}
                  onChange={onCheck}
                />
              )
            } else {
              isMine = false
              checkbox = false
            }

            return {
              checkbox: checkbox || '',
              title: (
                <div className="flex flex-col">
                  {isDailyReadingsPage ? (
                    <Tooltip text={item?.title}>
                      {DATE.toFriendlyShortDate(item?.dailyReadingDate)}
                    </Tooltip>
                  ) : (
                    <span className={styles.TextWrapper}>{item?.title}</span>
                  )}
                  {isMine ? (
                    <div className="flex text-info-500 text-sm">
                      <Link href={`/${routeName}/view/${item._id}`}>
                        <a className="mr-2 hover:underline">View</a>
                      </Link>
                      {` | `}
                      <span
                        className="mx-2 cursor-pointer hover:underline"
                        onClick={() => handleShowModal('draft', item._id)}
                      >
                        Restore
                      </span>
                      {` | `}
                      <span
                        className="mx-2 text-danger-500 cursor-pointer hover:underline"
                        onClick={() => handleShowModal('delete', item._id)}
                      >
                        Permanently Delete
                      </span>
                    </div>
                  ) : (
                    <div className="flex text-info-500 text-sm">
                      <Link href={`/${routeName}/view/${item._id}`}>
                        <a className="mr-2 hover:underline">View</a>
                      </Link>
                    </div>
                  )}
                </div>
              ),
              author: (
                <div className="flex flex-col">
                  <span>{buildingName}</span>
                  <span className="text-neutral-500 text-sm">
                    {`${item.author?.user?.firstName} ${item.author?.user?.lastName} | ${item.author?.user?.email}`}
                  </span>
                </div>
              ),
              category:
                !isDailyReadingsPage &&
                (item.category?.name ?? 'Uncategorized'),
              status: (
                <div className="flex flex-col">
                  <span>{status}</span>
                  <span className="text-neutral-500 text-sm">
                    {DATE.toFriendlyShortDate(item.createdAt)}
                  </span>
                </div>
              ),
              button: <Dropdown label={<FaEllipsisH />} items={dropdownData} />
            }
          }) || null
      }

      setPosts(tableData)
    }
  }, [loading, data, error])

  useEffect(() => {
    if (!loadingBulk && errorBulk) {
      showToast('danger', 'Bulk update failed')
    }

    if (!loadingBulk && calledBulk && dataBulk) {
      if (dataBulk?.bulkUpdatePost?.message === 'success') {
        const allCheck = document.getElementsByName('checkbox_select_all')[0]
        const itemsCheck = document.getElementsByName('checkbox')
        let message

        if (allCheck.checked) {
          allCheck.click()
        }

        for (let i = 0; i < itemsCheck.length; i++) {
          if (itemsCheck[i].checked) {
            itemsCheck[i].click()
          }
        }

        setIsBulkDisabled(true)
        setIsBulkButtonDisabled(true)
        setIsBulkButtonHidden(isDailyReadingsPage)
        setSelectedBulk(null)
        setShowModal(old => !old)

        switch (selectedBulk) {
          case 'deleted':
            message = `You have successfully deleted (${selectedData?.length}) items.`
            break
          case 'draft':
            message = `You have successfully restored (${selectedData?.length}) items.`
            break
          default:
            message = `You have successfully updated a post.`
            break
        }

        showToast('success', message)
        refetchPosts()
      } else {
        showToast('danger', `Bulk update failed`)
      }
    }
  }, [loadingBulk, errorBulk, calledBulk, dataBulk, refetchPosts])

  useEffect(() => {
    if (errorUpdate) {
      showToast('danger', `Update failed`)
    } else if (!loadingUpdate && calledUpdate && dataUpdate) {
      if (dataUpdate?.updatePost?.message === 'success') {
        let message

        switch (modalType) {
          case 'delete':
            message = 'You have successfully deleted an item.'
            break
          case 'draft':
            message = 'You have successfully restored an item.'
            break
          default:
            message = 'You have successfully updated a post'
            break
        }

        setShowModal(old => !old)
        showToast('success', message)
        refetchPosts()
      } else {
        showToast('danger', `Update failed`)
      }
    }
  }, [loadingUpdate, calledUpdate, dataUpdate, errorUpdate, refetchPosts])

  const onSearch = debounce(e => {
    setSearchText(e.target.value !== '' ? e.target.value : null)
    resetPages()
  }, 1000)

  const onClearSearch = () => {
    setSearchText(null)
  }

  const onClearCategory = () => {
    setSelectedCategory(null)
  }

  const onClearBulk = () => {
    setSelectedBulk(null)
    setIsBulkButtonDisabled(true)
    setIsBulkButtonHidden(isDailyReadingsPage)
  }
  const onPageClick = e => {
    setActivePage(e)
    setOffsetPage(e * limitPage - 10)
  }

  const onLimitChange = e => {
    setLimitPage(Number(e.value))
  }

  const onCheckAll = e => {
    const checkboxes = document.getElementsByName('checkbox')

    setSelectedBulk(null)
    setIsBulkDisabled(true)
    setIsBulkButtonDisabled(true)

    for (let i = 0; i < checkboxes.length; i++) {
      const data = checkboxes[i].getAttribute('data-id')
      if (e.target.checked) {
        if (!selectedData.includes(data)) {
          setSelectedData(prevState => [...prevState, data])
        }
        checkboxes[i].checked = true
        setIsBulkDisabled(false)
        setIsBulkButtonHidden(false)
      } else {
        setSelectedData(prevState => [
          ...prevState.filter(item => item !== data)
        ])
        checkboxes[i].checked = false
      }
    }
  }

  const onCheck = e => {
    const data = e.target.getAttribute('data-id')
    const allCheck = document.getElementsByName('checkbox_select_all')[0]
    const checkboxes = document.querySelectorAll(
      'input[name="checkbox"]:checked'
    )

    if (e.target.checked) {
      if (!selectedData.includes(data)) {
        setSelectedData(prevState => [...prevState, data])
      }
      setIsBulkDisabled(false)
    } else {
      setSelectedData(prevState => [...prevState.filter(item => item !== data)])
      if (checkboxes.length === 0) {
        setSelectedBulk(null)
        setIsBulkDisabled(true)
        setIsBulkButtonDisabled(true)
        setIsBulkButtonHidden(isDailyReadingsPage)
      }
    }

    if (checkboxes.length === limitPage) {
      allCheck.checked = true
    } else {
      allCheck.checked = false
    }
  }

  const handleShowModal = (type, id) => {
    const selected = data?.getAllPost?.post?.filter(item => item._id === id)

    if (selected || selectedData?.length > 0) {
      setModalType(type)

      switch (type) {
        case 'details': {
          setModalTitle('Article Details')
          setModalContent(
            <PostDetailsCard
              date={selected[0].createdAt}
              avatar={selected[0].author.user?.avatar}
              firstName={selected[0].author?.user?.firstName}
              lastName={selected[0].author?.user?.lasttName}
              count={selected[0].views?.count}
              uniqueCount={selected[0].views?.unique?.count}
            />
          )
          setModalFooter(null)
          break
        }
        case 'views': {
          setModalTitle('Who Viewed this Article')
          setModalContent(<ViewsCard data={selected[0].views?.unique?.users} />)
          setModalFooter(null)
          break
        }
        case 'delete': {
          setModalTitle('Move to Trash')
          setModalContent(
            <UpdateCard type="deleted" title={selected[0].title} />
          )
          setModalFooter(true)
          setModalID(selected[0]._id)
          break
        }
        case 'bulk': {
          setModalTitle('Bulk Update Post')
          setModalContent(
            <UpdateCard
              type={selectedBulk}
              title={`(${selectedData.length}) items`}
            />
          )
          setModalFooter(true)
          break
        }
        case 'draft': {
          setModalTitle('Restore Post')
          setModalContent(<UpdateCard type="draft" title={selected[0].title} />)
          setModalFooter(true)
          setModalID(selected[0]._id)
          break
        }
      }
      setShowModal(old => !old)
    }
  }

  const handleClearModal = () => {
    handleShowModal()
  }

  const resetPages = () => {
    setActivePage(1)
    setLimitPage(10)
    setOffsetPage(0)
  }

  const onCategorySelect = e => {
    setSelectedCategory(e.value !== '' ? e.value : null)
    resetPages()
  }

  const onBulkChange = e => {
    setSelectedBulk(e.value)
    if (e.value !== '') {
      setIsBulkButtonDisabled(false)
      setIsBulkButtonHidden(false)
    } else {
      setIsBulkButtonDisabled(true)
      setIsBulkButtonHidden(isDailyReadingsPage)
    }
  }

  const onBulkSubmit = async () => {
    const data = { id: selectedData, status: selectedBulk }

    try {
      await bulkUpdate({ variables: data })
    } catch (e) {
      console.log(e)
    }
  }

  const onDeletePost = async () => {
    const updateData = {
      id: modalID,
      data: {
        status: 'deleted'
      }
    }

    try {
      await updatePost({ variables: updateData })
    } catch (e) {
      console.log(e)
    }
  }

  const onRestorePost = async () => {
    const updateData = {
      id: modalID,
      data: {
        status: 'draft'
      }
    }

    try {
      await updatePost({ variables: updateData })
    } catch (e) {
      console.log(e)
    }
  }

  const handleDateChange = e => {
    setTemporaryDate(e)
    setTemporaryMonth('')
  }

  const handleMonthChange = e => {
    setTemporaryDate('')
    setTemporaryMonth(e)
  }

  const onApplyDate = () => {
    if (temporaryDate && temporaryDate !== '') {
      setSelectedDate(DATE.toFriendlyISO(DATE.setInitialTime(temporaryDate)))
      setSelectedMonth('')
    }

    if (temporaryMonth !== '') {
      setSelectedDate('')
      setSelectedMonth([
        DATE.toFriendlyISO(DATE.toBeginningOfMonth(temporaryMonth)),
        DATE.toFriendlyISO(DATE.toEndOfMonth(temporaryMonth))
      ])
    }
  }

  const handleClearDate = () => {
    setSelectedDate('')
    setTemporaryDate('')
  }

  const handleClearMonth = () => {
    setSelectedMonth('')
    setTemporaryMonth('')
  }

  return (
    <>
      <p className={styles.HeaderSmall}>
        Articles in Trash will be automatically deleted after{' '}
        <strong>30 days</strong>.
      </p>
      <div className={styles.MainControl}>
        <SelectBulk
          placeholder="Bulk Action"
          options={bulkOptions}
          disabled={isBulkDisabled}
          isButtonDisabled={isBulkButtonDisabled}
          isButtonHidden={isBulkButtonHidden}
          onBulkChange={onBulkChange}
          onBulkSubmit={() => handleShowModal('bulk')}
          onBulkClear={onClearBulk}
          selected={selectedBulk}
          custom={isDailyReadingsPage}
        />
        {isDailyReadingsPage && (
          <div className="mx-2 w-full md:w-72">
            <Datetime
              renderInput={(props, openCalendar) => (
                <>
                  <div className="relative">
                    <FormInput
                      {...props}
                      inputProps={{ style: { backgroundColor: 'white' } }}
                      name="date"
                      placeholder="Filter Month"
                      value={
                        temporaryMonth &&
                        DATE.toFriendlyYearMonth(temporaryMonth)
                      }
                      readOnly
                    />
                    {temporaryMonth !== '' && (
                      <FaTimes
                        className="cursor-pointer absolute top-3 right-10"
                        onClick={handleClearMonth}
                      />
                    )}
                    <i
                      className="ciergio-calendar absolute top-3 right-4 cursor-pointer"
                      onClick={openCalendar}
                    />
                  </div>
                </>
              )}
              dateFormat="YYYY-MMMM"
              timeFormat={false}
              value={temporaryMonth}
              closeOnSelect
              onChange={handleMonthChange}
            />
          </div>
        )}
        {isDailyReadingsPage && (
          <div className="w-full md:w-72">
            <Datetime
              renderInput={(props, openCalendar) => (
                <>
                  <div className="relative">
                    <FormInput
                      {...props}
                      inputProps={{ style: { backgroundColor: 'white' } }}
                      name="date"
                      placeholder="Choose a date"
                      value={
                        temporaryDate && DATE.toFriendlyShortDate(temporaryDate)
                      }
                      readOnly
                    />
                    {temporaryDate !== '' && (
                      <FaTimes
                        className="cursor-pointer absolute top-3 right-10"
                        onClick={handleClearDate}
                      />
                    )}
                    <i
                      className="ciergio-calendar absolute top-3 right-4 cursor-pointer"
                      onClick={openCalendar}
                    />
                  </div>
                </>
              )}
              dateFormat="MMM DD, YYYY"
              timeFormat={false}
              value={temporaryDate}
              closeOnSelect
              onChange={handleDateChange}
            />
          </div>
        )}
        {isDailyReadingsPage && (
          <div className="mx-2 w-full md:w-72">
            <Button
              type="button"
              label="Apply"
              onClick={onApplyDate}
              disabled={!temporaryDate && !temporaryMonth}
            />
          </div>
        )}
        <div className={styles.CategoryControl}>
          {!isDailyReadingsPage && (
            <SelectCategory
              placeholder="Filter Category"
              type="post"
              onChange={onCategorySelect}
              onClear={onClearCategory}
              selected={selectedCategory}
            />
          )}
          <SearchControl
            placeholder="Search by title"
            searchText={searchText}
            onSearch={onSearch}
            onClearSearch={onClearSearch}
          />
        </div>
      </div>

      <Card
        noPadding
        header={
          <div className={styles.ContentFlex}>
            <span className={styles.CardHeader}>
              {searchText
                ? `Search result for "${searchText}" (${posts?.count || 0})`
                : `Trash (${posts?.count || 0})`}
            </span>
          </div>
        }
        content={
          loading ? (
            <PageLoader />
          ) : (
            posts && <Table rowNames={tableRowData} items={posts} />
          )
        }
      />
      {!loading && posts && (
        <Pagination
          items={posts}
          activePage={activePage}
          onPageClick={onPageClick}
          onLimitChange={onLimitChange}
        />
      )}

      <Modal
        title={modalTitle}
        visible={showModal}
        onClose={handleClearModal}
        footer={modalFooter}
        okText={modalType === 'delete' ? 'Yes, delete permanently' : 'Yes'}
        onOk={() =>
          modalType === 'delete'
            ? onDeletePost()
            : modalType === 'bulk'
            ? onBulkSubmit()
            : modalType === 'draft'
            ? onRestorePost()
            : null
        }
        onCancel={() => setShowModal(old => !old)}
      >
        <div className="w-full">{modalContent}</div>
      </Modal>
    </>
  )
}

export default PostComponent
