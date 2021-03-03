import { useState, useEffect } from 'react'
import { useQuery, useLazyQuery, useMutation } from '@apollo/client'
import axios from 'axios'
import Dropdown from '@app/components/dropdown'
import Toggle from '@app/components/toggle'
import Spinner from '@app/components/spinner'
import useWindowDimensions from '@app/utils/useWindowDimensions'
import MessagePreviewItem from './components/MessagePreviewItem'
import MessageBox from './components/MessageBox'
import NewMessageModal from './components/NewMessageModal'
import useDebounce from '@app/utils/useDebounce'
import showToast from '@app/utils/toast'
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
  updateConversation,
  seenMessage
} from './queries'

export default function Main() {
  const { height } = useWindowDimensions()
  const profile = JSON.parse(localStorage.getItem('profile'))
  const accountId = profile?.accounts?.data[0]?._id
  const companyId = profile?.accounts?.data[0]?.company?._id
  const [showPendingMessages, setShowPendingMessages] = useState(false)
  const [convoType, setConvoType] = useState(
    localStorage.getItem('convoType') || 'group'
  )
  const [showNewMessageModal, setShowNewMessageModal] = useState(false)
  const [selectedConvo, setSelectedConvo] = useState(null)
  const [search, setSearch] = useState('')
  const [uploadedAttachments, setUploadedAttachments] = useState(null)
  const [attachmentURLs, setAttachmentURLs] = useState([])
  const [isUploadingAttachment, setIsUploadingAttachment] = useState(false)
  const maxAttachments = 5
  const debouncedSearch = useDebounce(search, 500)

  useEffect(() => {
    fetchAccounts({
      variables: {
        where: {
          accountTypes: [
            'company_admin',
            'complex_admin',
            'resident',
            'member'
          ],
          companyId,
          search: debouncedSearch
        }
      }
    })
  }, [debouncedSearch])

  const {
    data: convos,
    loading: loadingConvo,
    refetch: refetchConversations
  } = useQuery(getConversations, {
    variables: {
      where: {
        participants: [accountId],
        includeEmptyConversation: false,
        pending: showPendingMessages,
        type: convoType
      }
    }
  })
  const [updateConvo] = useMutation(updateConversation)
  const [sendNewMessage] = useMutation(sendMessage, {
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
  })
  const [seenNewMessage] = useMutation(seenMessage)

  const conversations = convos?.getConversations
  const firstConvo = conversations?.data[0]

  useEffect(() => {
    if (firstConvo) {
      handleMessagePreviewClick(firstConvo)
    }
  }, [firstConvo])

  useEffect(() => {
    if (selectedConvo) {
      if (selectedConvo?.messages?.data[0]?._id) {
        seenNewMessage({
          variables: {
            messageId: selectedConvo?.messages?.data[0]?._id
          }
        })
      }
      fetchMessages({
        variables: {
          limit: 10,
          skip: 0,
          where: {
            conversationId: selectedConvo?._id
          }
        }
      })
      updateConvo({
        variables: {
          convoId: selectedConvo?._id
        }
      })
    }
  }, [selectedConvo])

  const [
    fetchAccounts,
    { data: accounts, loading: loadingAccounts }
  ] = useLazyQuery(getAccounts)
  const [
    createNewConversation,
    { loading: creatingConversation }
  ] = useMutation(createConversation, {
    onCompleted: () => {
      refetchConversations({
        variables: {
          where: {
            participants: [accountId],
            includeEmptyConversation: true,
            pending: showPendingMessages,
            type: convoType
          }
        }
      })
    }
  })
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
    if (conversations?.data?.length > 0) {
      const index = conversations?.data.findIndex(
        convo => convo.participants.data[1].user._id === userid
      )
      const isExist = index !== -1
      if (isExist) {
        handleMessagePreviewClick(conversations?.data[index])
        handleNewMessageModal()
        return
      }
    }

    createNewConversation({
      variables: {
        data: {
          type: convoType,
          participants: [userid]
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
          message,
          attachments:
            uploadedAttachments?.length > 0
              ? [...uploadedAttachments].map(({ url, filename, type }) => ({
                  url,
                  type,
                  filename
                }))
              : null
        }
      }
    })
  }

  const handleSearchAccounts = text => {
    setSearch(text)
  }

  const uploadApi = async payload => {
    const response = await axios.post(
      process.env.NEXT_PUBLIC_UPLOAD_API,
      payload,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )

    if (response.data) {
      const data = response.data.map(item => {
        return {
          url: item.location,
          type: item.mimetype,
          filename: item.originalname,
          size: item.size
        }
      })

      setUploadedAttachments(old => [...old, ...data])
    }
  }

  const onRemoveAttachment = e => {
    const data = uploadedAttachments?.filter(item => {
      return item.url !== e.target.dataset.id
    })
    setUploadedAttachments(data)
  }

  const onUploadAttachment = e => {
    const files = e.target?.files || e.dataTransfer.files
    const formData = new FormData()
    const fileList = []

    if (files) {
      if (files.length > maxAttachments) {
        showToast('info', `Maximum of ${maxAttachments} attachments only`)
      } else {
        setIsUploadingAttachment(true)
        for (const file of files) {
          const reader = new FileReader()

          reader.onloadend = () => {
            setAttachmentURLs(imageUrls => [...imageUrls, reader.result])
            setIsUploadingAttachment(false)
          }
          reader.readAsDataURL(file)

          formData.append('photos', file)
          fileList.push(file)
        }
        uploadApi(formData)
      }
    }
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
                    accountTypes: [
                      'company_admin',
                      'complex_admin',
                      'resident',
                      'member'
                    ],
                    companyId
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
          {!loadingConvo &&
          !creatingConversation &&
          conversations?.count > 0 ? (
            conversations.data.map(convo => (
              <MessagePreviewItem
                key={convo._id}
                onClick={handleMessagePreviewClick}
                data={convo}
                isSelected={selectedConvo?._id === convo._id}
                currentUserid={parseInt(profile?._id)}
              />
            ))
          ) : (
            <div className="h-full flex items-center justify-center">
              <p>No conversations found.</p>
            </div>
          )}
        </div>
      </div>
      <MessageBox
        participant={selectedConvo}
        conversation={convoMessages}
        loading={loadingMessages}
        onSubmitMessage={handleSubmitMessage}
        currentUserid={parseInt(profile?._id)}
        onUpload={onUploadAttachment}
        onRemove={onRemoveAttachment}
        loadingAttachment={isUploadingAttachment}
        attachments={uploadedAttachments}
        attachmentURLs={attachmentURLs}
      />
      <NewMessageModal
        visible={showNewMessageModal}
        onCancel={handleNewMessageModal}
        onSelectUser={handleAccountClick}
        loadingUsers={loadingAccounts}
        users={accounts?.getAccounts?.data || []}
        onSearchChange={handleSearchAccounts}
        searchText={search}
      />
    </section>
  )
}
