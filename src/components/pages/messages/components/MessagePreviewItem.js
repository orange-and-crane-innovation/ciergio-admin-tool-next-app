import P from 'prop-types'
import { displayDateCreated } from '@app/utils/date'
import styles from '../messages.module.css'

export default function MessagePreviewItem({ onClick, data }) {
  const author = data?.author?.user
  const authorName = `${author?.firstName} ${author?.lastName}`
  const previewHead = `${author?.unit?.name || 'Unit 000'} - ${authorName}`
  const newestMessage = data?.messages?.data[0]?.message
  const previewTextState = data?.selected ? 'font-normal' : 'font-bold'
  const defaultAvatarUri = `https://ui-avatars.com/api/?name=${authorName}&size=32`

  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={() => {}}
      className={styles.messagePreviewItem}
      onClick={() => onClick(authorName)}
    >
      <div className="mr-4">
        <img
          src={author?.avatar || defaultAvatarUri}
          alt={authorName}
          className="rounded-full h-8 w-8"
        />
      </div>
      <div>
        <p className={previewTextState}>{previewHead}</p>
        <p className={`${previewTextState} truncate`}>{newestMessage}</p>
      </div>
      <div className="absolute right-4 top-2 text-neutral-500">
        <span>{displayDateCreated(data?.createdAt)}</span>
      </div>
      <div className="w-3 h-3 bg-red-400 rounded-full absolute right-4 bottom-10" />
    </div>
  )
}

MessagePreviewItem.propTypes = {
  onClick: P.func,
  data: P.object
}
