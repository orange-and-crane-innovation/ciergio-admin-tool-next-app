import React, { useState } from 'react'

import P from 'prop-types'
import dynamic from 'next/dynamic'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

const FormTextArea = ({ maxLength, placeholder, options, withCounter }) => {
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
  placeholder: P.string,
  options: P.array,
  withCounter: P.bool
}

export default FormTextArea
