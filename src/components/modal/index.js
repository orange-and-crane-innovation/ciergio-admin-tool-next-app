import P from 'prop-types'
import Button from '@app/components/button'

function Component({
  title,
  visible,
  onShow,
  okText,
  cancelText,
  onOk,
  onCancel,
  children
}) {
  return (
    <div className={['modal-overlay', visible ? 'flex' : 'hidden'].join(' ')}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">
            <span className="text-black text-base font-bold">{title}</span>
          </div>
          <div className="modal-close-icon">
            <span
              className="ciergio-close absolute p-4 hover:cursor-pointer relative top-0"
              onClick={onShow}
              onKeyDown={onShow}
              role="button"
              tabIndex={0}
            />
          </div>
        </div>
        <div className="modal-content">{children}</div>
        <div className="modal-footer">
          <Button
            default
            label={cancelText}
            onClick={onCancel}
            className="mr-4 w-full"
          />
          <Button primary label={okText} onClick={onOk} className=" w-full" />
        </div>
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
  onShow: P.func.isRequired,
  children: P.string || P.element,
  okText: P.string,
  cancelText: P.string,
  onOk: P.func,
  onCancel: P.func
}

export default Component
