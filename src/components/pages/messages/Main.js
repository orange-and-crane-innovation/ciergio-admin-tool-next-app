import { useState, useEffect, useMemo, useContext, useRef } from 'react'
import { useQuery, useLazyQuery, useMutation } from '@apollo/client'
import { FiEdit } from 'react-icons/fi'

import InfiniteScroll from 'react-infinite-scroll-component'

import Toggle from '@app/components/toggle'
import Spinner from '@app/components/spinner'

import useWindowDimensions from '@app/utils/useWindowDimensions'
import axios from '@app/utils/axios'
import showToast from '@app/utils/toast'
import useDebounce from '@app/utils/useDebounce'

import MessagePreviewItem from './components/MessagePreviewItem'
import MessageBox from './components/MessageBox'
import NewMessageModal from './components/NewMessageModal'

import styles from './messages.module.css'

import {
  createConversation,
  getMessages,
  getAccounts,
  getConversations,
  sendMessage,
  updateConversation,
  seenMessage,
  GET_UNREAD_MESSAGE_QUERY
} from './queries'
import { FormSelect } from '@app/components/globals'

import { useRouter } from 'next/router'

import { Context } from '@app/lib/global/store'

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
  const endMessage = useRef()
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
  const [conversations, setConversations] = useState({})
  const [convoMessages, setConvoMessages] = useState({})
  const [hasFetched, setHasFetched] = useState(false)
  const [offset, setOffset] = useState(0)
  const [offsetConvo, setOffsetConvo] = useState(0)
  const [messageData, setMessageData] = useState()
  const maxAttachments = 5
  const debouncedSearch = useDebounce(search, 500)

  const router = useRouter()
  const { convoID } = router.query
  const [state, dispatch] = useContext(Context)
  const newMsg = state.newMsg

  useEffect(() => {
    fetchAccounts({
      variables: {
        where: {
          accountTypes: [
            'company_admin',
            'complex_admin',
            'building_admin',
            'receptionist',
            'unit_owner',
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
      },
      limit: 10,
      skip: offsetConvo
    }
  })
  const [
    fetchMessages,
    { data: messages, loading: loadingMessages, refetch: refetchMessages }
  ] = useLazyQuery(getMessages, {
    fetchPolicy: 'network-only'
  })
  const [updateConvo] = useMutation(updateConversation)
  const [sendNewMessage] = useMutation(sendMessage, {
    onCompleted: ({ createMessage }) => {
      seenNewMessage({
        variables: {
          messageId: createMessage?._id
        }
      })
      refetchMessages()
      setHasFetched(true)
    },
    onError: e => {
      errorHandler(e)
    }
  })
  const [seenNewMessage, { data: dataSeenMessage }] = useMutation(seenMessage)

  const [
    fetchUnreadMessage,
    { loading: loadingUnreadMessage, data: dataUnreadMessage }
  ] = useLazyQuery(GET_UNREAD_MESSAGE_QUERY, {
    enabled: false,
    fetchPolicy: 'network-only',
    variables: {
      accountId
    }
  })

  const firstConvo = useMemo(() => {
    if (convos?.getConversations?.count > 0) {
      return convos?.getConversations?.data[0]
    }
  })

  useEffect(() => {
    if (convos?.getConversations) {
      if (
        conversations?.data &&
        conversations?.data[0]?._id !==
          convos?.getConversations?.data[0]?._id &&
        !hasFetched
      ) {
        setConversations(prev => ({
          ...prev,
          data: [
            ...new Set(
              conversations?.data.concat(convos?.getConversations?.data)
            )
          ]
        }))
      } else {
        setConversations(convos.getConversations)
      }
    }
  }, [convos?.getConversations])

  useEffect(() => {
    if (messages) {
      if (
        convoMessages?.data &&
        convoMessages?.data[0]?.conversation?._id === selectedConvo._id &&
        !hasFetched
      ) {
        setConvoMessages(prev => ({
          ...prev,
          data: [
            ...new Set(convoMessages?.data.concat(messages?.getMessages?.data))
          ]
        }))
      } else {
        setConvoMessages(messages?.getMessages)
      }
    }
  }, [messages])

  useEffect(() => {
    if (newMsg && selectedConvo) {
      if (newMsg?.conversation?._id === selectedConvo._id) {
        setConvoMessages(prev => ({
          ...prev,
          data: [newMsg, ...prev?.data]
        }))
      }
    }
  }, [newMsg])

  useEffect(() => {
    if (dataSeenMessage) {
      if (dataSeenMessage?.seenMessage?.message === 'success') {
        fetchUnreadMessage()
      }
    }
  }, [dataSeenMessage])

  useEffect(() => {
    if ((selectedConvo && !hasFetched) || convoID) {
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
          convoId: convoID || selectedConvo?._id
        }
      })
    }
    if (hasFetched) {
      setHasFetched(old => !old)
    }
  }, [selectedConvo, convoID])

  const [
    fetchAccounts,
    { data: accounts, loading: loadingAccounts }
  ] = useLazyQuery(getAccounts)

  const [
    createNewConversation,
    { data: createdConvo, called: calledCreateConvo }
  ] = useMutation(createConversation)

  useEffect(() => {
    if (firstConvo && !calledCreateConvo) {
      handleMessagePreviewClick(firstConvo)
    }
  }, [firstConvo, calledCreateConvo])

  useEffect(() => {
    if (createdConvo && calledCreateConvo) {
      const recipient = accounts?.getAccounts?.data?.find(
        account => account._id === selectedAccountId
      )

      setConversations(old => ({
        ...old,
        count: old.count + 1,
        data: [
          {
            _id: createdConvo?.createConversation?._id,
            unit: null,
            author: {
              accountType: profile?.accountType,
              user: { ...profile?.accounts?.data[0].user }
            },
            participants: {
              data: [
                {
                  accountType: profile?.accountType,
                  user: { ...profile?.accounts?.data[0].user }
                },
                {
                  ...recipient
                }
              ]
            }
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

  useEffect(() => {
    if (!loadingUnreadMessage) {
      if (dataUnreadMessage) {
        const unreadMsg = dataUnreadMessage?.getUnreadConversationCount
        dispatch({ type: 'UPDATE_UNREAD_MSG', payload: unreadMsg })
      }
    }
  }, [loadingUnreadMessage, dataUnreadMessage])

  const togglePendingMessages = checked => {
    setConversations({})
    setShowPendingMessages(checked)
  }

  const handleMessagePreviewClick = convo => {
    if (!hasFetched) {
      setConvoMessages({})
    }
    setOffset(0)
    setSelectedConvo(convo)
    router.push(`/messages/${convo._id}`)
  }

  const handleNewMessageModal = () => setShowNewMessageModal(old => !old)

  const handleAccountClick = userid => {
    setSelectedAccountId(userid)
    if (conversations?.data?.length > 0) {
      const index = conversations?.data.findIndex(convo => {
        return convo.participants.data[1]._id === userid
      })
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
          participants: [accountId, userid]
        }
      }
    })
    handleNewMessageModal()
  }

  const handleSubmitMessage = message => {
    setMessageData({
      author: {
        accountType: profile?.accountType,
        user: profile?.accounts?.data[0]?.user
      },
      conversation: {
        _id: selectedConvo?._id
      },
      message,
      status: 'seen',
      viewers: {
        data: [{ user: profile?.accounts?.data[0]?.user }]
      }
    })
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

  const onReadNewMessage = () => {
    const messageID = convoMessages?.data[0]?._id
    if (messageID) {
      seenNewMessage({
        variables: {
          messageId: messageID
        }
      })
    }
    dispatch({ type: 'UPDATE_NEW_MSG', payload: null })
    endMessage.current.scrollIntoView({ behavior: 'smooth' })
  }

  const onFetchMoreMessage = () => {
    if (
      convoMessages?.data &&
      convoMessages?.data[0]?.conversation?._id === selectedConvo._id
    ) {
      setOffset(prev => prev + 10)
    } else {
      setOffset(0)
    }

    fetchMessages({
      variables: {
        limit: 10,
        skip: offset + 10,
        where: {
          conversationId: selectedConvo?._id
        }
      }
    })
  }

  const onFetchMoreConversations = () => {
    setOffsetConvo(prev => prev + 10)

    refetchConversations()
  }

  const onSelectConvoType = e => {
    setConversations({})
    setOffsetConvo(0)
    setConvoType(e.target.value)
  }

  const errorHandler = data => {
    const errors = JSON.parse(JSON.stringify(data))

    if (errors) {
      const { graphQLErrors, networkError, message } = errors
      if (graphQLErrors)
        graphQLErrors.map(({ message, locations, path }) =>
          showToast('danger', message)
        )

      if (networkError?.result?.errors) {
        showToast('danger', errors?.networkError?.result?.errors[0]?.message)
      }

      if (
        message &&
        graphQLErrors?.length === 0 &&
        !networkError?.result?.errors
      ) {
        showToast('danger', message)
      }
    }
  }

  return (
    <div className={styles.messagesContainer}>
      <div className={styles.messagesListContainer}>
        <div className={styles.messagesListHeader}>
          {/* <h3 className="text-lg font-bold">Members</h3> */}
          <div className="w-3/4">
            <FormSelect options={convoOptions} onChange={onSelectConvoType} />
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
                      'receptionist',
                      'unit_owner',
                      'resident',
                      'member'
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
        <div className={styles.messagesListItems}>
          {conversations?.count > 0 ? (
            <div
              id="scrollableConvo"
              style={{
                height: '100%',
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <InfiniteScroll
                dataLength={conversations?.data?.length || 0}
                next={onFetchMoreConversations}
                hasMore={conversations?.data?.length < conversations?.count}
                loader={<Spinner />}
                scrollableTarget="scrollableConvo"
              >
                {conversations.data.map(convo => (
                  <MessagePreviewItem
                    key={convo._id}
                    onClick={handleMessagePreviewClick}
                    data={convo}
                    isSelected={selectedConvo?._id === convo._id}
                    currentUserid={profile?._id}
                    convoId={convo._id}
                    newMessage={newMsg || messageData}
                  />
                ))}
              </InfiniteScroll>
            </div>
          ) : loadingConvo ? (
            <Spinner />
          ) : conversations?.count === 0 ? (
            <div className="h-full flex items-center justify-center">
              <p>No conversations found.</p>
            </div>
          ) : null}
        </div>
      </div>
      <MessageBox
        endMessageRef={endMessage}
        participant={selectedConvo}
        conversation={convoMessages}
        loading={loadingMessages}
        onSubmitMessage={handleSubmitMessage}
        currentUserid={profile?._id}
        onUpload={onUploadAttachment}
        onRemove={onRemoveAttachment}
        loadingAttachment={isUploadingAttachment}
        attachments={uploadedAttachments}
        attachmentURLs={attachmentURLs}
        newMessage={newMsg?.conversation?._id === selectedConvo?._id}
        onReadNewMessage={onReadNewMessage}
        onFetchMoreMessage={onFetchMoreMessage}
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
    </div>
  )
}
