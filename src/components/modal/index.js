import { useEffect } from 'react'
import P from 'prop-types'

import Button from '@app/components/button'

function Component({
  title,
  visible,
  onClose,
  okText,
  cancelText,
  onOk,
  onCancel,
  footer,
  children,
  okButtonProps,
  animationClassName
}) {
  const body = document.getElementsByTagName('body')[0]

  useEffect(() => {
    if (visible) {
      body.classList.add('openModal')
    }

    return () => {
      body.classList.remove('openModal')
    }
  }, [body, visible])

  if (!visible) return null

  return (
    <div
      aria-label={`modal ${!visible ? animationClassName : ''}`}
      className="modal-overlay"
    >
      <div className="modal">
        {title ? (
          <div className="modal-header">
            <div className="modal-title">
              <span>{title}</span>
            </div>
            <div className="modal-close-icon">
              <span
                className="ciergio-close absolute p-4 hover:cursor-pointer relative top-0"
                onClick={onClose}
                onKeyDown={onClose}
                role="button"
                tabIndex={0}
              />
            </div>
          </div>
        ) : null}
        <div className="modal-content">{children}</div>
        {footer !== null ? (
          <div className="modal-footer">
            <Button
              default
              label={cancelText}
              onClick={onCancel}
              className="mr-4 w-full"
            />
            <Button
              primary
              label={okText}
              onClick={onOk}
              className="w-full"
              {...okButtonProps}
            />
          </div>
        ) : null}
      </div>
    </div>
  )
}

Component.defaultProps = {
  cancelText: 'Cancel',
  okText: 'Ok',
  animationClassName: 'animation-hide'
}

Component.propTypes = {
  title: P.string,
  visible: P.bool.isRequired,
  onClose: P.func.isRequired,
  children: P.any,
  okText: P.string,
  cancelText: P.string,
  onOk: P.func,
  onCancel: P.func,
  footer: P.bool,
  okButtonProps: P.object,
  animationClassName: P.string
}

export default Component
