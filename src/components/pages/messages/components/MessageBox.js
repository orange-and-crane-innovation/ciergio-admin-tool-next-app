import { useState, useMemo } from 'react'
import P from 'prop-types'
import Dropdown from '@app/components/dropdown'
import Spinner from '@app/components/spinner'
import { AiOutlineEllipsis } from 'react-icons/ai'
import { FiImage } from 'react-icons/fi'
import { BsCheckAll } from 'react-icons/bs'
import useWindowDimensions from '@app/utils/useWindowDimensions'
import styles from '../messages.module.css'

export default function MessageBox({
  participant,
  conversation,
  loading,
  currentUserid,
  onSubmitMessage
}) {
  const [messageText, setMessageText] = useState('')
  const { height } = useWindowDimensions()
  const dropdownData = [
    {
      label: 'Group',
      icon: null,
      function: () => {}
    },
    {
      label: 'Personal',
      icon: null,
      function: () => {}
    }
  ]

  const messages = useMemo(() => {
    return Array.isArray(conversation?.data)
      ? [...conversation?.data]?.reverse()
      : conversation?.data
  }, [conversation?.data])
  const user = useMemo(() => {
    return participant?.participants?.data[1]?.user
  }, [participant?.participants])
  const unitName = useMemo(() => {
    return participant?.participants?.data[1]?.unit?.name
  }, [participant?.participants])
  const name = `${user?.firstName} ${user?.lastName}`

  return (
    <div className={styles.messagesBoxContainer}>
      <div className={styles.messageBoxHeader}>
        <h2 className="font-bold text text-base">{`${
          unitName || 'Unit 000'
        } - ${name}`}</h2>
        <Dropdown label={<AiOutlineEllipsis />} items={dropdownData} />
      </div>
      <div
        className={styles.messageBoxList}
        style={{ height: `calc(${height}px - 175px)` }}
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
                      isCurrentUserMessage ? 'justify-end ' : 'justify-start '
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
                      : 'bg-white '
                  }py-2 px-3 border-none w-11/12 rounded shadow-none h-16 relative`}
                >
                  <p className="font-sm">{item.message}</p>
                  {index === messages.length - 1 && item.status === 'seen' ? (
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
      <div className={styles.messageBoxInput}>
        <div className="col-span-1 flex items-center justify-center">
          <img
            src="https://ui-avatars.com/api/?name=John+Doe&size=32"
            alt="avatar"
            className="rounded-full"
          />
        </div>
        <div className="col-span-10 py-2">
          <input
            type="text"
            placeholder="Type your message here"
            className="w-full h-8 border-0 outline-none"
            onChange={e => setMessageText(e.target.value)}
            value={messageText}
            onKeyPress={e => {
              if (e.key === 'Enter') {
                onSubmitMessage(e.target.value)
                setMessageText('')
              }
            }}
          />
        </div>
        <div className="col-span-1 flex items-center justify-center">
          <FiImage className="w-4 h-4 cursor-pointer" />
        </div>
      </div>
    </div>
  )
}

MessageBox.propTypes = {
  participant: P.object,
  conversation: P.object,
  loading: P.bool,
  currentUserid: P.number,
  onSubmitMessage: P.func
}
