import React, { useState, useMemo, useEffect } from 'react'
import clsx from 'clsx'
import P from 'prop-types'
import dynamic from 'next/dynamic'
import { EditorState, ContentState, RichUtils, Modifier } from 'draft-js'
import { stateToHTML } from 'draft-js-export-html'
import htmlToDraft from 'html-to-draftjs'

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

import styles from './FormTextArea.module.css'

const Editor = dynamic(
  () => {
    return import('react-draft-wysiwyg').then(mod => mod.Editor)
  },
  { ssr: false }
)

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
  stripHtmls,
  editorClassName
}) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty())
  const defaultOptions = {
    defaultBlockTag: 'div'
  }

  const containerClasses = useMemo(
    () =>
      clsx(styles.FormTextAreaSubContainer, {
        [styles.hasError]: !!error
      }),
    [error]
  )

  const onEditorStateChange = e => {
    const content = e.getCurrentContent()
    const isEditorEmpty = !content.hasText()
    const currentPlainText = content.getPlainText()
    const lengthOfTrimmedContent = currentPlainText.trim().length
    const isContainOnlySpaces = !isEditorEmpty && !lengthOfTrimmedContent

    setEditorState(e)

    if (!isContainOnlySpaces) {
      if (stripHtmls) {
        onChange(currentPlainText)
      } else {
        onChange(stateToHTML(content, defaultOptions))
      }
    } else {
      onChange('')
    }
  }

  useEffect(() => {
    if (isEdit && value !== null) {
      setEditorState(
        EditorState.createWithContent(
          ContentState.createFromBlockArray(htmlToDraft(value))
        )
      )
    }
  }, [isEdit, value])

  const onTab = e => {
    e.preventDefault()
    const currentState = editorState

    const selection = currentState.getSelection()
    const blockType = currentState
      .getCurrentContent()
      .getBlockForKey(selection.getStartKey())
      .getType()

    if (
      blockType === 'unordered-list-item' ||
      blockType === 'ordered-list-item'
    ) {
      setEditorState(RichUtils.onTab(e, currentState, 3))
    } else {
      const newContentState = Modifier.replaceText(
        currentState.getCurrentContent(),
        currentState.getSelection(),
        '    '
      )

      setEditorState(
        EditorState.push(currentState, newContentState, 'insert-characters')
      )
    }
  }

  return (
    <div className={styles.FormTextAreaContainer}>
      <div className={containerClasses}>
        <Editor
          editorClassName={editorClassName}
          toolbarHidden={toolbarHidden}
          editorState={editorState}
          placeholder={placeholder}
          spellCheck={true}
          stripPastedStyles={true}
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
          onTab={onTab}
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
          className="h-64"
          disabled
          value={stateToHTML(editorState.getCurrentContent(), defaultOptions)}
        />
      )}
    </div>
  )
}

FormTextArea.defaultProps = {
  toolbarHidden: false,
  stripHtmls: false
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
  stripHtmls: P.bool,
  editorClassName: P.string
}

export default FormTextArea
