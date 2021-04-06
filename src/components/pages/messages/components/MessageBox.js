import { useState, useMemo } from 'react'
import P from 'prop-types'
import Spinner from '@app/components/spinner'
import useWindowDimensions from '@app/utils/useWindowDimensions'
import { BsCheckAll } from 'react-icons/bs'
import styles from '../messages.module.css'
import MessageInput from './MessageInput'

export default function MessageBox({
  participant,
  conversation,
  loading,
  currentUserid,
  onSubmitMessage,
  // onUpload,
  attachments
  // onRemove
}) {
  const [message, setMessage] = useState(undefined)
  const [disabledSendBtn, setDisabledSendBtn] = useState(true)
  const { height } = useWindowDimensions()
  // const [isOver, setIsOver] = useState(false)

  const messages = useMemo(() => {
    return Array.isArray(conversation?.data)
      ? [...conversation?.data]?.reverse()
      : conversation?.data
  }, [conversation?.data])

  const user = useMemo(() => {
    if (participant?.participants?.data?.length > 1) {
      return participant.participants.data[1]?.user
    }
  }, [participant?.participants])

  const name = `${user?.firstName} ${user?.lastName}`

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

  const handleEditorChange = msg => {
    console.log({ msg })
    if (msg) {
      setDisabledSendBtn(false)
    } else {
      setDisabledSendBtn(true)
    }
    setMessage(msg)
  }

  return (
    <div className={styles.messagesBoxContainer}>
      <div className={styles.messageBoxHeader}>
        {user?.firstName && user?.lastName ? (
          <h2 className="font-bold text text-base">{`Member - ${
            name || ''
          }`}</h2>
        ) : (
          <div />
        )}
        {/* NOTE: temporarily removed to align with old UI */}
        {/* <Dropdown label={<AiOutlineEllipsis />} items={dropdownData} /> */}
      </div>
      <div
        className={styles.messageBoxList}
        style={{
          height: `calc(${height}px - ${
            attachments?.length > 0 ? '217' : '175'
          }px)`
        }}
      >
        {loading && messages?.length === 0 ? <Spinner /> : null}
        {!loading && messages?.length > 0 ? (
          messages.map((item, index) => {
            const author = item.author.user
            const authorName = `${author?.firstName} ${author?.lastName}`
            const accountType = item?.author?.accountType.replace('_', ' ')
            const isCurrentUserMessage = parseInt(author._id) === currentUserid
            const defaultAvatarUri = `https://ui-avatars.com/api/?name=${authorName}&size=32`

            return (
              <div
                key={item._id}
                className={`${
                  isCurrentUserMessage ? 'self-end ' : 'self-start '
                }w-8/12 mt-2`}
              >
                {messages[index - 1]?.author.user._id !== author._id ? (
                  <div
                    className={`capitalize flex items-center ${
                      isCurrentUserMessage
                        ? 'justify-end '
                        : 'flex-row-reverse justify-end '
                    }`}
                  >
                    <span className="block mr-">{`${accountType} - ${authorName}`}</span>
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
                  <p className="font-sm">{item.message}</p>
                  {index === messages.length - 1 &&
                  isCurrentUserMessage &&
                  (item.status === 'seen' || item.viewers.length > 0) ? (
                    <div className="absolute right-4 bottom-2">
                      <BsCheckAll className="w-5 h-5" />
                    </div>
                  ) : null}
                </div>
              </div>
            )
          })
        ) : (
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
      <div className={styles.messageBoxInput}>
        {/* NOTE: temporarily removed to align with old UI */}
        {/* <div className="col-span-1 flex items-center justify-center">
          <img
            src="https://ui-avatars.com/api/?name=John+Doe&size=32"
            alt="avatar"
            className="rounded-full"
          />
        </div> */}
        <div className="col-span-11 py-2 px-4 flex items-center w-full">
          <MessageInput
            placeholder="Write a message"
            value={message}
            onChange={handleEditorChange}
          />
          <div
            className={`pl-4 flex items-center text-lg font-bold cursor-pointer ${
              disabledSendBtn ? 'text-neutral-400' : 'text-primary-500'
            }`}
          >
            <span>Send</span>
          </div>
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
  )
}

MessageBox.propTypes = {
  participant: P.object,
  conversation: P.object,
  loading: P.bool,
  currentUserid: P.number,
  onSubmitMessage: P.func,
  attachmentURLs: P.array,
  onUpload: P.func,
  onRemove: P.func,
  attachments: P.array
}
