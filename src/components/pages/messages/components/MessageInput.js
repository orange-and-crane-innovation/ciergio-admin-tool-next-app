import { useEffect, useState, useRef } from 'react'
import P from 'prop-types'
import dynamic from 'next/dynamic'
import { EditorState } from 'draft-js'

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import styles from './MessageInput.module.css'

const Editor = dynamic(
  () => {
    return import('react-draft-wysiwyg').then(mod => mod.Editor)
  },
  { ssr: false }
)

const MessageInput = ({ message, editorClassName, onChange, onPressEnter }) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty())
  const inputHeight = useRef()
  const textHeight =
    inputHeight?.current?.children[0]?.children[0]?.clientHeight

  useEffect(() => {
    if (!message) {
      setEditorState(EditorState.createEmpty())
    }
  }, [message])

  const handleEditorChange = e => {
    const content = e.getCurrentContent()
    const isEditorEmpty = !content.hasText()
    const currentPlainText = content.getPlainText()
    const lengthOfTrimmedContent = currentPlainText.trim().length
    const isContainOnlySpaces = !isEditorEmpty && !lengthOfTrimmedContent

    setEditorState(e)

    if (!isContainOnlySpaces && !isEditorEmpty) {
      onChange(currentPlainText)
    } else {
      onChange(null)
    }
  }

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
          onEditorStateChange={handleEditorChange}
          keyBindingFn={onPressEnter}
        />
      </div>
    </div>
  )
}

MessageInput.propTypes = {
  message: P.string,
  onChange: P.func,
  editorClassName: P.string,
  onPressEnter: P.func,
  editorState: P.object
}

export default MessageInput
