import {
  FaAngleDown,
  FaAngleUp,
  FaEllipsisH,
  FaPlusCircle
} from 'react-icons/fa'
import {
  FacebookIcon,
  FacebookShareButton,
  TwitterIcon,
  TwitterShareButton
} from 'react-share'
import { FiEye, FiFileText, FiLink, FiShare2 } from 'react-icons/fi'
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/jsx-key */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from 'react'
import { debounce, isEmpty } from 'lodash'
import { gql, useMutation, useQuery } from '@apollo/client'

import { ACCOUNT_TYPES } from '@app/constants'
import Button from '@app/components/button'
import Can from '@app/permissions/can'
import Card from '@app/components/card'
import Checkbox from '@app/components/forms/form-checkbox'
import { DATE } from '@app/utils'
import DateRange from '@app/components/daterange'
import Dropdown from '@app/components/dropdown'
import Link from 'next/link'
import Modal from '@app/components/modal'
import NotifCard from '@app/components/globals/NotifCard'
import PageLoader from '@app/components/page-loader'
import Pagination from '@app/components/pagination'
import PostDetailsCard from './components/PostDetailsCard'
import Props from 'prop-types'
import ReactSelect from 'react-select'
import { RiPushpinLine } from 'react-icons/ri'
import SearchControl from '@app/components/globals/SearchControl'
import Select from '@app/components/forms/form-select'
import SelectBulk from '@app/components/globals/SelectBulk'
import SelectCategory from '@app/components/globals/SelectCategory'
import Table from '@app/components/table'
import Tooltip from '@app/components/tooltip'
import UpdateCard from './components/UpdateCard'
import ViewsCard from './components/ViewsCard'
import showToast from '@app/utils/toast'
import styles from './Main.module.css'
import { useRouter } from 'next/router'

const bulkOptions = [
  {
    label: 'Unpublished',
    value: 'unpublished'
  },
  {
    label: 'Move to Trash',
    value: 'trashed'
  }
]

const GET_ALL_POSTS_QUERY = gql`
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
        pinnedForComplex
        content
        status
        createdAt
        updatedAt
        publishedAt
        offering
        shareLink
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

const SWITCH_POST_MUTATION = gql`
  mutation($data: switchPostPositionInput) {
    switchPostPosition(data: $data) {
      _id
      processId
      message
    }
  }
