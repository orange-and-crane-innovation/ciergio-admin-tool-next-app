import React, { useState } from 'react'

import P from 'prop-types'
import dynamic from 'next/dynamic'
import { EditorState, convertToRaw } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

import styles from './FormTextArea.module.css'

const FormTextArea = ({ maxLength, placeholder, options, withCounter }) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty())

  const Editor = dynamic(
    () => {
      return import('react-draft-wysiwyg').then(mod => mod.Editor)
    },
    { ssr: false }
  )

  const onEditorStateChange = e => {
    setEditorState(e)
  }

  return (
    <div className={styles.FormTextAreaContainer}>
      <Editor
        editorState={editorState}
        placeholder={placeholder}
        toolbar={{
          options: options
        }}
        onEditorStateChange={onEditorStateChange}
        handleBeforeInput={val => {
          const textLength = editorState.getCurrentContent().getPlainText()
            .length
          if (val && textLength >= maxLength) {
            return 'handled'
          }
          return 'not-handled'
        }}
        handlePastedText={val => {
          const textLength = editorState.getCurrentContent().getPlainText()
            .length
          return val.length + textLength >= maxLength
        }}
      />
      {withCounter && (
        <div className={styles.FormCounter}>
          {`${
            maxLength -
            ((editorState &&
              editorState.getCurrentContent().getPlainText().length) ||
              0)
          } character(s) left`}
        </div>
      )}
      <textarea
        disabled
        value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
      />
    </div>
  )
}

FormTextArea.propTypes = {
  editorState: P.any,
  maxLength: P.number,
  placeholder: P.string,
  options: P.array,
  withCounter: P.bool
}

export default FormTextArea
