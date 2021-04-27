import { useRef } from 'react'
import P from 'prop-types'
import dynamic from 'next/dynamic'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import styles from './MessageInput.module.css'

const Editor = dynamic(
  () => {
    return import('react-draft-wysiwyg').then(mod => mod.Editor)
  },
  { ssr: false }
)

const MessageInput = ({
  options,
  onChange,
  editorClassName,
  onPressEnter,
  editorState
}) => {
  const inputHeight = useRef()
  const textHeight =
    inputHeight?.current?.children[0]?.children[0]?.clientHeight

  return (
    <div className={styles.MessageInputContainer}>
      <div
        ref={inputHeight}
        className={`${styles.MessageInputSubContainer} ${
          textHeight > 160
            ? styles.MessageInputOverflowSix
            : textHeight > 139
            ? styles.MessageInputOverflowFive
            : textHeight > 118
            ? styles.MessageInputOverflowFour
            : textHeight > 77
            ? styles.MessageInputOverflowThree
            : textHeight > 56
            ? styles.MessageInputOverflowTwo
            : ''
        }`}
      >
        <Editor
          toolbarHidden
          spellCheck
          stripPastedStyles
          placeholder="Write a message"
          editorClassName={editorClassName}
          editorState={editorState}
          onEditorStateChange={onChange}
          toolbar={{
            options: options,
            inline: {
              options: ['bold', 'italic', 'underline', 'strikethrough']
            },
            list: {
              options: ['unordered', 'ordered']
            },
            colorPicker: {
              colors: [
                'rgb(19,33,55)',
                'rgb(10,102,227)',
                'rgb(135,180,239)',
                'rgb(61,207,83)',
                'rgb(244,67,54)'
              ]
            },
            link: {
              defaultTargetOption: '_blank'
            }
          }}
          keyBindingFn={onPressEnter}
        />
      </div>
    </div>
  )
}

MessageInput.propTypes = {
  options: P.array,
  onChange: P.func,
  editorClassName: P.string,
  onPressEnter: P.func,
  editorState: P.object
}

export default MessageInput
