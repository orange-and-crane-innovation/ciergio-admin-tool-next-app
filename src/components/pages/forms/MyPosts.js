/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/jsx-key */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { gql, useQuery, useMutation } from '@apollo/client'
import { debounce } from 'lodash'
import { FaPlusCircle, FaEllipsisH } from 'react-icons/fa'
import { FiFileText, FiEye } from 'react-icons/fi'

import PageLoader from '@app/components/page-loader'
import Card from '@app/components/card'
import Checkbox from '@app/components/forms/form-checkbox'
import Button from '@app/components/button'
import Table from '@app/components/table'
import Pagination from '@app/components/pagination'
import Dropdown from '@app/components/dropdown'
import Modal from '@app/components/modal'

import { DATE } from '@app/utils'
import showToast from '@app/utils/toast'
import { ACCOUNT_TYPES } from '@app/constants'
import Can from '@app/permissions/can'

import ViewsCard from './components/ViewsCard'
import UpdateCard from './components/UpdateCard'
import PostDetailsCard from './components/PostDetailsCard'
import SelectBulk from '@app/components/globals/SelectBulk'
import SelectStatus from '@app/components/globals/SelectStatus'
import SearchControl from '@app/components/globals/SearchControl'
import NotifCard from '@app/components/globals/NotifCard'

import styles from './Main.module.css'

const bulkOptions = [
  {
    label: 'Move to Trash',
    value: 'trashed'
  }
]

const GET_ALL_POST_QUERY = gql`
  query getAllPost($where: AllPostInput, $limit: Int, $offset: Int) {
    getAllPost(where: $where, limit: $limit, offset: $offset) {
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
  const [selectedStatus, setSelectedStatus] = useState()
  const [selectedBulk, setSelectedBulk] = useState()
  const [isBulkDisabled, setIsBulkDisabled] = useState(true)
  const [isBulkButtonDisabled, setIsBulkButtonDisabled] = useState(true)
  const user = JSON.parse(localStorage.getItem('profile'))
  const accountType = user?.accounts?.data[0]?.accountType
  const companyID = user?.accounts?.data[0]?.company?._id

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
      name: 'Status',
      width: '15%'
    },
    {
      name: '',
      width: ''
    }
  ]

  const { loading, data, error, refetch: refetchPosts } = useQuery(
    GET_ALL_POST_QUERY,
    {
      enabled: false,
      variables: {
        where: {
          status: selectedStatus || [
            'published',
            'draft',
            'unpublished',
            'scheduled'
          ],
          type: 'form',
          mypost: true,
          search: {
            mypost: searchText
          }
        },
        limit: limitPage,
        offset: offsetPage
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
                label: 'Form Details',
                icon: <FiFileText />,
                function: () => handleShowModal('details', item._id)
              },
              {
                label: 'Who View this Form',
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
                  {item.title}
                  {isMine && (
                    <Can
                      perform="forms:update::trash"
                      yes={
                        <div className="flex text-info-500 text-sm">
                          <Link href={`/forms/edit/${item._id}`}>
                            <a className="mr-2 hover:underline">Edit</a>
                          </Link>
                          {` | `}
                          <span
                            className="mx-2 text-danger-500 cursor-pointer hover:underline"
                            onClick={() => handleShowModal('delete', item._id)}
                          >
                            Move to Trash
                          </span>
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
              status: (
                <div className="flex flex-col">
                  <span>{status}</span>
                  <span className="text-neutral-500 text-sm">
                    {DATE.toFriendlyShortDate(item.createdAt)}
                  </span>
                </div>
              ),
              button: (
                <Can
                  perform="forms:view"
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
        setShowModal(old => !old)

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
    setActivePage(1)
    setLimitPage(10)
    setOffsetPage(0)
  }, 1000)

  const onClearSearch = () => {
    setSearchText(null)
  }

  const onClearStatus = () => {
    setSelectedStatus('')
  }

  const onClearBulk = () => {
    setSelectedBulk(null)
    setIsBulkButtonDisabled(true)
  }

  const goToCreatePage = () => {
    router.push('forms/create')
  }

  const onPageClick = e => {
    setActivePage(e)
    setOffsetPage(limitPage * (e - 1))
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
      }
    }

    if (checkboxes.length === limitPage) {
      allCheck.checked = true
    } else {
      allCheck.checked = false
    }
  }

  const handleShowModal = async (type, id) => {
    const selected = data?.getAllPost?.post?.filter(item => item._id === id)

    if (selected || selectedData?.length > 0) {
      setModalType(type)

      switch (type) {
        case 'details': {
          setModalTitle('Form Details')
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
          setModalTitle('Who Viewed this Form')
          setModalContent(<ViewsCard data={selected[0].views?.unique?.users} />)
          setModalFooter(null)
          break
        }
        case 'delete': {
          setModalTitle('Delete Form')
          setModalContent(
            <UpdateCard type="trashed" title={selected[0].title} />
          )
          setModalFooter(true)
          setModalID(selected[0]._id)
          break
        }
        case 'bulk': {
          setModalTitle('Bulk Update Form')
          setModalContent(
            <UpdateCard
              type={selectedBulk}
              title={`(${selectedData.length}) items`}
            />
          )
          setModalFooter(true)
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

  const onStatusSelect = e => {
    setSelectedStatus(e.value !== '' ? e.value : null)
    resetPages()
  }

  const onBulkChange = e => {
    setSelectedBulk(e.value)
    if (e.value !== '') {
      setIsBulkButtonDisabled(false)
    } else {
      setIsBulkButtonDisabled(true)
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

  return (
    <>
      <div className={styles.MainControl}>
        <SelectBulk
          placeholder="Bulk Action"
          options={bulkOptions}
          disabled={isBulkDisabled}
          isButtonDisabled={isBulkButtonDisabled}
          onBulkChange={onBulkChange}
          onBulkSubmit={() => handleShowModal('bulk')}
          onBulkClear={onClearBulk}
          selected={selectedBulk}
        />

        <div className={styles.CategoryControl}>
          <SelectStatus
            placeholder="Filter Status"
            onChange={onStatusSelect}
            onClear={onClearStatus}
            selected={selectedStatus}
          />
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
                : `My Posts (${posts?.count || 0})`}
            </span>

            <div className={styles.ContentFlex}>
              <Can
                perform="forms:create"
                yes={
                  <Button
                    default
                    leftIcon={<FaPlusCircle />}
                    label="Upload Form"
                    onClick={goToCreatePage}
                  />
                }
                no={
                  <Button
                    default
                    leftIcon={<FaPlusCircle />}
                    label="Upload Form"
                    disabled
                  />
                }
              />
            </div>
          </div>
        }
        content={
          loading ? (
            <PageLoader />
          ) : (
            posts && (
              <Table
                rowNames={tableRowData}
                items={posts}
                emptyText={
                  <NotifCard
                    icon={<FiFileText />}
                    header="You haven’t created any downloadable forms yet"
                    content="Give your members easier access to forms and documents by uploading them to the app."
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
        okText={modalType === 'delete' ? 'Yes, move to trash' : 'Yes'}
        onOk={() =>
          modalType === 'delete'
            ? onDeletePost()
            : modalType === 'bulk'
            ? onBulkSubmit()
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
