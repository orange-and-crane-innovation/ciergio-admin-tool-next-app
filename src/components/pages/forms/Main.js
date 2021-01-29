/* eslint-disable react/jsx-key */
import React from 'react'

import Tabs from '@app/components/tabs'

import AllPostPage from './AllPosts'
import MyPostPage from './MyPosts'
import TrashPage from './Trashed'

import styles from './Main.module.css'

const PostComponent = () => {
  return (
    <div className={styles.PostContainer}>
      <h1 className={styles.PostHeader}>Forms</h1>

      <Tabs defaultTab="1">
        <Tabs.TabLabels>
          <Tabs.TabLabel id="1">All Forms</Tabs.TabLabel>
          <Tabs.TabLabel id="2">My Forms</Tabs.TabLabel>
          <Tabs.TabLabel id="3">Trash</Tabs.TabLabel>
        </Tabs.TabLabels>
        <Tabs.TabPanels>
          <Tabs.TabPanel id="1">
            <AllPostPage />
          </Tabs.TabPanel>
          <Tabs.TabPanel id="2">
            <MyPostPage />
          </Tabs.TabPanel>
          <Tabs.TabPanel id="3">
            <TrashPage />
          </Tabs.TabPanel>
          {/* <Tabs.TabPanel id="2">
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
                  <span className={styles.CardHeader}>
                    My Posts ({posts.count})
                  </span>
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
                  <span className={styles.CardHeader}>
                    Trash ({tableData.length})
                  </span>
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
          </Tabs.TabPanel> */}
        </Tabs.TabPanels>
      </Tabs>
    </div>
  )
}

export default PostComponent
