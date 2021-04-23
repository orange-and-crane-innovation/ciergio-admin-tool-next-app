import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useResettableMutation } from 'apollo-hooks-extended'
import { debounce } from 'lodash'

import Tabs from '@app/components/tabs'
import SelectBulk from '@app/components/globals/SelectBulk'
import SelectCategory from '@app/components/globals/SelectCategory'
import Search from '@app/components/globals/SearchControl'
import Modal from '@app/components/modal'

import Notification from '../components/Notification'

import {
  bulkOptions,
  UPCOMING,
  PUBLISHED,
  DRAFT,
  TRASHED,
  bulkOptionsTrash
} from '../constants'

import {
  GET_ALL_UPCOMING_NOTIFICATIONS,
  GET_ALL_PUBLISHED_NOTIFICATIONS,
  GET_ALL_DRAFT_NOTIFICATIONS,
  GET_ALL_TRASHED_NOTIFICATIONS,
  BULK_UPDATE_MUTATION
} from '../queries'

const tabs = [
  {
    type: UPCOMING,
    query: GET_ALL_UPCOMING_NOTIFICATIONS
  },
  {
    type: PUBLISHED,
    query: GET_ALL_PUBLISHED_NOTIFICATIONS
  },
  {
    type: DRAFT,
    query: GET_ALL_DRAFT_NOTIFICATIONS
  },
  {
    type: TRASHED,
    query: GET_ALL_TRASHED_NOTIFICATIONS
  }
]

const { TabPanels, TabPanel, TabLabel, TabLabels } = Tabs

function NotificationsList() {
  const router = useRouter()
  const [searchText, setSearchText] = useState()
  const [isBulkDisabled, setIsBulkDisabled] = useState(true)
  const [isBulkButtonDisabled, setIsBulkButtonDisabled] = useState(true)
  const [selectedBulk, setSelectedBulk] = useState()
  const [category, setCategory] = useState(null)
  const [selectedData, setSelectedData] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState()
  const [modalContent, setModalContent] = useState()
  const [modalTitle, setModalTitle] = useState()
  const [modalFooter, setModalFooter] = useState(null)

  const [
    bulkUpdate,
    { called: calledBulk, data: dataBulk, reset: resetBulk }
  ] = useResettableMutation(BULK_UPDATE_MUTATION)

  useEffect(() => {
    if (calledBulk && dataBulk) {
      handleClearModal()
    }
  }, [calledBulk, dataBulk])

  const onClearBulk = () => {
    setSelectedBulk('')
  }

  const onBulkSubmit = () => {
    const data = { id: selectedData, status: selectedBulk }
    bulkUpdate({ variables: data })
  }

  const onBulkChange = e => {
    setSelectedBulk(e.value)
    if (e.value !== '') {
      setIsBulkButtonDisabled(false)
    } else {
      setIsBulkButtonDisabled(true)
    }
  }

  const onCategorySelect = e => {
    setCategory(e.value !== '' ? e.value : null)
  }

  const onClearCategory = () => {
    setCategory(null)
  }

  const handleShowModal = (type, id) => {
    if (selectedData?.length > 0) {
      switch (type) {
        case 'bulk': {
          let typeName

          switch (selectedBulk) {
            case 'unpublished': {
              typeName = 'unpublish'
              break
            }
            case 'trashed': {
              typeName = 'move to trash'
              break
            }
            case 'deleted': {
              typeName = 'delete permanently'
              break
            }
            case 'draft': {
              typeName = 'restore'
              break
            }
          }

          setModalType(type)

          setModalTitle('Bulk Update Post')
          setModalContent(
            <div className="text-base mb-8">
              <p>
                {`You are about to `}
                <strong>{`${typeName} "(${selectedData.length}) items" `}</strong>
                {`from the list.`}
              </p>
              <br />
              <p>Do you want to continue?</p>
            </div>
          )
          setModalFooter(true)
          break
        }
      }
      setShowModal(old => !old)
    }
  }

  const handleClearModal = () => {
    setShowModal(old => !old)
  }

  const onSearch = debounce(e => {
    setSearchText(e.target.value !== '' ? e.target.value : null)
  }, 1000)

  const onClearSearch = () => {
    setSearchText(null)
  }

  return (
    <section className="content-wrap text-base">
      <h1 className="content-title">Notifications</h1>

      <Tabs defaultTab={router.query.tab || UPCOMING}>
        <TabLabels>
          {tabs.map(({ type }) => {
            const label = `${type.charAt(0).toUpperCase()}${type.slice(1)}`
            return (
              <TabLabel key={type} id={type}>
                {label}
              </TabLabel>
            )
          })}
        </TabLabels>
        <span>
          {router?.query?.tab === 'trashed' && (
            <>
              Trashed notifications will be automatically deleted after{' '}
              <strong>30 days</strong>.
            </>
          )}
        </span>

        <div className="flex items-center justify-between mt-12 flex-col md:flex-row">
          <SelectBulk
            placeholder="Bulk Action"
            options={
              router?.query?.tab === TRASHED ? bulkOptionsTrash : bulkOptions
            }
            disabled={isBulkDisabled}
            isButtonDisabled={isBulkButtonDisabled}
            onBulkChange={onBulkChange}
            onBulkSubmit={() => handleShowModal('bulk')}
            onBulkClear={onClearBulk}
            selected={selectedBulk}
          />
          <div className="flex items-center justify-end w-full flex-col md:w-6/12 md:flex-row">
            <SelectCategory
              placeholder="Filter Category"
              type="flash"
              onChange={onCategorySelect}
              onClear={onClearCategory}
              selected={category}
            />
            <div className="ml-2">
              <Search
                placeholder="Search by title"
                searchText={searchText || ''}
                onSearch={onSearch}
                onClearSearch={onClearSearch}
              />
            </div>
          </div>
        </div>
        <TabPanels>
          {tabs.map(({ type, query }) => (
            <TabPanel key={type} id={type}>
              <Notification
                type={type}
                query={query}
                calledBulk={calledBulk}
                dataBulk={dataBulk}
                resetBulk={resetBulk}
                selectedData={selectedData}
                selectedBulk={selectedBulk}
                setSelectedData={setSelectedData}
                setIsBulkButtonDisabled={setIsBulkButtonDisabled}
                setIsBulkDisabled={setIsBulkDisabled}
                setSelectedBulk={setSelectedBulk}
                categoryId={category}
                searchText={searchText}
              />
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>

      <Modal
        title={modalTitle}
        visible={showModal}
        onClose={handleClearModal}
        footer={modalFooter}
        okText={modalType === 'delete' ? 'Yes, move to trash' : 'Yes'}
        onOk={() => (modalType === 'bulk' ? onBulkSubmit() : null)}
        onCancel={handleClearModal}
      >
        <div className="w-full">{modalContent}</div>
      </Modal>
    </section>
  )
}

export default NotificationsList