`

const ModalContentWrapper = ({ children }) => (
  <div className="w-full">{children}</div>
)

const PostComponent = ({ typeOfPage }) => {
  const router = useRouter()
  const [posts, setPosts] = useState()
  const [searchText, setSearchText] = useState()
  const [activePage, setActivePage] = useState(1)
  const [limitPage, setLimitPage] = useState(10)
  const [offsetPage, setOffsetPage] = useState(0)
  const [reorder, setReorder] = useState(false)
  const [selectedData, setSelectedData] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState()
  const [modalID, setModalID] = useState()
  const [modalOkText, setModalOkText] = useState('')
  const [modalContent, setModalContent] = useState()
  const [modalTitle, setModalTitle] = useState()
  const [modalFooter, setModalFooter] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState()
  const [selectedBulk, setSelectedBulk] = useState()
  const [isBulkDisabled, setIsBulkDisabled] = useState(true)
  const [isBulkButtonDisabled, setIsBulkButtonDisabled] = useState(true)
  const [isBulkButtonHidden, setIsBulkButtonHidden] = useState(false)
  const [selectedDate, setSelectedDate] = useState()
  const systemType = process.env.NEXT_PUBLIC_SYSTEM_TYPE
  const user = JSON.parse(localStorage.getItem('profile'))
  const accountType = user?.accounts?.data[0]?.accountType
  const companyID = user?.accounts?.data[0]?.company?._id
  const isSystemPray = systemType === 'pray'
  const isSystemCircle = systemType === 'circle'
  const isAttractionsEventsPage = router.pathname === '/attractions-events'
  const isQRCodePage = router.pathname === '/qr-code'
  const isPastoralWorksPage = router.pathname === '/pastoral-works'
  const isDailyReadingsPage = router.pathname === '/daily-readings'
  const routeName = isAttractionsEventsPage
    ? 'attractions-events'
    : isQRCodePage
    ? 'qr-code'
    : typeOfPage('daily-readings', 'posts', 'pastoral-works')

  const headerName = isQRCodePage ? 'Active QR Codes' : typeOfPage()

  const donationsRouteName = isSystemPray ? 'offerings' : 'donations'
  const [selectedComplexPin, setSelectedComplexPin] = useState(null)
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
      width: '5%',
      hidden: reorder
    },
    {
      name: 'Title',
      width: isDailyReadingsPage ? '20%' : '30%'
    },
    {
      name: '',
      width: '25%',
      hidden: !isDailyReadingsPage
    },
    {
      name: 'Author',
      width: '25%'
    },

    {
      name: 'Category',
      width: '15%',
      hidden: isDailyReadingsPage
    },
    {
      name: reorder ? 'Reorder' : isQRCodePage ? 'QR Code' : 'Status',
      width: '15%'
    },
    {
      name: reorder ? 'Reorder' : '',
      width: ''
    }
  ]

  const fetchFilter = {
    status: ['published'],
    type: typeOfPage('daily_reading', 'post', 'pastoral_works'),
    categoryId: selectedCategory !== '' ? selectedCategory : null,
    search: {
      allpost: searchText
    }
  }

  if (isSystemCircle) {
    fetchFilter.qr = false

    if (isQRCodePage) {
      fetchFilter.qr = true
    }
  }

  if (isDailyReadingsPage) {
    if (selectedDate && selectedDate !== '') {
      fetchFilter.dailyReadingDateRange = selectedDate
    }
  }

  const { loading, data, error, refetch: refetchPosts } = useQuery(
    GET_ALL_POSTS_QUERY,
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

  const [
    switchPost,
    {
      loading: loadingSwitch,
      called: calledSwitch,
      data: dataSwitch,
      error: errorSwitch
    }
  ] = useMutation(SWITCH_POST_MUTATION)

  useEffect(() => {
    setIsBulkButtonHidden(isDailyReadingsPage)
    refetchPosts()
  }, [])

  useEffect(() => {
    if (error) {
      errorHandler(error)
    }
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
                label: typeOfPage(
                  'Daily Reading Details',
                  'Article Details',
                  'Pastoral Work Details'
                ),
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
            }

            const activeAccount = user.accounts.data.filter(item => item.active)
            const userCompanyId = activeAccount[0].company._id
            const authorCompanyId = item.author.company._id

            if (
              !reorder &&
              (user._id === item.author._id ||
                accountType === ACCOUNT_TYPES.SUP.value ||
                (item.author.accountType !== ACCOUNT_TYPES.SUP.value &&
                  accountType === ACCOUNT_TYPES.COMPYAD.value) ||
                (item.author.accountType !== ACCOUNT_TYPES.SUP.value &&
                  item.author.accountType !== ACCOUNT_TYPES.COMPYAD.value &&
                  accountType === ACCOUNT_TYPES.COMPXAD.value &&
                  item.author.company._id === companyID) ||
                userCompanyId === authorCompanyId)
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
              id: item._id,
              checkbox: checkbox || '',
              title: (
                <div className="flex flex-col">
                  {item.title}
                  {isMine ? (
                    <div className="flex text-info-500 text-sm">
                      <Link href={`/${routeName}/edit/${item._id}`}>
                        <a className="mr-2 hover:underline">Edit</a>
                      </Link>
                      {` | `}
                      <Link href={`/${routeName}/view/${item._id}`}>
                        <a className="mx-2 hover:underline" target="_blank">
                          View
                        </a>
                      </Link>
                      {` | `}
                      <Can
                        perform={
                          isAttractionsEventsPage
                            ? 'attractions:delete'
                            : 'bulletin:delete'
                        }
                        yes={
                          <span
                            className="mx-2 cursor-pointer hover:underline"
                            onClick={() => handleShowModal('delete', item._id)}
                          >
                            Move to Trash
                          </span>
                        }
                      />
                    </div>
                  ) : (
                    <Can
                      perform={
                        isAttractionsEventsPage
                          ? 'attractions:view'
                          : 'bulletin:view'
                      }
                      yes={
                        <div className="flex text-info-500 text-sm">
                          <Link href={`/${routeName}/view/${item._id}`}>
                            <a className="mr-2 hover:underline" target="_blank">
                              View
                            </a>
                          </Link>
                        </div>
                      }
                    />
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
              status: reorder ? (
                <>
                  <Button
                    default
                    leftIcon={<FaAngleUp className="text-2xl" />}
                    className="mr-4"
                    onClick={e => reorderRow(e, 'up')}
                  />
                  <Button
                    default
                    leftIcon={<FaAngleDown className="text-2xl" />}
                    onClick={e => reorderRow(e, 'down')}
                  />
                </>
              ) : isQRCodePage ? (
                <Button
                  default
                  label="Download QR"
                  onClick={() => handleShowModal('download-qr', item._id)}
                />
              ) : (
                <div className="flex flex-col">
                  <span>{status}</span>
                  <span className="text-neutral-500 text-sm">
                    {DATE.toFriendlyShortDate(item.createdAt)}
                  </span>
                </div>
              ),
              button: (
                <Can
                  perform={
                    isAttractionsEventsPage
                      ? 'attractions:view'
                      : 'bulletin:view'
                  }
                  yes={
                    <Dropdown label={<FaEllipsisH />} items={dropdownData} />
                  }
                />
              )
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

        setSelectedBulk(null)
        setSelectedData([])
        setIsBulkDisabled(true)
        setIsBulkButtonDisabled(true)
        setIsBulkButtonHidden(isDailyReadingsPage)
        setShowModal(false)

        switch (selectedBulk) {
          case 'unpublished':
            message = `You have successfully unpublished (${selectedData?.length}) items.`
            break
          case 'trashed':
            message = `You have successfully sent (${selectedData?.length}) items to the trash.`
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
  }, [loadingBulk, calledBulk, dataBulk, refetchPosts])

  useEffect(() => {
    if (errorUpdate) {
      showToast('danger', `Update failed`)
    } else if (!loadingUpdate && calledUpdate && dataUpdate) {
      if (dataUpdate?.updatePost?.message === 'success') {
        let message

        switch (modalType) {
          case 'delete':
            message = 'You have successfully sent item to the trash.'
            break
          default:
            message = 'You have successfully updated a post'
            break
        }

        setShowModal(false)
        showToast('success', message)
        refetchPosts()
      } else {
        showToast('danger', `Update failed`)
      }
    }
  }, [loadingUpdate, calledUpdate, dataUpdate, errorUpdate, refetchPosts])

  useEffect(() => {
    if (errorSwitch) {
      showToast('danger', `Switch posts failed`)
      refetchPosts()
    } else if (!loadingSwitch && calledSwitch && dataSwitch) {
      if (dataSwitch.switchPostPosition?.message === 'success') {
        showToast('success', `You have successfully switched a post`)
      } else {
        showToast('danger', `Switch posts failed`)
      }
    }
  }, [loadingSwitch, calledSwitch, dataSwitch, errorSwitch])

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

  const goToCreatePage = () => {
    router.push(`${routeName}/create`)
  }

  const onPageClick = e => {
    setActivePage(e)
    setOffsetPage(limitPage * (e - 1))
  }

  const onLimitChange = e => {
    setLimitPage(Number(e.value))
  }

  const handleSelect = val => {
    if (val?.pinned) {
      setModalOkText('Unpin')
    }

    setSelectedComplexPin(val)
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

  // complexID = optional
  // isPinned = optional
  const handleShowModal = React.useCallback(
    (type, id, complexID, isPinned, pinnedList) => {
      const selected = data?.getAllPost?.post?.filter(item => item._id === id)

      if ((selected || selectedData?.length > 0) && type) {
        setModalType(type)

        switch (type) {
          case 'details': {
            setModalTitle('Article Details')
            setModalContent(
              <PostDetailsCard
                date={selected[0].createdAt}
                avatar={selected[0].author.user?.avatar}
                firstName={selected[0].author?.user?.firstName}
                lastName={selected[0].author?.user?.lastName}
                count={selected[0].views?.count}
                uniqueCount={selected[0].views?.unique?.count}
              />
            )
            setModalFooter(null)
            break
          }
          case 'views': {
            setModalTitle('Who Viewed this Article')
            setModalContent(
              <ViewsCard data={selected[0].views?.unique?.users} />
            )
            setModalFooter(null)
            break
          }
          case 'delete': {
            setModalTitle('Move to Trash')
            setModalContent(
              <UpdateCard type="trashed" title={selected[0].title} />
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
          case 'download-qr': {
            setModalTitle('Download QR')
            setModalContent(
              <UpdateCard type="download-qr" data={selected[0]} />
            )
            setModalFooter(null)
            break
          }
          case 'share': {
            setModalTitle('Share To Social Media')
            setModalContent(
              <div className="grid grid-cols-3 gap-4 justify-items-center">
                <div className="share-social-item">
                  <FacebookShareButton
                    url={selected[0].shareLink}
                    quote={null}
                    hashtag={null}
                    description={null}
                  >
                    <FacebookIcon size={32} round />
                    <div>Facebook</div>
                  </FacebookShareButton>
                </div>
                <div className="share-social-item">
                  <TwitterShareButton
                    title={null}
                    url={selected[0].shareLink}
                    hashtags={[]}
                  >
                    <TwitterIcon size={32} round />
                    <div>Twitter</div>
                  </TwitterShareButton>
                </div>
                <div className="share-social-item">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(selected[0].shareLink)
                      showToast('info', 'Link is copied!')
                      handleClearModal()
                    }}
                  >
                    <div className="link-icon">
                      <FiLink />
                    </div>
                    <div>Copy Link</div>
                  </button>
                </div>
              </div>
            )
            setModalFooter(null)
            break
          }
          case 'pin': {
            const listOfComplexes =
              user?.accounts?.data[0]?.company?.complexes?.data
            const options =
              !isEmpty(listOfComplexes) &&
              listOfComplexes.map(listOfComplex => {
                const isPinnedC = pinnedList.find(
                  pin => pin === listOfComplex?._id
                )

                if (isPinnedC) {
                  return {
                    label: (
                      <div className="flex flex-row justify-start">
                        <RiPushpinLine size={18} />
                        {listOfComplex?.name}
                      </div>
                    ),
                    value: listOfComplex?._id,
                    pinned: true
                  }
                }

                return {
                  label: listOfComplex?.name,
                  value: listOfComplex?._id,
                  pinned: false
                }
              })
            setModalType('pin')
            setModalTitle('Select Complex where to pin this post')
            setModalFooter(true)
            const val = options.find(
              option => option.value === selectedComplexPin?.value
            )

            setModalContent(
              <div>
                <ReactSelect
                  options={options}
                  onChange={val => handleSelect({ ...val, id, isPinned })}
                  value={val}
                  defaultValue={val}
                  isClearable={true}
                  placeholder="Select Complex"
                  theme={theme => ({
                    ...theme,
                    colors: {
                      ...theme.colors,
                      primary: '#f56222'
                    }
                  })}
                />
              </div>
            )
          }
        }
      }

      setShowModal(old => !old)
    },
    [selectedComplexPin, data, showModal, modalTitle, modalContent, modalFooter]
  )

  const handleClearModal = () => {
    setSelectedComplexPin(null)
    setModalType(null)
    setModalID(null)
    setShowModal(show => !show)
    setModalOkText('')
    setModalFooter(null)
    setModalContent(null)
  }

  const resetPages = () => {
    setActivePage(1)
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
        status: 'trashed'
      }
    }

    try {
      await updatePost({ variables: updateData })
    } catch (e) {
      console.log(e)
    }
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
        if (networkError?.result?.errors[0]?.code === 4000) {
          showToast('danger', 'Category name already exists')
        } else {
          showToast('danger', errors?.networkError?.result?.errors[0]?.message)
        }
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

  const handleReorder = () => {
    setReorder(prevState => !prevState)
  }

  const reorderRow = async (e, direction) => {
    try {
      let index = e.target.closest('tr').rowIndex
      const table = document.getElementById('table')
      const rows = table.rows
      const parent = rows[index].parentNode
      const currentRowID = table.rows[index].getAttribute('data-id')
      let updateData

      const acntType = user?.accounts?.data[0]?.accountType
      const id =
        acntType === 'company_admin'
          ? user?.accounts?.data[0]?.company?._id
          : user?.accounts?.data[0]?.complex?._id

      if (direction === 'up') {
        if (index > 1) {
          const upRowID = table.rows[index - 1].getAttribute('data-id')

          parent.insertBefore(rows[index], rows[index - 1])
          index--

          updateData = {
            data: {
              post1: currentRowID,
              post2: upRowID,
              complexId: id
            }
          }
          switchPost({ variables: updateData })
        }
      }

      if (direction === 'down') {
        if (index < rows.length - 1) {
          const downRowID = table.rows[index + 1].getAttribute('data-id')

          parent.insertBefore(rows[index + 1], rows[index])
          index++

          updateData = {
            data: {
              post1: currentRowID,
              post2: downRowID,
              complexId: id
            }
          }
          switchPost({ variables: updateData })
        }
      }
    } catch (error) {
      errorHandler(error)
    }
  }

  const onDateRangeChange = e => {
    onDateApply(e)
  }

  const onDateApply = date => {
    resetPages()
    setSelectedDate([
      DATE.toFriendlyISO(
        DATE.addTime(DATE.setInitialTime(date[0].startDate), 'hours', 8)
      ),
      DATE.toFriendlyISO(DATE.setEndTime(date[0].endDate))
    ])
  }

  const onDateClear = () => {
    setSelectedDate(null)
  }

  const pinPost = async (id, complexId, pin) => {
    if (id && complexId) {
      try {
        const isPinned = !!pin
        await updatePost({
          variables: {
            id: id,
            data: {
              pinOption: {
                complexId: complexId,
                pin: !isPinned
              }
            }
          }
        })
      } catch (error) {
        errorHandler(error)
      }
    }
  }

  const tableData = useMemo(() => {
    let isMine, checkbox
    return data?.getAllPost?.post?.map((item, index) => {
      let buildingName, status

      // item -> author -> complex
      // user -> accounts -> data[0] ->

      let complexID = null
      let pinThisComplex = false

      const complexIDFromItem = item?.author?.complex?._id

      if (item?.author?.accountType === 'complex_admin') {
        // check if the author is self complex
        complexID = complexIDFromItem
      } else {
        //  the author should be a company admin

        // list of complexIDS listed from this company admin
        const complexIDSFromLocalStorage =
          user?.accounts?.data[0]?.company?.complexes?.data
        const isComplexCameFromAdmin = complexIDSFromLocalStorage.find(
          cmplx => cmplx._id === complexIDFromItem
        )

        // if the post is from complex user
        if (isComplexCameFromAdmin) {
          complexID = isComplexCameFromAdmin?._id
        } else {
          // if the post from the company admin
          if (accountType === 'complex_admin') {
            complexID = user?.accounts?.data[0]?.complex?._id
          } else {
            const companyIDFromItem = item?.author?.company?._id
            const companyIDFromLocalStorage =
              user?.accounts?.data[0]?.company?._id
            if (companyIDFromItem === companyIDFromLocalStorage) {
              complexID = companyIDFromItem
              pinThisComplex = true
            }
          }
        }
      }

      const dropdownData = [
        {
          label: typeOfPage(
            'Daily Reading Details',
            'Article Details',
            'Pastoral Work Details'
          ),
          icon: <FiFileText />,
          function: () => handleShowModal('details', item._id)
        },
        {
          label: 'Who View this Article',
          icon: <FiEye />,
          function: () => handleShowModal('views', item._id)
        },
        {
          label: 'Share to Social Media',
          icon: <FiShare2 />,
          function: () => handleShowModal('share', item._id)
        }
      ]

      const isPinned =
        !isEmpty(item.pinnedForComplex) &&
        item.pinnedForComplex !== null &&
        item.pinnedForComplex.find(id => id === complexID)

      const accountTypeAuthor = item?.author?.accountType

      const complexAdminAuthor =
        accountType === 'complex_admin'
          ? (accountTypeAuthor === 'company_admin' && false) ||
            (accountTypeAuthor === 'complex_admin' && true)
          : (accountTypeAuthor === 'complex_admin' ||
              accountTypeAuthor === 'company_admin') &&
            true

      if (complexID && complexAdminAuthor) {
        dropdownData.unshift({
          label: isPinned
            ? 'Unpin this post'
            : pinThisComplex
            ? 'Pin this post to complex'
            : 'Pin this post',
          icon: <RiPushpinLine size={18} />,
          ...(!pinThisComplex
            ? {
                function: () =>
                  pinPost(
                    item?._id,
                    complexID,
                    isPinned,
                    item?.pinnedForComplex
                  )
              }
            : {
                function: () =>
                  handleShowModal(
                    'pin',
                    item?._id,
                    complexID,
                    isPinned,
                    item?.pinnedForComplex
                  )
              })
        })
      }

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
        !reorder &&
        (user._id === item.author._id ||
          accountType === ACCOUNT_TYPES.SUP.value ||
          (((item.author.accountType !== ACCOUNT_TYPES.SUP.value &&
            accountType === ACCOUNT_TYPES.COMPYAD.value) ||
            (item.author.accountType !== ACCOUNT_TYPES.SUP.value &&
              item.author.accountType !== ACCOUNT_TYPES.COMPYAD.value &&
              accountType === ACCOUNT_TYPES.COMPXAD.value)) &&
            item.author.company._id === companyID))
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

      if (accountType === 'complex_admin') {
        const admins =
          user?.accounts?.data[0]?.company?.companyAdministrators?.data
        if (admins) {
          const isAdmin = admins.find(admin => admin._id === item.author._id)
          if (isAdmin) {
            isMine = true
          }
        }
      }

      return (
        <tr key={index} data-id={item._id}>
          {!reorder && !isPinned && <td>{checkbox}</td>}
          {!reorder && isPinned && (
            <td>
              <RiPushpinLine size={20} />
            </td>
          )}
          <td>
            <div className="flex flex-col">
              {isDailyReadingsPage ? (
                <Tooltip text={item?.title}>
                  {DATE.toFriendlyShortDate(item?.dailyReadingDate)}
                </Tooltip>
              ) : (
                <span className={styles.TextWrapper}>{item?.title}</span>
              )}

              <div className="flex text-info-500 text-sm">
                {isMine ? (
                  <>
                    <Link href={`/${routeName}/edit/${item._id}`}>
                      <a className="mr-2 hover:underline">Edit</a>
                    </Link>
                    {` | `}
                    <Link href={`/${routeName}/view/${item._id}`}>
                      <a className="mx-2 hover:underline" target="_blank">
                        View
                      </a>
                    </Link>
                    <Can
                      perform={
                        isAttractionsEventsPage
                          ? 'attractions:delete'
                          : 'bulletin:delete'
                      }
                      yes={
                        <>
                          {` | `}
                          <span
                            className="mx-2 text-danger-500 cursor-pointer hover:underline"
                            onClick={() => handleShowModal('delete', item._id)}
                          >
                            Move to Trash
                          </span>
                        </>
                      }
                    />
                  </>
                ) : (
                  <>
                    <Can
                      perform={
                        isAttractionsEventsPage
                          ? 'attractions:view'
                          : 'bulletin:view'
                      }
                      yes={
                        <Link href={`/${routeName}/view/${item._id}`}>
                          <a className="mr-2 hover:underline" target="_blank">
                            View
                          </a>
                        </Link>
                      }
                    />
                  </>
                )}

                {!isDailyReadingsPage && item?.offering && (
                  <Can
                    perform={
                      isAttractionsEventsPage
                        ? 'attractions:view::donations'
                        : 'bulletin:view::donations'
                    }
                    yes={
                      <>
                        {` | `}
                        <Link href={`/${donationsRouteName}/${item._id}`}>
                          <a className="mx-2 hover:underline" target="_blank">
                            View Donations
                          </a>
                        </Link>
                      </>
                    }
                  />
                )}
              </div>
            </div>
          </td>
          {isDailyReadingsPage && (
            <td>
              <span className={styles.TextWrapper}>{item?.title}</span>
              {isDailyReadingsPage && item?.offering && (
                <Can
                  perform={
                    isAttractionsEventsPage
                      ? 'attractions:view::donations'
                      : 'bulletin:view::donations'
                  }
                  yes={
                    <Link href={`/${donationsRouteName}/${item._id}`}>
                      <a
                        className="text-info-500 text-sm hover:underline"
                        target="_blank"
                      >
                        View Donations
                      </a>
                    </Link>
                  }
                />
              )}
            </td>
          )}
          <td>
            <div className="flex flex-col">
              <span>{buildingName}</span>
              <span className="text-neutral-500 text-sm">
                {`${item.author?.user?.firstName} ${item.author?.user?.lastName} | ${item.author?.user?.email}`}
              </span>
            </div>
          </td>

          {!isDailyReadingsPage && (
            <td>{item.category?.name ?? 'Uncategorized'}</td>
          )}
          <td>
            {reorder ? (
              <>
                <Button
                  default
                  leftIcon={<FaAngleUp className="text-2xl" />}
                  className="mr-4"
                  onClick={e => reorderRow(e, 'up')}
                />
                <Button
                  default
                  leftIcon={<FaAngleDown className="text-2xl" />}
                  onClick={e => reorderRow(e, 'down')}
                />
              </>
            ) : isQRCodePage ? (
              <Button
                default
                label="Download QR"
                onClick={() => handleShowModal('download-qr', item._id)}
              />
            ) : (
              <div className="flex flex-col">
                <span>{status}</span>
                <span className="text-neutral-500 text-sm">
                  {DATE.toFriendlyShortDate(item.createdAt)}
                </span>
              </div>
            )}
          </td>
          {!reorder && (
            <td>
              <Can
                perform={
                  isAttractionsEventsPage ? 'attractions:view' : 'bulletin:view'
                }
                yes={
                  !reorder && (
                    <Dropdown label={<FaEllipsisH />} items={dropdownData} />
                  )
                }
              />
            </td>
          )}
        </tr>
      )
    })
  }, [posts, reorder, refetchPosts])

  return (
    <>
      <div className={styles.MainControl}>
        <div className={styles.BulkControl}>
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
            <div className="w-full md:mx-2">
              <DateRange
                placeholder="Filter date"
                onDateChange={onDateRangeChange}
                onDateClear={onDateClear}
                hasSideOptions={false}
                hasClear
              />
            </div>
          )}
        </div>

        <div className={styles.CategoryControl}>
          {!isDailyReadingsPage && (
            <SelectCategory
              placeholder="Filter Category"
              type={typeOfPage('', 'post', 'pastoral_works')}
              onChange={onCategorySelect}
              onClear={onClearCategory}
              selected={selectedCategory}
              isPastoralWorksPage={isPastoralWorksPage}
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
              {reorder
                ? 'Reorder Posts'
                : searchText
                ? `Search result for "${searchText}" (${posts?.count || 0})`
                : `${headerName} (${posts?.count || 0})`}
            </span>

            <div className={styles.ContentFlex}>
              {reorder ? (
                <Button
                  default
                  label="Close"
                  onClick={() => setReorder(prevState => !prevState)}
                  className="mr-4"
                />
              ) : (
                <>
                  <Can
                    perform={
                      isAttractionsEventsPage
                        ? 'attractions:reorder'
                        : isDailyReadingsPage
                        ? 'daily-reading:reorder'
                        : 'bulletin:reorder'
                    }
                    yes={
                      <Button
                        default
                        label="Reorder"
                        onClick={handleReorder}
                        className="mr-4"
                      />
                    }
                  />

                  <Can
                    perform={
                      isAttractionsEventsPage
                        ? 'attractions:create'
                        : 'bulletin:create'
                    }
                    yes={
                      <Button
                        default
                        leftIcon={<FaPlusCircle />}
                        label={
                          isQRCodePage
                            ? 'Generate QR Code'
                            : typeOfPage(
                                'Add Daily Reading',
                                'Create Post',
                                'Add Pastoral Work'
                              )
                        }
                        onClick={goToCreatePage}
                      />
                    }
                    no={
                      <Button
                        disabled
                        default
                        leftIcon={<FaPlusCircle />}
                        label={
                          isQRCodePage ? 'Generate QR Code' : 'Create Post'
                        }
                      />
                    }
                  />
                </>
              )}
            </div>
          </div>
        }
        content={
          loading ? (
            <PageLoader />
          ) : (
            tableData && (
              <Table
                custom
                rowNames={tableRowData}
                customBody={tableData}
                emptyText={
                  <NotifCard
                    icon={<FiFileText />}
                    header={`You haven’t created a ${typeOfPage(
                      'Daily Reading',
                      'Bulletin',
                      'Pastoral Work'
                    )} post yet`}
                    content={`${typeOfPage(
                      'Daily Reading',
                      'Bulletin',
                      'Pastoral Work'
                    )} posts are a great way to share information with your members. Create one now!`}
                  />
                }
              />
            )
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
        okText={
          modalOkText !== ''
            ? modalOkText
            : modalType === 'pin'
            ? 'Pin'
            : modalType === 'delete'
            ? 'Yes, move to trash'
            : 'Yes'
        }
        onOk={() =>
          (modalType === 'pin' &&
            pinPost(
              selectedComplexPin?.id,
              selectedComplexPin?.value,
              selectedComplexPin?.isPinned
            )) ||
          (modalType === 'delete' && onDeletePost()) ||
          (modalType === 'bulk' && onBulkSubmit())
        }
        onCancel={() => setShowModal(old => !old)}
      >
        <ModalContentWrapper>{modalContent}</ModalContentWrapper>
      </Modal>
    </>
  )
}

ModalContentWrapper.propTypes = {
  children: Props.node
}

PostComponent.propTpes = {
  typeOfPage: Props.func.isRequired
}

export default PostComponent
