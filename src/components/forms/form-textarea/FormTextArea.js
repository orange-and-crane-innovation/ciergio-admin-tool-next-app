import React, { useState, useMemo, useEffect } from 'react'
import clsx from 'clsx'
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

import styles from './FormTextArea.module.css'

const FormTextArea = ({
  maxLength,
  placeholder,
  options,
  withCounter,
  value,
  error,
  hasPreview,
  onChange,
  isEdit,
  toolbarHidden,
  editorClassName
}) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty())

  const containerClasses = useMemo(
    () =>
      clsx(styles.FormTextAreaSubContainer, {
        [styles.hasError]: !!error
      }),
    [error]
  )

  const Editor = dynamic(
    () => {
      return import('react-draft-wysiwyg').then(mod => mod.Editor)
    },
    { ssr: false }
  )

  const onEditorStateChange = e => {
    setEditorState(e)
    onChange(draftToHtml(convertToRaw(editorState.getCurrentContent())))
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
    <div className={styles.FormTextAreaContainer}>
      <div className={containerClasses}>
        <Editor
          editorClassName={editorClassName}
          toolbarHidden={toolbarHidden}
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
      </div>

      <div className={styles.FormTextContainer}>
        <div className={styles.FormError}>{error}</div>
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
      </div>

      {hasPreview && (
        <textarea
          disabled
          value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
        />
      )}
    </div>
  )
}

FormTextArea.defaultProps = {
  toolbarHidden: false
}

FormTextArea.propTypes = {
  editorState: P.any,
  maxLength: P.number,
  placeholder: P.string,
  options: P.array,
  withCounter: P.bool,
  hasPreview: P.bool,
  value: P.any,
  error: P.string,
  onChange: P.func,
  isEdit: P.bool,
  toolbarHidden: P.bool,
  editorClassName: P.string
}

export default FormTextArea
