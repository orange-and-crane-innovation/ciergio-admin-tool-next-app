import P from 'prop-types'
import { displayDateCreated } from '@app/utils/date'
import styles from '../messages.module.css'

export default function MessagePreviewItem({
  onClick,
  data,
  isSelected,
  currentUserid
}) {
  const participant = data?.participants?.data?.[1]?.user
  const participantName = `${participant?.firstName} ${participant?.lastName}`
  const previewHead = `${
    participant?.unit?.name || 'Unit 000'
  } - ${participantName}`
  const newestMessage = data?.messages?.data[0]?.message
  const isSeen =
    data?.messages?.viewers?.data?.findIndex(
      viewer => parseInt(viewer?.user?._id) === currentUserid
    ) !== -1
  const previewTextState = isSeen ? 'font-normal' : 'font-bold'
  const defaultAvatarUri = `https://ui-avatars.com/api/?name=${participantName}&size=32`

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
        <img
          src={participant?.avatar || defaultAvatarUri}
          alt={participantName}
          className="rounded-full h-8 w-8"
        />
      </div>
      <div>
        <p className={`${previewTextState} capitalize`}>{previewHead}</p>
        <p className={`${previewTextState} truncate`}>
          {newestMessage ?? 'Start writing a message'}
        </p>
      </div>
      <div className="absolute right-4 top-2 text-neutral-500">
        <span>{displayDateCreated(data?.updatedAt)}</span>
      </div>
      {!isSeen && !isSelected ? (
        <div className="w-3 h-3 bg-primary-500 rounded-full absolute right-4 bottom-10" />
      ) : null}
    </div>
  )
}

MessagePreviewItem.propTypes = {
  onClick: P.func,
  data: P.object,
  isSelected: P.bool,
  currentUserid: P.number
}
