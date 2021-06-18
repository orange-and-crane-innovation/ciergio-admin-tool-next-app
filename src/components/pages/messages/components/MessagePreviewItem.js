import { useMemo } from 'react'
import P from 'prop-types'

import Tooltip from '@app/components/tooltip'
import getAccountTypeName from '@app/utils/getAccountTypeName'

import { displayDays, toFriendlyDateTime } from '@app/utils/date'

import styles from '../messages.module.css'

export default function MessagePreviewItem({
  onClick,
  data,
  isSelected,
  currentUserid,
  currentAccountId,
  convoId,
  newMessage
}) {
  const user = useMemo(() => {
    if (data?.participants?.data?.length === 2) {
      return data.participants.data.filter(
        item => item?.user?._id !== currentUserid
      )[0]?.user
    } else if (data?.participants?.data?.length > 1) {
      return data.participants.data.filter(item =>
        ['member', 'unit_owner', 'resident'].includes(item.accountType)
      )[0]?.user
    }
  }, [data?.participants])

  const accountType = useMemo(() => {
    if (data?.participants?.data?.length === 2) {
      return data.participants.data.filter(
        item => item?.user?._id !== currentUserid
      )[0]?.accountType
    } else if (data?.participants?.data?.length > 1) {
      return data.participants.data.filter(item =>
        ['member', 'unit_owner', 'resident'].includes(item.accountType)
      )[0]?.accountType
    }
  }, [data?.participants])

  const name = `${user?.firstName} ${user?.lastName}`
  const messages =
    newMessage && convoId === newMessage?.conversation?._id
      ? newMessage
      : data?.messages?.data[0]
  const newestMessage = messages?.message
  const isSeen =
    messages?.viewers?.data?.findIndex(
      viewer => viewer?.user?._id === currentUserid
    ) !== -1

  const previewTextState = isSeen ? 'font-normal' : 'font-bold'
  const defaultAvatarUri = `https://ui-avatars.com/api/?name=${name}&size=32`

  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={() => {}}
      className={`${styles.messagePreviewItem}${
        isSelected
          ? ' bg-primary-50 border-r-2 border-primary-500 '
          : ' bg-white'
      }`}
      onClick={() => onClick(data)}
    >
      <div className="mr-4">
        <div className="w-12 h-12 rounded-full overflow-auto">
          <img
            className="h-full w-full object-contain object-center"
            src={user?.avatar ?? defaultAvatarUri}
            alt={`${user?.firstName} ${user?.lastName}`}
          />
        </div>
      </div>
      <div className=" pr-24 min-w-4xs truncate">
        <p className={`${previewTextState} capitalize truncate max-w-xs`}>
          {`${getAccountTypeName(accountType)} -  ${name}`}
        </p>
        <p className={`${previewTextState} truncate max-w-2xs`}>
          {newestMessage ?? 'Start writing a message'}
        </p>
      </div>
      <div className="absolute right-6 text-neutral-500">
        <Tooltip text={toFriendlyDateTime(data?.updatedAt)} effect="solid">
          <span className={styles.updateDate}>
            {displayDays(data?.updatedAt)}
          </span>
        </Tooltip>
      </div>
      {!isSeen && !isSelected ? (
        <div className="w-3 h-3 bg-primary-500 rounded-full absolute right-6 bottom-6" />
      ) : null}
    </div>
  )
}

MessagePreviewItem.propTypes = {
  onClick: P.func,
  data: P.object,
  isSelected: P.bool,
  currentUserid: P.string,
  currentAccountId: P.string,
  convoId: P.string,
  newMessage: P.object
}
