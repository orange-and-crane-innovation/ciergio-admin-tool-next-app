import P from 'prop-types'
import styles from '../messages.module.css'

export default function MessagePreviewItem({ onClick, name }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={() => {}}
      className={styles.messagePreviewItem}
      onClick={() => onClick(name)}
    >
      <div className="mr-4">
        <img
          src="https://ui-avatars.com/api/?name=John+Doe&size=32"
          alt="avatar"
          className="rounded-full"
        />
      </div>
      <div>
        <p>Unit 302 - Leia Alexander</p>
        <p>{`I'm expecting food delivery soon!`}</p>
      </div>
      <div className="absolute right-4 top-2 text-neutral-500">
        <span>10:00AM</span>
      </div>
    </div>
  )
}

MessagePreviewItem.propTypes = {
  onClick: P.func,
  name: P.string
}
