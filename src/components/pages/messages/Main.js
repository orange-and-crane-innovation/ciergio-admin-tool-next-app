import { useState, useEffect } from 'react'
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
  getMessages,
  getAccounts,
  getConversations,
  sendMessage,
  updateConversation
} from './queries'

export default function Main() {
  const { height } = useWindowDimensions()
  const profile = JSON.parse(localStorage.getItem('profile'))
  const accountId = profile?.accounts?.data[0]._id
  const [showPendingMessages, setShowPendingMessages] = useState(false)
  const [convoType, setConvoType] = useState(
    localStorage.getItem('convoType') || 'group'
  )
  const [showNewMessageModal, setShowNewMessageModal] = useState(false)

  const { data: convos, loading: loadingConvo } = useQuery(getConversations, {
    variables: {
      where: {
        participants: [accountId],
        includeEmptyConversation: true,
        pending: showPendingMessages,
        type: convoType
      }
    }
  })
  const [updateConvo] = useMutation(updateConversation)
  const [sendNewMessage, { called: hasSentNewMessage }] = useMutation(
    sendMessage,
    {
      onCompleted: () => {
        refetchMessages({
          variables: {
            limit: 10,
            skip: 0,
            where: {
              conversationId: selectedConvo?._id
            }
          }
        })
      }
    }
  )

  const conversations = convos?.getConversations
  const firstConvo = conversations?.data[0]
  const [selectedConvo, setSelectedConvo] = useState(null)

  useEffect(() => {
    if (firstConvo) {
      handleMessagePreviewClick(firstConvo)
    }
  }, [firstConvo])

  useEffect(() => {
    if (selectedConvo && !hasSentNewMessage) {
      console.log('fetching messages after selecting convo')
      updateConvo({
        variables: {
          convoId: selectedConvo?._id
        }
      })
      fetchMessages({
        variables: {
          limit: 10,
          skip: 0,
          where: {
            conversationId: selectedConvo?._id
          }
        }
      })
    }
  }, [selectedConvo, hasSentNewMessage])

  const [
    fetchAccounts,
    { data: accounts, loading: loadingAccounts }
  ] = useLazyQuery(getAccounts)
  const [
    createNewConversation,
    { loading: creatingConversation }
  ] = useMutation(createConversation)
  const [
    fetchMessages,
    { data: messages, loading: loadingMessages, refetch: refetchMessages }
  ] = useLazyQuery(getMessages)
  const convoMessages = messages?.getMessages

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

  const handleMessagePreviewClick = convo => {
    setSelectedConvo(convo)
  }

  const handleNewMessageModal = () => setShowNewMessageModal(old => !old)

  const handleAccountClick = userid => {
    createNewConversation({
      variables: {
        data: {
          type: convoType,
          participants: [userid, accountId]
        }
      }
    })
    handleNewMessageModal()
  }

  const handleSubmitMessage = message => {
    sendNewMessage({
      variables: {
        convoId: selectedConvo?._id,
        data: {
          message
        }
      }
    })
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
          {conversations?.count > 0 ? (
            conversations.data.map(convo => (
              <MessagePreviewItem
                key={convo._id}
                onClick={handleMessagePreviewClick}
                data={convo}
                isSelected={selectedConvo?._id === convo._id}
              />
            ))
          ) : (
            <div className="h-full flex items-center justify-center">
              <p>No conversations yet.</p>
            </div>
          )}
        </div>
      </div>
      <MessageBox
        recipient={selectedConvo}
        conversation={convoMessages}
        loading={loadingMessages}
        onSubmitMessage={handleSubmitMessage}
        currentUserid={parseInt(accountId)}
      />
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
