import React, { useState, useEffect } from 'react'
import P from 'prop-types'
import dynamic from 'next/dynamic'
import {
  EditorState,
  convertToRaw,
  ContentState,
  convertFromHTML
} from 'draft-js'
import draftToHtml from 'draftjs-to-html'
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
  value,
  onChange,
  isEdit,
  editorClassName
}) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty())

  const onEditorStateChange = e => {
    setEditorState(e)
    onChange(draftToHtml(convertToRaw(e.getCurrentContent())))
  }

  useEffect(() => {
    if (isEdit && value !== null) {
      setEditorState(
        EditorState.createWithContent(
          ContentState.createFromBlockArray(convertFromHTML(value))
        )
      )
    }
  }, [isEdit, value])

  return (
    <div className={`${styles.MessageInputContainer}`}>
      <div className={styles.MessageInputSubContainer}>
        <Editor
          toolbarHidden
          spellCheck
          stripPastedStyles
          placeholder="Write a message"
          editorClassName={editorClassName}
          editorState={editorState}
          onEditorStateChange={onEditorStateChange}
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
        />
      </div>
    </div>
  )
}

MessageInput.propTypes = {
  editorState: P.any,
  options: P.array,
  value: P.any,
  onChange: P.func,
  isEdit: P.bool,
  editorClassName: P.string
}

export default MessageInput
