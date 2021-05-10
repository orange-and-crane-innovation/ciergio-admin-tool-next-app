/* eslint-disable no-useless-escape */
import { useState, useMemo } from 'react'
import P from 'prop-types'
import { getDefaultKeyBinding, EditorState, convertToRaw } from 'draft-js'
import { draftjsToMd } from 'draftjs-md-converter'
import ReactHtmlParser from 'react-html-parser'
import { BsCheckAll, BsFillCaretDownFill } from 'react-icons/bs'
import InfiniteScroll from 'react-infinite-scroll-component'

import Spinner from '@app/components/spinner'
import Tooltip from '@app/components/tooltip'

import { toFriendlyShortDate, toFriendlyDateTime } from '@app/utils/date'
import getAccountTypeName from '@app/utils/getAccountTypeName'

import { ACCOUNT_TYPES, IMAGES } from '@app/constants'

import MessageInput from './MessageInput'

import styles from '../messages.module.css'

export default function MessageBox({
  endMessageRef,
  participant,
  conversation,
  loading,
  currentUserid,
  onSubmitMessage,
  // attachments,
  newMessage,
  onReadNewMessage,
  onFetchMoreMessage
  // onUpload,
  // onRemove
}) {
  const [editorState, setEditorState] = useState(EditorState.createEmpty())
  const [message, setMessage] = useState(undefined)
  const [disabledSendBtn, setDisabledSendBtn] = useState(true)

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
      )[0]?.accountType
    } else if (participant?.participants?.data?.length > 1) {
      return participant.participants.data.filter(item =>
        ['member', 'unit_owner', 'resident'].includes(item.accountType)
      )[0]?.accountType
    }
  }, [participant?.participants])

  const name =
    user?.firstName && user?.lastName
      ? `${getAccountTypeName(accountType)} - ${user?.firstName} ${
          user?.lastName
        }`
      : ''

  // NOTE: temporarily removed to align with old UI
  // const handleChange = () => {
  //   document.getElementById('attachment').click()
  // }
  // const handleDragOver = e => {
  //   e.preventDefault()
  //   setIsOver(true)
  // }
  // const handleDragLeave = () => {
  //   setIsOver(false)
  // }
  // const handleOnDrop = e => {
  //   e.preventDefault()
  //   setIsOver(false)
  //   onUpload(e)
  // }
  // const handleRemove = () => {
  //   setIsOver(false)
  // }
  // const getAttachmentSize = file => {
  //   const size = file.size
  //   if (size === 0) return '0 Bytes'
  //   const k = 1024
  //   const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  //   const i = Math.floor(Math.log(size) / Math.log(k))
  //   return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  // }

  const handleEditorChange = messageData => {
    const message = messageData.getCurrentContent()
    const rawMessage = convertToRaw(message)
    const clearText = rawMessage?.blocks[0]?.text
    const cleanData = draftjsToMd(rawMessage)
      .replace(/(&nbsp;)+/g, '')
      .replace(/\ \ +/g, ' ')
      .replace(/\\s+/g, ' ')
      .trim()

    if (clearText) {
      setDisabledSendBtn(false)
    } else {
      setDisabledSendBtn(true)
    }
    setEditorState(messageData)
    setMessage(cleanData)
  }

  const handlePressEnter = e => {
    if (e.keyCode === 13) {
      if (!disabledSendBtn) {
        onSubmitMessage(message)
        setEditorState(EditorState.createEmpty())
      }
      e.preventDefault()
    } else {
      return getDefaultKeyBinding(e)
    }
  }

  const sendMessage = () => {
    onSubmitMessage(message)
    setEditorState(EditorState.createEmpty())
  }
  return (
    <div className={styles.messagesBoxContainer}>
      <div className={styles.messageBoxHeader}>
        <h2 className="font-bold text text-base">{name || ''}</h2>
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
                          src={author?.avatar || defaultAvatarUri}
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
                        {ReactHtmlParser(
                          item.message
                            .replace(/\n/gi, '\n <br />')
                            .replace(/\t/gi, '\n &emsp;')
                        )}
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
                                        src={v?.user?.avatar ?? img}
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
      {/* {attachments?.length ? (
        <div className={styles.messageAttachmentsContainer}>
          {attachments.map((attachment, index) => (
            <div className={styles.messageAttachment} key={index}>
              <div className={styles.messageAttachmentName}>
                {attachment.filename}
              </div>
              <div className="font-normal text-neutral-600">
                ({getAttachmentSize(attachment)})
              </div>
              <button
                className={styles.uploaderButton}
                data-name={attachment?.filename}
                data-id={attachment.url}
                onClick={e => {
                  handleRemove()
                  onRemove(e)
                }}
              >
                <span
                  className="ciergio-close"
                  data-name={attachment?.filename}
                  data-id={attachment.url}
                />
              </button>
            </div>
          ))}
        </div>
      ) : null} */}
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
          {/* <div className="col-span-1 flex items-center justify-center">
          <img
            src="https://ui-avatars.com/api/?name=John+Doe&size=32"
            alt="avatar"
            className="rounded-full"
          />
        </div> */}
          <div className="relative col-span-12 py-2 px-4 flex items-center w-full">
            <MessageInput
              editorClassName="pr-16"
              placeholder="Write a message"
              onChange={handleEditorChange}
              onPressEnter={handlePressEnter}
              editorState={editorState}
            />
            <button
              className={`absolute right-4 bottom-9 px-4 flex items-center text-lg font-bold cursor-pointer ${
                disabledSendBtn ? 'text-neutral-400' : 'text-primary-500'
              }`}
              onClick={sendMessage}
            >
              <span>Send</span>
            </button>
          </div>

          {/* NOTE: temporarily removed to align with old UI */}
          {/* <div className="col-span-1 flex items-center justify-center">
           <div className={containerClass}>
            <input
              type="file"
              id="attachment"
              name="attachment"
              multiple
              onChange={onUpload}
              accept="image/jpg, image/jpeg, image/png, .pdf, .doc, .docx"
              disabled={!conversation}
              className={`hidden ${!conversation ? 'cursor-not-allowed' : ''}`}
            />
            <div
              role="button"
              tabIndex={0}
              onKeyDown={() => {}}
              onClick={handleChange}
              onDrop={handleOnDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              {loading ? (
                <FaSpinner className="icon-spin" />
              ) : (
                <FiImage className="w-4 h-4 cursor-pointer" />
              )}
            </div>
          </div> 
        </div> */}
        </div>
      </div>
    </div>
  )
}

MessageBox.propTypes = {
  endMessageRef: P.any,
  participant: P.object,
  conversation: P.object,
  loading: P.bool,
  currentUserid: P.string,
  onSubmitMessage: P.func,
  attachmentURLs: P.array,
  onUpload: P.func,
  onRemove: P.func,
  attachments: P.array,
  newMessage: P.bool,
  onReadNewMessage: P.func,
  onFetchMoreMessage: P.func
}
