import { useState } from 'react'
import { useQuery, useLazyQuery, useMutation } from '@apollo/client'
import Dropdown from '@app/components/dropdown'
import Toggle from '@app/components/toggle'
import Spinner from '@app/components/spinner'
import useWindowDimensions from '@app/utils/useWindowDimensions'
import MessagePreviewItem from './components/MessagePreviewItem'
import MessageBox from './components/MessageBox'
import NewMessageModal from './components/NewMessageModal'
import { AiOutlineEllipsis } from 'react-icons/ai'
import { GoSettings } from 'react-icons/go'
import { FiEdit } from 'react-icons/fi'
import styles from './messages.module.css'

import {
  createConversation,
  // getMessages,
  getAccounts,
  getConversations
} from './queries'

export default function Main() {
  const { height } = useWindowDimensions()
  const profile = JSON.parse(localStorage.getItem('profile'))
  const [showPendingMessages, setShowPendingMessages] = useState(false)
  const [messageTitle, setMessageTitle] = useState('')
  const [convoType, setConvoType] = useState(
    localStorage.getItem('convoType') || 'group'
  )
  const [showNewMessageModal, setShowNewMessageModal] = useState(false)

  const { data: conversations, loading: loadingConvo } = useQuery(
    getConversations,
    {
      variables: {
        where: {
          participants: [profile?._id],
          includeEmptyConversation: false,
          pending: showPendingMessages,
          type: convoType
        }
      }
    }
  )
  const [
    fetchAccounts,
    { data: accounts, loading: loadingAccounts }
  ] = useLazyQuery(getAccounts)
  const [createNewMessage, { loading: creatingConversation }] = useMutation(
    createConversation
  )

  const dropdownData = [
    {
      label: 'Group',
      icon: null,
      function: () => {
        setConvoType('group')
        localStorage.setItem('convoType', 'group')
      }
    },
    {
      label: 'Personal',
      icon: null,
      function: () => {
        setConvoType('private')
        localStorage.setItem('convoType', 'private')
      }
    }
  ]

  const togglePendingMessages = checked => setShowPendingMessages(checked)
  const handleMessagePreviewClick = str => setMessageTitle(str)
  const handleNewMessageModal = () => setShowNewMessageModal(old => !old)
  const handleAccountClick = userid => {
    console.log({ userid })
    createNewMessage({
      variables: {
        data: {}
      }
    })
    handleNewMessageModal()
  }

  return (
    <section
      className={styles.messagesContainer}
      style={{ height: `calc(${height}px - 70px)` }}
    >
      <div className={styles.messagesListContainer}>
        <div className={styles.messagesListHeader}>
          <h3 className="text-base font-bold">Residents</h3>
          <div className="flex items-center">
            <button className={styles.messagesButton}>
              <GoSettings />
            </button>
            <button
              className={styles.messagesButton}
              onClick={() => {
                fetchAccounts({
                  variables: {
                    limit: 100,
                    skip: 0,
                    accountTypes: ['company_admin', 'complex_admin', 'member'],
                    companyId: '5f290f7d0dcafc0ba70e0721',
                    status: 'active'
                  }
                })
                handleNewMessageModal()
              }}
            >
              <FiEdit className="text-orange-600" />
            </button>
            <Dropdown label={<AiOutlineEllipsis />} items={dropdownData} />
          </div>
        </div>
        <div className={styles.pendingToggleContainer}>
          <span>Show pending messages</span>
          <Toggle onChange={togglePendingMessages} />
        </div>
        <div
          className={styles.messagesListItems}
          style={{ height: `calc(${height}px - 180px)` }}
        >
          {loadingConvo || creatingConversation ? <Spinner /> : null}
          {(!loadingConvo || !creatingConversation) &&
          conversations?.getConversations?.count > 0 ? (
            conversations?.getConversations.data.map(convo => (
              <MessagePreviewItem
                key={convo._id}
                onClick={handleMessagePreviewClick}
                data={convo}
              />
            ))
          ) : (
            <div className="h-full flex items-center justify-center">
              <p>No conversations yet.</p>
            </div>
          )}
        </div>
      </div>
      <MessageBox messageTitle={messageTitle} />
      <NewMessageModal
        visible={showNewMessageModal}
        onCancel={handleNewMessageModal}
        onSelectUser={handleAccountClick}
        loadingUsers={loadingAccounts}
        users={accounts?.getAccounts?.data || []}
      />
    </section>
  )
}
