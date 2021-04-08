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
  return (
    <div className={styles.MessageInputContainer}>
      <div className={styles.MessageInputSubContainer}>
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
