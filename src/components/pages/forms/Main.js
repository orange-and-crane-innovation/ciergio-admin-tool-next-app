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

const FormComponent = () => {
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
        title: 'Forms 1',
        author: 'Author 1',
        status: 'Published',
        button: <FaEllipsisH />
      },
      {
        title: 'Forms 2',
        author: 'Author 2',
        status: 'Published',
        button: <FaEllipsisH />
      },
      {
        title: 'Forms 3',
        author: 'Author 3',
        status: 'Published',
        button: <FaEllipsisH />
      },
      {
        title: 'Forms 4',
        author: 'Author 4',
        status: 'Published',
        button: <FaEllipsisH />
      },
      {
        title: 'Forms 5',
        author: 'Author 5',
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
    router.push('forms/create')
  }

  return (
    <div className={styles.FormContainer}>
      <h1 className={styles.FormHeader}>Forms</h1>

      <Tabs defaultTab="1">
        <Tabs.TabLabels>
          <Tabs.TabLabel id="1">All Forms</Tabs.TabLabel>
          <Tabs.TabLabel id="2">My Forms</Tabs.TabLabel>
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
                  <span className={styles.CardHeader}>All Forms</span>
                  <Button
                    default
                    leftIcon={<FaPlusCircle />}
                    label="Upload Form"
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
                  <span className={styles.CardHeader}>My Forms</span>
                  <Button
                    default
                    leftIcon={<FaPlusCircle />}
                    label="Upload Form"
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
              Forms in Trash will be automatically deleted after{' '}
              <strong>30 days</strong>.
            </div>
            <div className={styles.MainControl}>
              <div className={styles.BulkControl}>
                <FormSelect options={bulkTrashOptions} />
                <Button primary type="button" label="Apply" className="ml-2" />
              </div>
              <div className={styles.CategoryControl}>
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

export default FormComponent
