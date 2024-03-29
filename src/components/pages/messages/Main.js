import {
  GET_UNREAD_MESSAGE_QUERY,
  createConversation,
  getAccounts,
  getConversations,
  getMessages,
  seenMessage,
  sendMessage,
  updateConversation,
  REMOVE_CONVERSATION_PARTICIPANT
} from './queries'
import { useContext, useEffect, useRef, useState } from 'react'
import { useLazyQuery, useMutation, useQuery } from '@apollo/client'

import { ACCOUNT_TYPES } from '@app/constants'
import { Context } from '@app/lib/global/MsgContext/store'
import ConversationBox from './components/ConversationBox'
import { FiEdit } from 'react-icons/fi'
import FormSelect from '@app/components/forms/form-select'
import MessageBox from './components/MessageBox'
import NewMessageModal from './components/NewMessageModal'
import Toggle from '@app/components/toggle'
import axios from '@app/utils/axios'
import showToast from '@app/utils/toast'
import styles from './messages.module.css'
import { uniqBy } from 'lodash'
import useDebounce from '@app/utils/useDebounce'
import { useRouter } from 'next/router'

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
  const messageBoxFunc = useRef(null)
  const profile = JSON.parse(localStorage.getItem('profile'))
  const accountType = profile?.accounts?.data[0]?.accountType
  const accountId = profile?.accounts?.data[0]?._id
  const companyId = profile?.accounts?.data[0]?.company?._id
  const [showPendingMessages, setShowPendingMessages] = useState(false)
  const [convoType, setConvoType] = useState(
    localStorage.getItem('convotype') ?? 'group'
  )
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
  const [firstConvo, setFirstConvo] = useState()
  const [isFirst, setIsFirst] = useState(true)
  const [isSelected, setIsSelected] = useState(false)
  const [reFetchParticipants, setReFetchParticipants] = useState(false)
  const maxAttachments = 5
  // const debouncedSearch = useDebounce(search, 500)

  const router = useRouter()
  const { id: convoID } = router.query
  const [state, dispatch] = useContext(Context)
  const newMsg = state.newMsg

  const doFetchAccounts = search => {
    const where = {
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
    if (search) where.search = search
    fetchAccounts({
      variables: {
        where,
        limit: 10
      }
    })
  }

  useEffect(() => {
    if (search) doFetchAccounts(search)
  }, [search])

  const {
    data: convos,
    loading: loadingConvo,
    refetch: refetchConversations
  } = useQuery(getConversations, {
    fetchPolicy: 'network-only',
    variables: {
      where: {
        participants: [accountId],
        includeEmptyConversation: true,
        pending: showPendingMessages,
        type: convoType,
        active: true
      },
      limit: 15,
      skip: offsetConvo
    }
  })

  const [
    getConvoSelected,
    { data: dataSelectedConvo, loading: loadingSelectedConvo }
  ] = useLazyQuery(getConversations, {
    fetchPolicy: 'network-only'
  })

  const [
    fetchMessages,
    { data: messages, loading: loadingMessages, refetch: refetchMessages }
  ] = useLazyQuery(getMessages, {
    fetchPolicy: 'network-only'
  })

  const [updateConvo] = useMutation(updateConversation)

  const [sendNewMessage, { loading: loadingSendMessage }] = useMutation(
    sendMessage,
    {
      onCompleted: ({ createMessage }) => {
        seenNewMessage({
          variables: {
            messageId: createMessage?._id
          }
        })
        refetchMessages()
        setHasFetched(true)
        setUploadedAttachments(null)
        setAttachmentURLs([])
      },
      onError: e => {
        errorHandler(e)
      }
    }
  )

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

  const [removeConversationParticipant] = useMutation(
    REMOVE_CONVERSATION_PARTICIPANT,
    {
      onCompleted: () => {
        refetchConversations({
          skip: 0
        })
        // refetchMessages({
        //   skip: 0
        // })
        setReFetchParticipants(true)
      },
      onError: e => {
        errorHandler(e)
      }
    }
  )

  const removeParticipant = participantId => {
    if (!convoID || !participantId) return

    removeConversationParticipant({
      variables: {
        participantId: participantId,
        conversationId: convoID
      }
    })
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!loadingSelectedConvo && dataSelectedConvo && !isSelected) {
        const index = conversations?.data.findIndex(convo => {
          return convo._id === dataSelectedConvo?.getConversations?.data[0]?._id
        })
        const isExist = index !== -1

        if (isExist) {
          handleMessagePreviewClick(conversations?.data[index])
        } else {
          if (dataSelectedConvo?.getConversations?.data?.length > 0) {
            onCreateConvo(dataSelectedConvo?.getConversations?.data[0])
          } else {
            createNewConversation({
              variables: {
                data: {
                  type: convoType,
                  participants: [accountId, selectedAccountId]
                }
              }
            })
          }
        }
        setIsSelected(true)
        handleCloseNewMessageModal()
      }
      clearInterval(timer)
    }, 500)
  }, [dataSelectedConvo, loadingSelectedConvo, isSelected])

  useEffect(() => {
    if (convos?.getConversations?.count > 0 && isFirst) {
      const convoFilter = convos?.getConversations?.data.find(
        item => item.selected === true
      )
      const convoFirst = convos?.getConversations?.data[0]

      setFirstConvo(convoFilter || convoFirst)
      setIsFirst(false)
    }
  }, [convos])

  useEffect(() => {
    if (convos?.getConversations) {
      if (!reFetchParticipants) {
        if (
          conversations?.data &&
          conversations?.data[0]?._id !==
            convos?.getConversations?.data[0]?._id &&
          !hasFetched
        ) {
          setConversations(prev => ({
            ...prev,
            data: uniqBy(
              conversations?.data.concat(convos?.getConversations?.data),
              '_id'
            )
          }))
        } else {
          setConversations(convos.getConversations)
        }
      } else {
        if (selectedConvo && convoID) {
          const updatedConvo = convos.getConversations.data.filter(
            i => i._id === convoID
          )
          if (updatedConvo[0]) {
            messageBoxFunc.current()
            showToast(
              'success',
              `Successfully remove a participant from the group chat`
            )
            setSelectedConvo(updatedConvo[0])
            setReFetchParticipants(false)
          } else {
            refetchConversations({
              skip: 0
            })
          }
        }
      }
    }
  }, [convos?.getConversations, hasFetched])

  useEffect(() => {
    if (messages) {
      if (!reFetchParticipants) {
        if (
          selectedConvo &&
          convoMessages?.data &&
          convoMessages?.data[0]?.conversation?._id === selectedConvo._id &&
          !hasFetched
        ) {
          if (messages?.getMessages?.data.length !== convoMessages?.data.length)
            setConvoMessages(prev => ({
              ...prev,
              data: [
                ...new Set(
                  convoMessages?.data.concat(messages?.getMessages?.data)
                )
              ]
            }))
        } else {
          setConvoMessages(messages?.getMessages)
        }
      } else {
        // setReFetchParticipants(false)
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
            conversationId: convoID || selectedConvo?._id
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
      onCreateConvo(createdConvo?.createConversation, 'new')
    }
  }, [createdConvo, calledCreateConvo])

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
    setOffsetConvo(0)
    setConvoMessages({})
    setSelectedConvo(null)
    setIsFirst(true)
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

  const handleCloseNewMessageModal = () => {
    setSearch('')
    setShowNewMessageModal(false)
  }

  const handleAccountClick = (userid, admins) => {
    setSelectedAccountId(userid)
    setIsSelected(false)

    const isAdmin =
      (admins?.filter(item => item?._id === userid) ?? [])?.length > 0

    getConvoSelected({
      variables: {
        where: {
          participants: [accountId, userid],
          type: convoType,
          exactParticipants: isAdmin
        },
        limit: 1,
        skip: 0
      }
    })
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
    if (!text || text.length == 0) {
      doFetchAccounts()
    }
  }

  const uploadApi = async payload => {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        'company-id':
          accountType === ACCOUNT_TYPES.SUP.value ? 'oci' : companyId
      }
    }

    const response = await axios.post(
      process.env.NEXT_PUBLIC_UPLOAD_API,
      payload,
      config
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

      setUploadedAttachments(old => (old ? [...old, ...data] : [...data]))
    }
    setIsUploadingAttachment(false)
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

    setIsUploadingAttachment(true)
    if (files) {
      if (files.length > maxAttachments) {
        setIsUploadingAttachment(false)
        showToast('info', `Maximum of ${maxAttachments} attachments only`)
      } else {
        for (const file of files) {
          const reader = new FileReader()

          reader.onloadend = () => {
            setAttachmentURLs(imageUrls => [...imageUrls, reader.result])
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
    setConvoMessages({})
    setSelectedConvo(null)
    setIsFirst(true)
    setConvoType(e.value)
    localStorage.setItem('convotype', e.value)
  }

  const onCreateConvo = (data, type) => {
    const recipient = accounts?.getAccounts?.data?.find(
      account => account._id === selectedAccountId
    )

    setConversations(old => ({
      ...old,
      count: old.count + 1,
      data: [
        type === 'new'
          ? {
              _id: data?._id,
              unit: null,
              author: {
                accountType: profile?.accounts?.data[0].accountType,
                user: { ...profile?.accounts?.data[0].user }
              },
              participants: {
                data: [
                  {
                    accountType: profile?.accounts?.data[0].accountType,
                    user: { ...profile?.accounts?.data[0].user }
                  },
                  {
                    ...recipient
                  }
                ]
              }
            }
          : data,
        ...old.data
      ]
    }))
    setSelectedAccountId(null)
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
          <div className="w-3/4 mt-4">
            <FormSelect
              options={convoOptions}
              onChange={onSelectConvoType}
              defaultValue={convoOptions.filter(
                item => item.value === convoType
              )}
            />
          </div>
          <div className="flex items-center">
            <button
              className={styles.messagesButton}
              onClick={() => {
                doFetchAccounts()
                handleNewMessageModal()
              }}
            >
              <FiEdit className="text-orange-600" />
            </button>
          </div>
        </div>
        <div className={styles.pendingToggleContainer}>
          <span>Show only pending &amp; active messages </span>
          <Toggle onChange={togglePendingMessages} />
        </div>
        <div className={styles.messagesListItems}>
          <ConversationBox
            conversations={conversations}
            loading={loadingConvo}
            selectedConvoType={convoType}
            selectedConvo={selectedConvo?._id}
            currentUserId={profile?._id}
            currentAccountId={profile?.accounts?.data[0]._id}
            newMessage={newMsg || messageData}
            onFetchMore={onFetchMoreConversations}
            onConvoSelect={handleMessagePreviewClick}
          />
        </div>
      </div>
      <MessageBox
        parentFunc={messageBoxFunc}
        endMessageRef={endMessage}
        participant={selectedConvo}
        name={selectedConvo?.name}
        conversation={selectedConvo ? convoMessages : {}}
        loading={loadingMessages}
        loadingSend={loadingSendMessage}
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
        removeParticipant={removeParticipant}
        selectedConvoType={convoType}
      />
      <NewMessageModal
        visible={showNewMessageModal}
        onCancel={handleCloseNewMessageModal}
        onSelectUser={handleAccountClick}
        loadingUsers={loadingAccounts}
        users={accounts?.getAccounts?.data || []}
        accountId={accountId}
        onSearchChange={handleSearchAccounts}
        searchText={search}
      />
    </div>
  )
}
