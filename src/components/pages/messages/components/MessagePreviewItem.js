import P from 'prop-types'
import { displayDays } from '@app/utils/date'
import styles from '../messages.module.css'

export default function MessagePreviewItem({
  onClick,
  data,
  isSelected,
  currentUserid
}) {
  const author = data?.author?.user
  const authorName = `${author?.firstName} ${author?.lastName}`
  const previewHead = `${data?.author?.accountType} - ${authorName}`
  const newestMessage = data?.messages?.data[0]?.message
  const isSeen =
    data?.messages?.viewers?.data?.findIndex(
      viewer => parseInt(viewer?.user?._id) === currentUserid
    ) !== -1
  const previewTextState = isSeen ? 'font-normal' : 'font-bold'
  const defaultAvatarUri = `https://ui-avatars.com/api/?name=${authorName}&size=32`

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
          src={author?.avatar ?? defaultAvatarUri}
          alt={authorName}
          className="rounded-full h-12 w-12"
        />
      </div>
      <div>
        <p className={`${previewTextState} capitalize truncate max-2xs`}>
          {previewHead}
        </p>
        <p className={`${previewTextState} truncate max-w-2xs`}>
          {newestMessage ?? 'Start writing a message'}
        </p>
      </div>
      <div className="absolute right-8 text-neutral-500">
        <span className={styles.updateDate}>
          {displayDays(data?.updatedAt)}
        </span>
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
