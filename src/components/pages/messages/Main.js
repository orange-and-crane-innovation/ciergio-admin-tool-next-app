import { useState, useEffect, useMemo } from 'react'
import { useQuery, useLazyQuery, useMutation } from '@apollo/client'
import axios from '@app/utils/axios'
import Toggle from '@app/components/toggle'
import Spinner from '@app/components/spinner'
import useWindowDimensions from '@app/utils/useWindowDimensions'
import MessagePreviewItem from './components/MessagePreviewItem'
import MessageBox from './components/MessageBox'
import NewMessageModal from './components/NewMessageModal'
import useDebounce from '@app/utils/useDebounce'
import showToast from '@app/utils/toast'
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
import { FormSelect } from '@app/components/globals'

const convoOptions = [
  {
    label: 'Group',
    value: 'group'
  },
  {
    label: 'Personal',
    value: 'private'
  }
]

export default function Main() {
  const { height } = useWindowDimensions()
  const profile = JSON.parse(localStorage.getItem('profile'))
  const accountId = profile?.accounts?.data[0]?._id
  const companyId = profile?.accounts?.data[0]?.company?._id
  const [showPendingMessages, setShowPendingMessages] = useState(false)
  const [convoType, setConvoType] = useState('group')
  const [showNewMessageModal, setShowNewMessageModal] = useState(false)
  const [selectedConvo, setSelectedConvo] = useState(null)
  const [search, setSearch] = useState('')
  const [uploadedAttachments, setUploadedAttachments] = useState(null)
  const [attachmentURLs, setAttachmentURLs] = useState([])
  const [isUploadingAttachment, setIsUploadingAttachment] = useState(false)
  const [selectedAccountId, setSelectedAccountId] = useState(null)
  const [conversations, setConversations] = useState(null)
  const [hasFetched, setHasFetched] = useState(false)
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
  const [
    fetchMessages,
    { data: messages, loading: loadingMessages, refetch: refetchMessages }
  ] = useLazyQuery(getMessages)
  const [updateConvo] = useMutation(updateConversation)
  const [sendNewMessage] = useMutation(sendMessage, {
    onCompleted: () => {
      refetchConversations({
        variables: {
          where: {
            participants: [accountId],
            includeEmptyConversation: false,
            pending: showPendingMessages,
            type: convoType
          }
        }
      })
      refetchMessages({
        variables: {
          limit: 10,
          skip: 0,
          where: {
            conversationId: selectedConvo?._id
          }
        }
      })
      setHasFetched(true)
    }
  })
  const [seenNewMessage] = useMutation(seenMessage)

  const firstConvo = useMemo(() => {
    if (convos?.getConversations?.count > 0) {
      return convos?.getConversations?.data[0]
    }
  })

  useEffect(() => {
    if (convos?.getConversations) {
      setConversations(convos.getConversations)
    }
  }, [convos?.getConversations])

  useEffect(() => {
    if (selectedConvo && !hasFetched) {
      if (selectedConvo?.messages?.data[0]?._id) {
        seenNewMessage({
          variables: {
            messageId: selectedConvo.messages.data[0]._id
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
    if (hasFetched) {
      setHasFetched(old => !old)
    }
  }, [selectedConvo])

  const [
    fetchAccounts,
    { data: accounts, loading: loadingAccounts }
  ] = useLazyQuery(getAccounts)

  const [
    createNewConversation,
    {
      data: createdConvo,
      called: calledCreateConvo,
      loading: creatingConversation
    }
  ] = useMutation(createConversation)

  useEffect(() => {
    if (firstConvo && !calledCreateConvo) {
      handleMessagePreviewClick(firstConvo)
    }
  }, [firstConvo, calledCreateConvo])

  useEffect(() => {
    if (createdConvo && calledCreateConvo) {
      const recipient = accounts?.getAccounts?.data?.find(
        account => account.user._id === selectedAccountId
      )

      setConversations(old => ({
        ...old,
        count: old.count + 1,
        data: [
          {
            _id: createdConvo?.createConversation?._id,
            unit: null,
            author: {
              accountType: recipient?.accountType,
              user: { ...recipient?.user }
            },
            participants: {
              data: [
                {
                  user: { ...profile?.user }
                },
                {
                  ...recipient,
                  __typename: 'User'
                }
              ]
            },
            __typename: 'GetAccountsResult'
          },
          ...old.data
        ]
      }))
      // handleMessagePreviewClick({
      //   _id: createdConvo?.createConversation?._id,
      //   unit: null,
      //   participants: {
      //     data: [
      //       {
      //         ...recipient,
      //         user: { ...recipient?.user }
      //       }
      //     ]
      //   }
      // })
      setSelectedAccountId(null)
    }
  }, [createdConvo, calledCreateConvo])

  const convoMessages = messages?.getMessages

  // const dropdownData = [
  //   {
  //     label: 'Group',
  //     icon: null,
  //     function: () => {
  //       setConvoType('group')
  //       localStorage.setItem('convoType', 'group')
  //     }
  //   },
  //   {
  //     label: 'Personal',
  //     icon: null,
  //     function: () => {
  //       setConvoType('private')
  //       localStorage.setItem('convoType', 'private')
  //     }
  //   }
  // ]

  const togglePendingMessages = checked => setShowPendingMessages(checked)

  const handleMessagePreviewClick = convo => {
    setSelectedConvo(convo)
  }

  const handleNewMessageModal = () => setShowNewMessageModal(old => !old)

  const handleAccountClick = userid => {
    setSelectedAccountId(userid)
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
    const response = await axios.post('/', payload, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

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
          {/* <h3 className="text-lg font-bold">Members</h3> */}
          <div className="w-3/4">
            <FormSelect
              options={convoOptions}
              onChange={e => setConvoType(e.target.value)}
            />
          </div>
          <div className="flex items-center">
            {/* <button className={styles.messagesButton}>
              <GoSettings />
            </button> */}
            <button
              className={styles.messagesButton}
              onClick={() => {
                fetchAccounts({
                  variables: {
                    accountTypes: [
                      'company_admin',
                      'complex_admin',
                      'building_admin',
                      'security',
                      'receptionist',
                      'member',
                      'utility'
                    ],
                    companyId,
                    status: 'active'
                  }
                })
                handleNewMessageModal()
              }}
            >
              <FiEdit className="text-orange-600" />
            </button>
            {/* <Dropdown label={<AiOutlineEllipsis />} items={dropdownData} /> */}
          </div>
        </div>
        <div className={styles.pendingToggleContainer}>
          <span>Show only pending &amp; active messages </span>
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
