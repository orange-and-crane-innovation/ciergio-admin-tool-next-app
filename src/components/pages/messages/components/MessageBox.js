import P from 'prop-types'
import Dropdown from '@app/components/dropdown'
import { AiOutlineEllipsis } from 'react-icons/ai'
import { FiImage } from 'react-icons/fi'
import useWindowDimensions from '@app/utils/useWindowDimensions'
import styles from '../messages.module.css'

export default function MessageBox({ messageTitle }) {
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

  return (
    <div className={styles.messagesBoxContainer}>
      <div className={styles.messageBoxHeader}>
        <h2 className="font-bold text text-base">{messageTitle}</h2>
        <Dropdown label={<AiOutlineEllipsis />} items={dropdownData} />
      </div>
      <div
        className={styles.messageBoxList}
        style={{ height: `calc(${height}px - 175px)` }}
      ></div>
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
  messageTitle: P.string
}
