import { ACCOUNT_TYPES, IMAGES } from '@app/constants'
import { BsCheckAll, BsFillCaretDownFill } from 'react-icons/bs'
import {
  FiFile,
  FiImage,
  FiMoreHorizontal,
  FiPaperclip,
  FiUsers,
  FiX
} from 'react-icons/fi'
import { toFriendlyDateTime, toFriendlyShortDate } from '@app/utils/date'
/* eslint-disable no-useless-escape */
import { useEffect, useMemo, useState } from 'react'

import Dropdown from '@app/components/dropdown'
import { FaSpinner } from 'react-icons/fa'
import InfiniteScroll from 'react-infinite-scroll-component'
import MessageInput from './MessageInput'
import Modal from '@app/components/modal'
import P from 'prop-types'
import ParticipantsBox from './ParticipantsBox'
import ReactHtmlParser from 'react-html-parser'
import Spinner from '@app/components/spinner'
import Tooltip from '@app/components/tooltip'
import getAccountTypeName from '@app/utils/getAccountTypeName'
import { getDefaultKeyBinding } from 'draft-js'
import styles from '../messages.module.css'

const defaultRemoveModalState = {
  type: 'delete',
  visible: false,
  okText: 'Yes, remove from chat',
  title: 'Remove from chat? ',
  participant: null
}
export default function MessageBox({
  endMessageRef,
  participant,
  conversation,
  loading,
  loadingSend,
  currentUserid,
  onSubmitMessage,
  name,
  attachments,
  newMessage,
  onReadNewMessage,
  onFetchMoreMessage,
  loadingAttachment,
  onUpload,
  onRemove,
  removeParticipant,
  parentFunc,
  selectedConvoType
}) {
  const profile = JSON.parse(localStorage.getItem('profile'))
  const [message, setMessage] = useState()
  const [isOver, setIsOver] = useState(false)
  const [disabledSendBtn, setDisabledSendBtn] = useState(true)
  const [removingParticipant, setRemovingParticipant] = useState(false)
  const [showMembers, setShowMembersModal] = useState(false)
  const [removeModalState, setRemoveModalState] = useState(
    defaultRemoveModalState
  )

  const containerClass = isOver
    ? `${styles.uploaderContainer} ${styles.over}`
    : styles.uploaderContainer

  const messages = useMemo(() => {
    if (conversation?.data?.length > 0) {
      return Array.isArray(conversation?.data)
        ? [...conversation?.data]
        : conversation?.data
    }
  }, [conversation])

  const user = useMemo(() => {
    if (participant?.participants?.data?.length === 2) {
      return participant.participants.data.filter(
        item => item?.user?._id !== currentUserid
      )[0]?.user
    } else if (participant?.participants?.data?.length > 1) {
      return participant.participants.data.filter(item =>
        ['member', 'unit_owner', 'resident'].includes(item.accountType)
      )[0]?.user
    }
  }, [participant?.participants])

  const accountType = useMemo(() => {
    if (participant?.participants?.data?.length === 2) {
      return participant.participants.data.filter(
        item => item?.user?._id !== currentUserid
      )[0]
    } else if (participant?.participants?.data?.length > 1) {
      return participant.participants.data.filter(item =>
        ['member', 'unit_owner', 'resident'].includes(item.accountType)
      )[0]
    }
  }, [participant?.participants])

  let convoName = name
  if (!convoName || selectedConvoType === 'private')
    convoName =
      user?.firstName && user?.lastName
        ? `${user?.firstName} ${user?.lastName}`
        : ''

  // NOTE: temporarily removed to align with old UI
  const handleChange = () => {
    document.getElementById('attachment').click()
  }

  const handleDragOver = e => {
    e.preventDefault()
    setIsOver(true)
  }

  const handleDragLeave = () => {
    setIsOver(false)
  }

  const handleOnDrop = e => {
    e.preventDefault()
    setIsOver(false)
    onUpload(e)
  }

  const handleRemove = () => {
    setIsOver(false)
  }

  const getAttachmentSize = file => {
    const size = file.size
    if (size === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    const i = Math.floor(Math.log(size) / Math.log(k))
    return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleEditorChange = messageData => {
    if (messageData) {
      setDisabledSendBtn(false)
    } else {
      setDisabledSendBtn(true)
    }
    setMessage(messageData)
  }

  const handlePressEnter = e => {
    if (e.keyCode === 13) {
      e.preventDefault()
      sendMessage()
      e.target.click()
    } else {
      return getDefaultKeyBinding(e)
    }
  }

  const sendMessage = () => {
    if (!disabledSendBtn && message) {
      onSubmitMessage(message)
      setMessage(null)
      setDisabledSendBtn(true)
    }
  }

  const dropdownData = [
    {
      label: 'Members',
      icon: <FiUsers />,
      function: () => setShowMembersModal(prev => !prev)
    }
  ]

  const closeRemoveModal = () => {
    setRemoveModalState({
      ...removeModalState,
      visible: false
    })
  }

  useEffect(() => {
    parentFunc.current = closeRemoveModal
  }, [])

  return (
    <div className={styles.messagesBoxContainer}>
      <div className={styles.messageBoxHeader}>
        <h2 className="font-bold text text-base capitalize">
          {convoName || '-'}
        </h2>
        <Dropdown label={<FiMoreHorizontal />} items={dropdownData} />
      </div>
      <div className={styles.messageBoxList}>
        {loading ? <Spinner /> : null}
        {messages?.length > 0 && (
          <div
            className="scrollableContainer"
            id="scrollableDiv"
            style={{
              height: '100%',
              overflow: 'auto',
              display: 'flex',
              flexDirection: 'column-reverse'
            }}
          >
            <InfiniteScroll
              dataLength={messages?.length || 0}
              next={onFetchMoreMessage}
              style={{ display: 'flex', flexDirection: 'column-reverse' }}
              inverse={true}
              hasMore={messages?.length < conversation?.count}
              loader={<Spinner />}
              scrollableTarget="scrollableDiv"
              endMessage={
                <p className="font-semibold text-center text-neutral-500">
                  {`- - - End of message - - -`}
                </p>
              }
            >
              <span ref={endMessageRef}></span>
              {messages?.map((item, index) => {
                const author = item?.author?.user
                const authorName = `${author?.firstName} ${author?.lastName}`
                const accountType = getAccountTypeName(
                  item?.author?.accountType
                )
                const isCurrentUserMessage = author?._id === currentUserid
                const defaultAvatarUri = `https://ui-avatars.com/api/?name=${authorName}&size=32`
                const isLastMessage = index === 0
                const isSameAuthor =
                  messages[index + 1]?.author.user._id !== author._id
                let moreViewers = 0

                return (
                  <div
                    key={item._id}
                    className={`${
                      isCurrentUserMessage ? 'self-end ' : 'self-start '
                    }w-8/12 mt-2 mr-6`}
                  >
                    {isSameAuthor ? (
                      <div
                        className={`capitalize flex items-center ${
                          isCurrentUserMessage
                            ? 'justify-end '
                            : 'flex-row-reverse justify-end '
                        }`}
                      >
                        <span className="block">{`${accountType} - ${authorName}`}</span>
                        <img
                          src={
                            author?.avatar && author?.avatar !== ''
                              ? author?.avatar
                              : defaultAvatarUri
                          }
                          alt={authorName}
                          className={`${
                            isCurrentUserMessage ? 'ml-4 ' : 'mr-4 '
                          }rounded-full h-8 w-8`}
                        />
                      </div>
                    ) : null}
                    <div
                      className={`${
                        isCurrentUserMessage
                          ? 'bg-primary-500 text-white '
                          : 'bg-white float-right '
                      }py-3 px-4 border-none w-11/12 rounded shadow-none h-auto relative`}
                    >
                      <p className="font-sm break-all">
                        {item?.message ? ReactHtmlParser(item.message) : ''}
                      </p>
                      <div className="flex items-center justify-end w-full text-right">
                        <span
                          className={`${styles.messageDateStamp} ${
                            isCurrentUserMessage
                              ? 'text-white'
                              : 'text-neutral-500'
                          }`}
                        >
                          <Tooltip
                            text={toFriendlyDateTime(item.createdAt)}
                            effect="solid"
                          >
                            <span className={styles.updateDate}>
                              {toFriendlyShortDate(item.createdAt)}
                            </span>
                          </Tooltip>
                        </span>
                        {isCurrentUserMessage &&
                        (item.status === 'seen' || item.viewers.count > 0) ? (
                          <div className="ml-2">
                            <BsCheckAll className="w-5 h-5" />
                          </div>
                        ) : null}
                      </div>
                      {isLastMessage &&
                      (item.status === 'seen' || item.viewers.count > 0) ? (
                        <div className="w-full flex items-center justify-end mt-2">
                          {item.viewers.data.map((v, index) => {
                            if (index >= 4) {
                              moreViewers++
                            } else {
                              const viewerName = `${v?.user?.firstName} ${v?.user?.lastName}`
                              if (v?.user?._id !== currentUserid) {
                                const img =
                                  v?.user?.avatar && v?.user?.avatar !== ''
                                    ? v?.user?.avatar
                                    : accountType ===
                                      ACCOUNT_TYPES.COMPYAD.value
                                    ? IMAGES.COMPANY_AVATAR
                                    : accountType ===
                                      ACCOUNT_TYPES.COMPXAD.value
                                    ? IMAGES.COMPLEX_AVATAR
                                    : IMAGES.DEFAULT_AVATAR

                                return (
                                  <span className="capitalize">
                                    <Tooltip
                                      key={v?._id}
                                      text={viewerName.toLowerCase()}
                                      effect="solid"
                                    >
                                      <img
                                        src={
                                          v?.user?.avatar &&
                                          v?.user?.avatar !== ''
                                            ? v?.user?.avatar
                                            : img
                                        }
                                        alt="viewer-avatar"
                                        className={styles.viewerAvatar}
                                      />
                                    </Tooltip>
                                  </span>
                                )
                              }
                            }
                            return null
                          })}

                          {moreViewers > 0 && (
                            <span className="capitalize">
                              <Tooltip
                                text={`${moreViewers} more viewer${
                                  moreViewers > 1 ? 's' : ''
                                }`}
                                effect="solid"
                              >
                                <span
                                  className={`${styles.viewerBadge} ${
                                    isCurrentUserMessage
                                      ? styles.viewerBadgeRight
                                      : styles.viewerBadgeLeft
                                  }`}
                                >
                                  +{moreViewers}
                                </span>
                              </Tooltip>
                            </span>
                          )}
                        </div>
                      ) : null}

                      {item.attachments && item.attachments.length > 0 ? (
                        <div className="w-full flex items-center justify-end mt-2">
                          {item.attachments.map(attch => {
                            if (
                              attch?.type.includes('jpg') ||
                              attch?.type.includes('jpeg') ||
                              attch?.type.includes('png')
                            )
                              return <FiImage className="w-16 h-24" />
                            if (
                              attch?.type.includes('pdf') ||
                              attch?.type.includes('doc') ||
                              attch?.type.includes('docx')
                            )
                              return <FiFile className="w-16 h-24" />

                            return null
                          })}
                        </div>
                      ) : null}
                    </div>
                  </div>
                )
              })}
            </InfiniteScroll>
          </div>
        )}
        {!loading && messages?.length === 0 && (
          <div className="w-full h-full flex items-center justify-center">
            <p>No messages found.</p>
          </div>
        )}
      </div>

      {/* NOTE: temporarily removed to align with old UI */}
      {attachments?.length ? (
        <div className={styles.messageAttachmentsContainer}>
          {attachments.map((attachment, index) => (
            <div className={styles.messageAttachment} key={index}>
              {attachment.filename && (
                <div className={styles.messageAttachmentName}>
                  {attachment.filename}
                </div>
              )}
              <div className="font-normal text-neutral-600">
                ({getAttachmentSize(attachment)})
              </div>
              <button
                title="Remove attachment"
                className={styles.uploaderButton}
                data-name={attachment?.filename}
                data-id={attachment.url}
                onClick={e => {
                  handleRemove()
                  onRemove(e)
                }}
              >
                <FiX
                  className="ciergio-close"
                  data-name={attachment?.filename}
                  data-id={attachment.url}
                />
              </button>
            </div>
          ))}
        </div>
      ) : null}

      <div className="-mt-2">
        <div className={styles.messageBoxInput}>
          {!loading && messages?.length > 0 && newMessage && (
            <button
              className={styles.messageBoxNotif}
              onClick={onReadNewMessage}
            >
              <span className="mr-2">New Message Received</span>
              <BsFillCaretDownFill />
            </button>
          )}

          {/* NOTE: temporarily removed to align with old UI */}
          <div className="flex flex-none w-14 items-center justify-items-center justify-center">
            <img
              src={
                profile?.avatar && profile?.avatar !== ''
                  ? profile?.avatar
                  : `https://ui-avatars.com/api/?name=${`${profile?.firstName} ${profile?.lastName}`}&size=32`
              }
              alt="avatar"
              className="rounded-full w-10"
            />
          </div>

          <div className="flex-auto p-2 flex items-center w-full">
            <MessageInput
              editorClassName="pl-0 pr-16"
              placeholder="Write a message"
              onChange={handleEditorChange}
              onPressEnter={handlePressEnter}
              message={message}
            />
            {/* <button
              className={`absolute right-4 bottom-9 px-4 flex items-center text-lg font-bold cursor-pointer ${
                disabledSendBtn ? 'text-neutral-400' : 'text-primary-500'
              }`}
              onClick={sendMessage}
              disabled={disabledSendBtn || loadingSend}
            >
              <span className="flex items-center">
                {loadingSend && <FaSpinner className="icon-spin mr-2" />} Send
              </span>
            </button> */}
          </div>

          {/* NOTE: temporarily removed to align with old UI */}
          <div className="flex flex-none w-32 items-center justify-items-center justify-center">
            <div className={containerClass}>
              <input
                type="file"
                id="attachment"
                name="attachment"
                multiple
                onChange={onUpload}
                accept="image/jpg, image/jpeg, image/png, .pdf, .doc, .docx"
                disabled={!conversation}
                className={`hidden ${
                  !conversation ? 'cursor-not-allowed' : ''
                }`}
              />
              <div
                className="flex gap-4"
                role="button"
                tabIndex={0}
                onKeyDown={() => {}}
                onClick={handleChange}
                onDrop={handleOnDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                {loading || loadingAttachment ? (
                  <FaSpinner className="w-5 h-5 icon-spin" />
                ) : (
                  <>
                    <FiImage className="w-5 h-5 cursor-pointer" />
                    <FiPaperclip className="w-5 h-5 cursor-pointer" />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        title="Members"
        visible={showMembers}
        onClose={() => setShowMembersModal(prev => !prev)}
        footer={null}
      >
        {/* {modalContent} */}
        {participant?.participants?.data?.map((item, index) => {
          return (
            <ParticipantsBox
              key={index}
              data={item}
              sameUser={profile._id === item?.user?._id}
              modalTrigger={() => {
                setRemovingParticipant(false)
                setRemoveModalState({
                  ...removeModalState,
                  visible: true,
                  participant: item
                })
              }}
            />
          )
        })}
      </Modal>

      <Modal
        title={removeModalState.title}
        onClose={closeRemoveModal}
        okText={removeModalState.okText}
        okButtonProps={{
          danger: removeModalState.type === 'delete',
          disabled: removingParticipant
        }}
        cancelButtonProps={{
          disabled: removingParticipant
        }}
        visible={removeModalState.visible}
        onOk={async () => {
          setRemovingParticipant(true)
          removeParticipant(removeModalState.participant._id)
        }}
        onCancel={closeRemoveModal}
      >
        <p>
          Are you sure you want to remove{' '}
          <strong>
            {removeModalState?.participant?.user?.firstName}{' '}
            {removeModalState?.participant?.user?.lastName}
          </strong>{' '}
          from the conversation? They will no longer be able to view the group
          chat, or send and receive messages.
        </p>
      </Modal>
    </div>
  )
}

MessageBox.propTypes = {
  name: P.string,
  endMessageRef: P.any,
  participant: P.object,
  conversation: P.object,
  loading: P.bool,
  loadingSend: P.bool,
  loadingAttachment: P.bool,
  currentUserid: P.string,
  onSubmitMessage: P.func,
  attachmentURLs: P.array,
  onUpload: P.func,
  onRemove: P.func,
  attachments: P.array,
  newMessage: P.bool,
  onReadNewMessage: P.func,
  onFetchMoreMessage: P.func,
  removeParticipant: P.func,
  parentFunc: P.any,
  selectedConvoType: P.string
}
