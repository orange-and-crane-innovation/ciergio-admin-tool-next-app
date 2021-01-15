/* eslint-disable react/jsx-key */
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
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
import { Draggable } from '@app/components/globals'
import Modal from '@app/components/modal'

import { DATE } from '@app/utils'
import showToast from '@app/utils/toast'

import ViewsCard from './components/ViewsCard'
import PostDetailsCard from './components/PostDetailsCard'
import SelectBulk from '@app/components/globals/SelectBulk'
import SelectCategory from '@app/components/globals/SelectCategory'
import SearchControl from '@app/components/globals/SearchControl'

import styles from './Main.module.css'

const bulkOptions = [
  {
    label: '',
    value: ''
  },
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
          user {
            firstName
            lastName
            email
            avatar
          }
          accountType
          company {
            name
          }
          complex {
            name
          }
          building {
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

const BULK_UPDATE_MUTATION = gql`
  mutation bulkUpdatePost($id: [String], $status: postStatus) {
    bulkUpdatePost(id: $id, status: $status) {
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
  const [reorder, setReorder] = useState(false)
  const [reOrderedLists, setReOrderedLists] = useState()
  const [selectedData, setSelectedData] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [modalContent, setModalContent] = useState()
  const [modalTitle, setModalTitle] = useState()
  const [selectedCategory, setSelectedCategory] = useState()
  const [selectedBulk, setSelectedBulk] = useState()
  const [isBulkDisabled, setIsBulkDisabled] = useState(true)
  const [isBulkButtonDisabled, setIsBulkButtonDisabled] = useState(true)

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
      width: '20%'
    },
    {
      name: 'Author',
      width: '30%'
    },
    {
      name: 'Category',
      width: ''
    },
    {
      name: 'Status',
      width: ''
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
          status: ['trashed'],
          type: 'post',
          categoryId: selectedCategory,
          search: {
            allpost: searchText
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

  useEffect(() => {
    if (!loading && data) {
      const tableData = {
        count: data?.getAllPost.count || 0,
        limit: data?.getAllPost.limit || 0,
        offset: data?.getAllPost.offset || 0,
        data:
          data?.getAllPost.post.map(item => {
            let buildingName, status
            const dropdownData = [
              {
                label: 'Article Details',
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
              case 'administrator': {
                buildingName = item.author?.company?.name
                break
              }
              case 'company_admin': {
                buildingName = item.author?.company?.name
                break
              }
              case 'complex_admin': {
                buildingName = item.author?.complex?.name
                break
              }
              case 'building_admin': {
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

            return {
              checkbox: (
                <Checkbox
                  primary
                  id={`checkbox-${item._id}`}
                  name="checkbox"
                  data-id={item._id}
                  onChange={onCheck}
                />
              ),
              title: item.title,
              author: (
                <div className="flex flex-col">
                  <span>{buildingName}</span>
                  <span className="text-neutral-500 text-sm">
                    {`${item.author?.user?.firstName} ${item.author?.user?.lastName} | ${item.author?.user?.email}`}
                  </span>
                </div>
              ),
              category: item.category?.name,
              status: (
                <div className="flex flex-col">
                  <span>{status}</span>
                  <span className="text-neutral-500 text-sm">
                    {DATE.toFriendlyDate(item.createdAt)}
                  </span>
                </div>
              ),
              button: <Dropdown label={<FaEllipsisH />} items={dropdownData} />
            }
          }) || null
      }

      setPosts(tableData)

      setReOrderedLists(
        tableData.data.map((item, index) => ({
          ...item,
          id: index
        }))
      )
    }
  }, [loading, data, error])

  useEffect(() => {
    if (!loadingBulk && errorBulk) {
      showToast(
        'danger',
        `An error occured during update. Please contact your system administrator.`
      )
    }

    if (!loadingBulk && calledBulk && dataBulk) {
      if (dataBulk?.bulkUpdatePost?.message === 'success') {
        const allCheck = document.getElementsByName('checkbox_select_all')[0]
        const itemsCheck = document.getElementsByName('checkbox')

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
        setSelectedBulk('')

        showToast('success', `You have successfully updated a post`)
        refetchPosts()
      } else {
        showToast('danger', `Bulk update failed`)
      }
    }
  }, [loadingBulk, errorBulk, calledBulk, dataBulk, refetchPosts])

  const onSearch = debounce(e => {
    setSearchText(e.target.value !== '' ? e.target.value : null)
  }, 1000)

  const onClearSearch = () => {
    setSearchText(null)
  }

  const onClearCategory = () => {
    setSelectedCategory('')
  }

  const onClearBulk = () => {
    setSelectedBulk('')
  }

  const goToCreatePage = () => {
    router.push('posts/create')
  }

  const onPageClick = e => {
    setActivePage(e)
    setOffsetPage(e * limitPage)
  }

  const onLimitChange = e => {
    setLimitPage(Number(e.target.value))
  }

  const onCheckAll = e => {
    const checkboxes = document.getElementsByName('checkbox')

    setSelectedBulk('')
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
        setSelectedBulk('')
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

  const handleShowModal = (type, id) => {
    const selected = data?.getAllPost?.post?.filter(item => item._id === id)

    if (selected) {
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
          break
        }
        case 'views': {
          setModalTitle('Who Viewed this Article')
          setModalContent(<ViewsCard data={selected[0].views?.unique?.users} />)
          break
        }
      }
      setShowModal(old => !old)
    }
  }

  const handleClearModal = () => {
    handleShowModal()
  }

  const onCategorySelect = e => {
    setSelectedCategory(e.target.value !== '' ? e.target.value : null)
    setActivePage(1)
    setLimitPage(10)
    setOffsetPage(0)
  }

  const onBulkChange = e => {
    setSelectedBulk(e.target.value)
    if (e.target.value !== '') {
      setIsBulkButtonDisabled(false)
    } else {
      setIsBulkButtonDisabled(true)
    }
  }

  const onBulkSubmit = () => {
    const data = { id: selectedData, status: selectedBulk }
    bulkUpdate({ variables: data })
  }

  return (
    <>
      <div className={styles.MainControl}>
        <SelectBulk
          placeholder="Select"
          options={bulkOptions}
          disabled={isBulkDisabled}
          isButtonDisabled={isBulkButtonDisabled}
          onBulkChange={onBulkChange}
          onBulkSubmit={onBulkSubmit}
          onBulkClear={onClearBulk}
          selected={selectedBulk}
        />

        <div className={styles.CategoryControl}>
          <SelectCategory
            type="post"
            userType="administrator"
            onChange={onCategorySelect}
            onClear={onClearCategory}
            selected={selectedCategory}
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
              {reorder
                ? 'Reorder Posts'
                : searchText
                ? `Search result for "${searchText}" (${posts?.count || 0})`
                : `Trash (${posts?.count || 0})`}
            </span>

            <div className={styles.ContentFlex}>
              {reorder ? (
                <>
                  <Button
                    default
                    label="Cancel"
                    onClick={() => setReorder(prevState => !prevState)}
                    className="mr-4"
                  />
                  <Button
                    primary
                    label="Save"
                    onClick={() => {
                      setPosts({
                        ...posts,
                        data: reOrderedLists
                      })
                      setReorder(prevState => !prevState)
                    }}
                  />
                </>
              ) : (
                <>
                  <Button
                    default
                    label="Reorder"
                    onClick={() => setReorder(prevState => !prevState)}
                    className="mr-4"
                  />
                  <Button
                    default
                    leftIcon={<FaPlusCircle />}
                    label="Create Post"
                    onClick={goToCreatePage}
                  />
                </>
              )}
            </div>
          </div>
        }
        content={
          loading ? (
            <PageLoader />
          ) : reorder ? (
            posts && (
              <Draggable
                list={reOrderedLists}
                onListChange={setReOrderedLists}
                rowNames={tableRowData}
              />
            )
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
        footer={null}
      >
        <div className="w-full">{modalContent}</div>
      </Modal>
    </>
  )
}

export default PostComponent
