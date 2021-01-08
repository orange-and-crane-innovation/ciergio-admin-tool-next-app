/* eslint-disable react/jsx-key */
import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { FaPlusCircle, FaSearch, FaTimes, FaEllipsisH } from 'react-icons/fa'

import Card from '@app/components/card'
import FormInput from '@app/components/forms/form-input'
import FormSelect from '@app/components/forms/form-select'
import Button from '@app/components/button'
import Table from '@app/components/table'
import Tabs from '@app/components/tabs'
import Pagination from '@app/components/pagination'

import styles from './Main.module.css'

const PostComponent = () => {
  const router = useRouter()
  const [searchText, setSearchText] = useState()

  const bulkOptions = [
    {
      label: 'Unpublished',
      value: 'unpublish'
    },
    {
      label: 'Move to Trash',
      value: 'trash'
    }
  ]
  const bulkTrashOptions = [
    {
      label: 'Delete Permanently',
      value: 'delete'
    },
    {
      label: 'Restore',
      value: 'restore'
    }
  ]
  const filterOptions = [
    {
      label: 'All',
      value: 'all'
    },
    {
      label: 'Draft',
      value: 'draft'
    },
    {
      label: 'Published',
      value: 'published'
    },
    {
      label: 'UnPublished',
      value: 'unpublished'
    }
  ]
  const categoryOptions = [
    {
      label: 'Announcements',
      value: 'announcements'
    },
    {
      label: 'Emergency',
      value: 'emergency'
    }
  ]
  const tableRowData = [
    {
      name: 'Title',
      width: '40%'
    },
    {
      name: 'Author',
      width: '20%'
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
  const tableData = {
    count: 161,
    limit: 10,
    offset: 0,
    data: [
      {
        title: 'Post 1',
        author: 'Author 1',
        category: 'Category 1',
        status: 'Published',
        button: <FaEllipsisH />
      },
      {
        title: 'Post 2',
        author: 'Author 2',
        category: 'Category 2',
        status: 'Published',
        button: <FaEllipsisH />
      },
      {
        title: 'Post 3',
        author: 'Author 3',
        category: 'Category3',
        status: 'Published',
        button: <FaEllipsisH />
      },
      {
        title: 'Post 4',
        author: 'Author 4',
        category: 'Category 4',
        status: 'Published',
        button: <FaEllipsisH />
      },
      {
        title: 'Post 5',
        author: 'Author 5',
        category: 'Category 5',
        status: 'Published',
        button: <FaEllipsisH />
      }
    ]
  }

  const onSearch = e => {
    setSearchText(e.target.value)
  }

  const onClearSearch = () => {
    setSearchText(null)
  }

  const goToCreatePage = () => {
    router.push('posts/create')
  }

  return (
    <div className={styles.PostContainer}>
      <h1 className={styles.PostHeader}>Bulletin Board</h1>

      <Tabs defaultTab="1">
        <Tabs.TabLabels>
          <Tabs.TabLabel id="1">All Posts</Tabs.TabLabel>
          <Tabs.TabLabel id="2">My Posts</Tabs.TabLabel>
          <Tabs.TabLabel id="3">Trash</Tabs.TabLabel>
        </Tabs.TabLabels>
        <Tabs.TabPanels>
          <Tabs.TabPanel id="1">
            <div className={styles.MainControl}>
              <div className={styles.BulkControl}>
                <FormSelect options={bulkOptions} />
                <Button primary type="button" label="Apply" className="ml-2" />
              </div>
              <div className={styles.CategoryControl}>
                <FormSelect options={categoryOptions} />
                <div className={styles.SearchControl}>
                  <FormInput
                    name="search"
                    placeholder="Search by title"
                    inputClassName="pr-8"
                    onChange={onSearch}
                    value={searchText || ''}
                  />
                  <span className={styles.SearchControlIcon}>
                    {searchText ? (
                      <FaTimes
                        className="cursor-pointer"
                        onClick={onClearSearch}
                      />
                    ) : (
                      <FaSearch />
                    )}
                  </span>
                </div>
              </div>
            </div>

            <Card
              noPadding
              header={
                <div className={styles.ContentFlex}>
                  <span className={styles.CardHeader}>All Posts</span>
                  <Button
                    default
                    leftIcon={<FaPlusCircle />}
                    label="Create Post"
                    onClick={goToCreatePage}
                  />
                </div>
              }
              content={<Table rowNames={tableRowData} items={tableData} />}
            />

            <Pagination
              items={tableData}
              activePage={1}
              onPageClick={e => alert('Page ' + e)}
              onLimitChange={e => alert('Show ' + e.target.value)}
            />
          </Tabs.TabPanel>
          <Tabs.TabPanel id="2">
            <div className={styles.MainControl}>
              <div className={styles.BulkControl}>
                <FormSelect options={bulkOptions} />
                <Button primary type="button" label="Apply" className="ml-2" />
              </div>
              <div className={styles.CategoryControl}>
                <FormSelect options={filterOptions} />
                <FormSelect options={categoryOptions} />
                <div className={styles.SearchControl}>
                  <FormInput
                    name="search"
                    placeholder="Search by title"
                    inputClassName="pr-8"
                    onChange={onSearch}
                    value={searchText || ''}
                  />
                  <span className={styles.SearchControlIcon}>
                    {searchText ? (
                      <FaTimes
                        className="cursor-pointer"
                        onClick={onClearSearch}
                      />
                    ) : (
                      <FaSearch />
                    )}
                  </span>
                </div>
              </div>
            </div>

            <Card
              noPadding
              header={
                <div className={styles.ContentFlex}>
                  <span className={styles.CardHeader}>My Posts</span>
                  <Button
                    default
                    leftIcon={<FaPlusCircle />}
                    label="Create Post"
                    onClick={goToCreatePage}
                  />
                </div>
              }
              content={<Table rowNames={tableRowData} items={tableData} />}
            />

            <Pagination
              items={tableData}
              activePage={1}
              onPageClick={e => alert('Page ' + e)}
              onLimitChange={e => alert('Show ' + e.target.value)}
            />
          </Tabs.TabPanel>
          <Tabs.TabPanel id="3">
            <div className={styles.HeaderSmall}>
              Articles in Trash will be automatically deleted after{' '}
              <strong>30 days</strong>.
            </div>
            <div className={styles.MainControl}>
              <div className={styles.BulkControl}>
                <FormSelect options={bulkTrashOptions} />
                <Button primary type="button" label="Apply" className="ml-2" />
              </div>
              <div className={styles.CategoryControl}>
                <FormSelect options={categoryOptions} />
                <div className={styles.SearchControl}>
                  <FormInput
                    name="search"
                    placeholder="Search by title"
                    inputClassName="pr-8"
                    onChange={onSearch}
                    value={searchText || ''}
                  />
                  <span className={styles.SearchControlIcon}>
                    {searchText ? (
                      <FaTimes
                        className="cursor-pointer"
                        onClick={onClearSearch}
                      />
                    ) : (
                      <FaSearch />
                    )}
                  </span>
                </div>
              </div>
            </div>

            <Card
              noPadding
              header={
                <div className={styles.ContentFlex}>
                  <span className={styles.CardHeader}>Trash</span>
                  <Button
                    default
                    leftIcon={<FaPlusCircle />}
                    label="Create Post"
                    onClick={goToCreatePage}
                  />
                </div>
              }
              content={<Table rowNames={tableRowData} items={tableData} />}
            />

            <Pagination
              items={tableData}
              activePage={1}
              onPageClick={e => alert('Page ' + e)}
              onLimitChange={e => alert('Show ' + e.target.value)}
            />
          </Tabs.TabPanel>
        </Tabs.TabPanels>
      </Tabs>
    </div>
  )
}

export default PostComponent
