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
  children
}) {
  return (
    <div className={['modal-overlay', visible ? 'flex' : 'hidden'].join(' ')}>
      <div className="modal">
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
        <div className="modal-content">{children}</div>
        {footer !== null ? (
          <div className="modal-footer">
            <Button
              default
              label={cancelText}
              onClick={onCancel}
              className="mr-4 w-full"
            />
            <Button primary label={okText} onClick={onOk} className=" w-full" />
          </div>
        ) : null}
      </div>
    </div>
  )
}

Component.defaultProps = {
  cancelText: 'Cancel',
  okText: 'Ok'
}

Component.propTypes = {
  title: P.string,
  visible: P.bool.isRequired,
  onClose: P.func.isRequired,
  children: P.string || P.element,
  okText: P.string,
  cancelText: P.string,
  onOk: P.func,
  onCancel: P.func,
  footer: P.bool
}

export default Component
