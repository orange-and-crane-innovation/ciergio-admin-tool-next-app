import React, { useState } from 'react'

import P from 'prop-types'
import dynamic from 'next/dynamic'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

const FormTextArea = ({ maxLength, withCounter }) => {
  const [editorState, setEditorState] = useState()

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
    <div className="flex flex-col">
      <Editor
        editorState={editorState}
        placeholder={'Write your text here'}
        toolbar={{
          options: ['link', 'history']
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
        <div className="mt-2 text-right text-neutral-500">
          {`${
            maxLength -
            ((editorState &&
              editorState.getCurrentContent().getPlainText().length) ||
              0)
          } character(s) left`}
        </div>
      )}
    </div>
  )
}

FormTextArea.propTypes = {
  editorState: P.any,
  maxLength: P.number,
  withCounter: P.bool
}

export default FormTextArea
