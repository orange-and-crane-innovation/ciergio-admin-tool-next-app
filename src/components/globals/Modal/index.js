import ReactModal from 'react-modal'
import P from 'prop-types'
import Spinner from '@app/components/spinner'
import Button from '@app/components/button'

import styles from './Modal.module.css'

const customStyles = {
  overlay: {
    backgroundColor: 'rgba(19, 33, 55, 0.25)',
    zIndex: 1000
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    minHeight: 500,
    borderRadius: 4,
    overflowY: 'hidden',
    padding: 0
  }
}

ReactModal.setAppElement('#__next')

export default function Modal({
  children,
  width,
  title,
  cancelText,
  okText,
  okButtonProps,
  cancelButtonProps,
  onOk,
  onCancel,
  open,
  onShowModal,
  loading,
  footer
}) {
  return (
    <ReactModal
      isOpen={open}
      onRequestClose={onShowModal}
      contentLabel={title}
      style={{
        ...customStyles,
        content: {
          ...customStyles.content,
          width
        }
      }}
    >
      <div className={styles.modalContainer}>
        {title ? (
          <div className={styles.modalHeader}>
            <div className={styles.modalTitle}>
              <span>{title}</span>
            </div>
            <div className={styles.modalCloseIcon}>
              <span
                className={`ciergio-close ${styles.ciergoClose}`}
                onClick={onShowModal}
                onKeyDown={() => {}}
                role="button"
                tabIndex={0}
              />
            </div>
          </div>
        ) : null}
        <div className={styles.modalContent}>
          {loading ? <Spinner /> : children}
        </div>
        {footer !== null ? (
          <div className={styles.modalFooter}>
            <Button
              default
              label={cancelText}
              onClick={onCancel}
              {...cancelButtonProps}
            />
            <Button primary label={okText} onClick={onOk} {...okButtonProps} />
          </div>
        ) : null}
      </div>
    </ReactModal>
  )
}

Modal.defaultProps = {
  width: 450
}

Modal.propTypes = {
  children: P.oneOfType([P.element, P.node]),
  title: P.string,
  open: P.bool,
  onShowModal: P.func,
  loading: P.bool,
  width: P.oneOfType([P.number, P.string]),
  footer: P.oneOfType([P.bool, null]),
  onCancel: P.func,
  onOk: P.func,
  okText: P.oneOfType([P.element, P.node, P.string]),
  cancelText: P.oneOfType([P.element, P.node, P.string]),
  okButtonProps: P.object,
  cancelButtonProps: P.object
}
